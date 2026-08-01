'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

// Strictly verify administrator access (Restricted ONLY to arhambizconnect@gmail.com)
async function verifyAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized: Authentication required.');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error(
      'Unauthorized: Administrator privileges required.'
    );
  }

  const adminDb = createAdminClient();
  return { supabase, adminDb, user, profile };
}

// Get admin dashboard stats
export async function getAdminStats() {
  const { supabase } = await verifyAdminAccess();

  const [users, businesses, pendingBiz, pendingAds] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id', { count: 'exact', head: true }),
    supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('advertisements')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
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
  const { supabase } = await verifyAdminAccess();

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
export async function updateBusinessStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  const { supabase } = await verifyAdminAccess();

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
  const { supabase } = await verifyAdminAccess();

  const { error } = await supabase.from('businesses').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/businesses');
  revalidatePath('/businesses');
  return { success: true };
}

// Get all advertisements (admin)
export async function getAllAdvertisements(search?: string) {
  const { supabase } = await verifyAdminAccess();

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
export async function updateAdStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  const { supabase } = await verifyAdminAccess();

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
  const { supabase } = await verifyAdminAccess();

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
  const { supabase } = await verifyAdminAccess();

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

// Get pending users (admin)
export async function getPendingUsers() {
  const { supabase } = await verifyAdminAccess();

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('registration_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}

// Update user registration status (admin)
export async function updateUserRegistrationStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  const { supabase } = await verifyAdminAccess();

  const { error } = await supabase
    .from('profiles')
    .update({ registration_status: status })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  revalidatePath('/dashboard');
  return { success: true };
}

// Delete a user (admin)
export async function adminDeleteUser(id: string) {
  const { supabase } = await verifyAdminAccess();

  const { error } = await supabase.from('profiles').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/users');
  return { success: true };
}
