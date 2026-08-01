'use server';

import { createClient } from '@/lib/supabase/server';
import { BusinessFormData, BusinessWithCategory } from '@/types/database';
import { generateSlug } from '@/utils/helpers';
import { ITEMS_PER_PAGE, POPULAR_CITIES } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

let categoriesCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // Cache for 60 seconds

// Get all active categories
export async function getCategories() {
  try {
    const now = Date.now();
    if (categoriesCache && now - categoriesCache.timestamp < CACHE_TTL_MS) {
      return categoriesCache.data;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) return [];
    const result = data || [];
    categoriesCache = { data: result, timestamp: now };
    return result;
  } catch (err) {
    console.error('Error in getCategories:', err);
    return [];
  }
}

// Get the current user's business
export async function getMyBusiness() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('businesses')
      .select('*, categories(id, name, slug)')
      .eq('owner_id', user.id)
      .single();

    return data as BusinessWithCategory | null;
  } catch (err) {
    console.error('Error in getMyBusiness:', err);
    return null;
  }
}

// Create a new business
export async function createBusiness(formData: FormData) {
  try {
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

    const business_name = formData.get('business_name') as string;
    const city = formData.get('city') as string;

    // Handle Payment Proof Upload (Max 5MB)
    const paymentProofFile = formData.get('payment_proof') as File | null;
    let payment_proof_url = null;

    if (paymentProofFile && paymentProofFile.size > 0) {
      const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit
      if (paymentProofFile.size > MAX_SIZE_BYTES) {
        return {
          error: `Upload failed: File size (${(paymentProofFile.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 5MB limit. Please upload an image smaller than 5MB.`,
        };
      }

      const fileExt = paymentProofFile.name.split('.').pop() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const arrayBuffer = await paymentProofFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payments')
        .upload(fileName, buffer, {
          contentType: paymentProofFile.type || 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Payment proof upload error:', uploadError);
        return { error: `Failed to upload payment proof: ${uploadError.message}` };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('payments')
        .getPublicUrl(fileName);

      payment_proof_url = publicUrlData.publicUrl;
    }

    // Generate unique slug
    let slug = generateSlug(business_name, city);
    
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
      category_id: formData.get('category_id') as string,
      slug,
      business_name,
      owner_name: formData.get('owner_name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      website: (formData.get('website') as string) || null,
      description: (formData.get('description') as string) || null,
      address: formData.get('address') as string,
      city,
      state: formData.get('state') as string,
      gst_number: (formData.get('gst_number') as string) || null,
      payment_proof_url,
      status: 'pending',
    });

    if (error) return { error: error.message };

    revalidatePath('/dashboard');
    revalidatePath('/admin/businesses');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to create business.' };
  }
}

// Update an existing business
export async function updateBusiness(formData: BusinessFormData) {
  try {
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
  } catch (err: any) {
    return { error: err.message || 'Failed to update business.' };
  }
}

// Get a business by slug (public — must be approved, unless caller is owner or admin)
export async function getBusinessBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('businesses')
      .select('*, categories(id, name, slug)')
      .eq('slug', slug)
      .single();

    if (!data) return null;

    if (data.status !== 'approved') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const isOwner = user.id === data.owner_id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      const isAdmin = profile?.role === 'admin';

      if (!isOwner && !isAdmin) {
        return null;
      }
    }

    return data as BusinessWithCategory | null;
  } catch (err) {
    console.error('Error in getBusinessBySlug:', err);
    return null;
  }
}

