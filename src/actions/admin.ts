'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Get admin dashboard stats
export async function getAdminStats() {
  const supabase = await createClient();

  const [users, businesses, pendingBiz, pendingAds] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('advertisements').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  return {
    totalUsers: users.count || 0,
    totalBusinesses: businesses.count || 0,
    pendingBusinesses: pendingBiz.count || 0,
    pendingAdvertisements: pendingAds.count || 0,
  };
}

// Get all businesses (admin)
export async function getAllBusinesses(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('businesses')
    .select('*, categories(id, name, slug)')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(
      `business_name.ilike.%${search}%,owner_name.ilike.%${search}%,city.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  const { data } = await query;
  return data || [];
}

// Update business status (admin)
export async function updateBusinessStatus(id: string, status: 'approved' | 'rejected') {
  const supabase = await createClient();

  const { error } = await supabase
    .from('businesses')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/businesses');
  revalidatePath('/businesses');
  revalidatePath('/');
  return { success: true };
}

// Delete a business (admin)
export async function adminDeleteBusiness(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/businesses');
  revalidatePath('/businesses');
  return { success: true };
}

// Get all advertisements (admin)
export async function getAllAdvertisements(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('advertisements')
    .select('*, businesses(id, business_name, slug)')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,category.ilike.%${search}%,target_city.ilike.%${search}%`
    );
  }

  const { data } = await query;
  return data || [];
}

// Update advertisement status (admin)
export async function updateAdStatus(id: string, status: 'approved' | 'rejected') {
  const supabase = await createClient();

  const { error } = await supabase
    .from('advertisements')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/advertisements');
  return { success: true };
}

// Delete an advertisement (admin)
export async function adminDeleteAdvertisement(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('advertisements')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/advertisements');
  return { success: true };
}

// Get all users (admin)
export async function getAllUsers(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data } = await query;
  return data || [];
}

// Delete a user (admin) — deletes from auth.users which cascades to profiles
export async function adminDeleteUser(id: string) {
  const supabase = await createClient();

  // We can't delete from auth.users via the client SDK with anon key.
  // Instead, delete from profiles table (which will cascade to businesses & ads)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  return { success: true };
}
