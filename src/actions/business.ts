'use server';

import { createClient } from '@/lib/supabase/server';
import { BusinessFormData, BusinessWithCategory } from '@/types/database';
import { generateSlug } from '@/utils/helpers';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

// Get all active categories
export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data;
}

// Get the current user's business
export async function getMyBusiness() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('businesses')
    .select('*, categories(id, name, slug)')
    .eq('owner_id', user.id)
    .single();

  return data as BusinessWithCategory | null;
}

// Create a new business
export async function createBusiness(formData: BusinessFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  // Check if user already has a business
  const { data: existing } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (existing) {
    return { error: 'You already have a registered business.' };
  }

  // Generate unique slug
  let slug = generateSlug(formData.business_name, formData.city);
  
  // Check for slug collision and append suffix if needed
  const { data: slugCheck } = await supabase
    .from('businesses')
    .select('id')
    .eq('slug', slug)
    .single();

  if (slugCheck) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const { error } = await supabase.from('businesses').insert({
    owner_id: user.id,
    category_id: formData.category_id,
    slug,
    business_name: formData.business_name,
    owner_name: formData.owner_name,
    phone: formData.phone,
    email: formData.email,
    website: formData.website || null,
    description: formData.description || null,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    gst_number: formData.gst_number || null,
    status: 'pending',
  });

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  return { success: true };
}

// Update an existing business
export async function updateBusiness(formData: BusinessFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('businesses')
    .update({
      category_id: formData.category_id,
      business_name: formData.business_name,
      owner_name: formData.owner_name,
      phone: formData.phone,
      email: formData.email,
      website: formData.website || null,
      description: formData.description || null,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      gst_number: formData.gst_number || null,
    })
    .eq('owner_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/businesses');
  return { success: true };
}

// Get a business by slug (public — must be approved)
export async function getBusinessBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('businesses')
    .select('*, categories(id, name, slug)')
    .eq('slug', slug)
    .single();

  return data as BusinessWithCategory | null;
}

// Search businesses (public — only approved)
export async function searchBusinesses({
  query,
  category,
  city,
  page = 1,
}: {
  query?: string;
  category?: string;
  city?: string;
  page?: number;
}) {
  const supabase = await createClient();
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let queryBuilder = supabase
    .from('businesses')
    .select('*, categories(id, name, slug)', { count: 'exact' })
    .eq('status', 'approved');

  // ILIKE search across multiple fields
  if (query) {
    queryBuilder = queryBuilder.or(
      `business_name.ilike.%${query}%,owner_name.ilike.%${query}%,description.ilike.%${query}%,city.ilike.%${query}%`
    );
  }

  // Filter by category slug
  if (category) {
    // Get category ID from slug
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();

    if (cat) {
      queryBuilder = queryBuilder.eq('category_id', cat.id);
    }
  }

  // Filter by city
  if (city) {
    queryBuilder = queryBuilder.ilike('city', `%${city}%`);
  }

  const { data, count, error } = await queryBuilder
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    businesses: (data || []) as BusinessWithCategory[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
  };
}

// Get latest approved businesses (for homepage)
export async function getLatestBusinesses(limit: number = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('businesses')
    .select('*, categories(id, name, slug)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data || []) as BusinessWithCategory[];
}

// Get homepage stats
export async function getHomeStats() {
  const supabase = await createClient();

  const [businessesResult, categoriesResult, citiesResult] = await Promise.all([
    supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved'),
    supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('businesses')
      .select('city')
      .eq('status', 'approved'),
  ]);

  // Count unique cities
  const uniqueCities = new Set(citiesResult.data?.map((b) => b.city.toLowerCase()));

  return {
    totalBusinesses: businessesResult.count || 0,
    totalCategories: categoriesResult.count || 0,
    totalCities: uniqueCities.size,
  };
}

// Get distinct cities for filter dropdown
export async function getDistinctCities() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('businesses')
    .select('city')
    .eq('status', 'approved');

  const uniqueCities = [...new Set(data?.map((b) => b.city) || [])].sort();
  return uniqueCities;
}