// Search businesses (public marketplace search — all approved businesses across platform)
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
  try {
    const supabase = await createClient();
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // Helper to build search queries
    const buildQuery = (strictMode: boolean = true) => {
      let queryBuilder = supabase
        .from('businesses')
        .select('*, categories(id, name, slug)', { count: 'exact' })
        .eq('status', 'approved');

      // ILIKE search across multiple fields (name, owner, description, city, state, address)
      if (query && query.trim()) {
        const cleanQuery = query.trim().replace(/[%_]/g, '\\$&');
        queryBuilder = queryBuilder.or(
          `business_name.ilike.%${cleanQuery}%,owner_name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,city.ilike.%${cleanQuery}%,state.ilike.%${cleanQuery}%,address.ilike.%${cleanQuery}%`
        );
      }

      // Filter by location (with alias resolution e.g. Mumbai ↔ Bombay)
      if (strictMode && city && city.trim()) {
        const parts = city.split(',').map((c) => c.trim()).filter(Boolean);
        const placeName = parts[0];
        const stateName = parts.length > 1 ? parts[parts.length - 1] : null;

        if (placeName) {
          const searchTerms = [placeName];
          const lower = placeName.toLowerCase();
          if (lower === 'mumbai') searchTerms.push('Bombay');
          if (lower === 'bombay') searchTerms.push('Mumbai');
          if (lower === 'bengaluru' || lower === 'bangalore') searchTerms.push('Bengaluru', 'Bangalore');
          if (lower === 'chennai' || lower === 'madras') searchTerms.push('Chennai', 'Madras');
          if (lower === 'vadodara' || lower === 'baroda') searchTerms.push('Vadodara', 'Baroda');

          const orConditions = searchTerms.flatMap((term) => [
            `city.ilike.%${term}%`,
            `address.ilike.%${term}%`,
            `state.ilike.%${term}%`,
          ]);

          if (stateName) {
            orConditions.push(`state.ilike.%${stateName}%`);
          }

          queryBuilder = queryBuilder.or(orConditions.join(','));
        }
      }

      return queryBuilder;
    };

    let { data, count, error } = await buildQuery(true)
      .order('created_at', { ascending: false })
      .range(from, to);

    // Fallback fuzzy search if strict query/filters return 0 results
    if ((!data || data.length === 0) && (query || city)) {
      let fallbackQuery = supabase
        .from('businesses')
        .select('*, categories(id, name, slug)', { count: 'exact' })
        .eq('status', 'approved');

      if (query && query.trim().length >= 3) {
        const clean = query.trim().replace(/[%_]/g, '');
        // Prefix slice for typos (e.g. "Swets" -> "Swe", "Textil" -> "Text")
        const prefix = clean.slice(0, Math.max(3, clean.length - 2));
        fallbackQuery = fallbackQuery.or(
          `business_name.ilike.%${prefix}%,description.ilike.%${prefix}%,city.ilike.%${prefix}%`
        );
      }

      const fallbackResult = await fallbackQuery
        .order('created_at', { ascending: false })
        .range(from, to);

      if (fallbackResult.data && fallbackResult.data.length > 0) {
        data = fallbackResult.data;
        count = fallbackResult.count;
      }
    }

    if (error) return { businesses: [], total: 0, totalPages: 0 };

    return {
      businesses: (data || []) as BusinessWithCategory[],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
    };
  } catch (err) {
    console.error('Error in searchBusinesses:', err);
    return { businesses: [], total: 0, totalPages: 0 };
  }
}

// Get latest approved businesses (for homepage)
export async function getLatestBusinesses(limit: number = 6) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('businesses')
      .select('*, categories(id, name, slug)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);

    return (data || []) as BusinessWithCategory[];
  } catch (err) {
    console.error('Error in getLatestBusinesses:', err);
    return [];
  }
}

// Get homepage stats
export async function getHomeStats() {
  try {
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
  } catch (err) {
    console.error('Error in getHomeStats:', err);
    return {
      totalBusinesses: 0,
      totalCategories: 0,
      totalCities: 0,
    };
  }
}

let citiesCache: { data: string[]; timestamp: number } | null = null;

// Get distinct cities for filter dropdown (combines popular cities with registered DB cities)
export async function getDistinctCities() {
  try {
    const now = Date.now();
    if (citiesCache && now - citiesCache.timestamp < CACHE_TTL_MS) {
      return citiesCache.data;
    }

    const supabase = await createClient();
    const { data } = await supabase
      .from('businesses')
      .select('city')
      .eq('status', 'approved');

    const dbCities = data?.map((b) => b.city).filter(Boolean) || [];
    const combined = Array.from(new Set([...POPULAR_CITIES, ...dbCities])).sort();
    citiesCache = { data: combined, timestamp: now };
    return combined;
  } catch (err) {
    console.error('Error in getDistinctCities:', err);
    return [...POPULAR_CITIES].sort();
  }
}
