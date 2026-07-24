'use server';

import { createClient } from '@/lib/supabase/server';
import { AdvertisementFormData } from '@/types/database';
import { revalidatePath } from 'next/cache';

// Create a new advertisement
export async function createAdvertisement(formData: AdvertisementFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  // Get user's business
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!business) {
    return { error: 'You need to register a business first.' };
  }

  const { error } = await supabase.from('advertisements').insert({
    business_id: business.id,
    title: formData.title,
    description: formData.description || null,
    category: formData.category,
    target_city: formData.target_city,
    status: 'pending',
  });

  if (error) return { error: error.message };

  revalidatePath('/dashboard/advertisements');
  return { success: true };
}

// Delete an advertisement
export async function deleteAdvertisement(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { error } = await supabase
    .from('advertisements')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/advertisements');
  return { success: true };
}

// Get current user's advertisements
export async function getMyAdvertisements() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get user's business first
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!business) return [];

  const { data } = await supabase
    .from('advertisements')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return data || [];
}
