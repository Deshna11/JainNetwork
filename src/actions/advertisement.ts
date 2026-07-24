'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreateCampaignInput {
  businessId?: string;
  businessName: string;
  title: string;
  description: string;
  imageUrl?: string;
  ctaText?: string;
  targetCity?: string;
  category?: string;
  planId: string;
  planName: string;
  templateId: string;
  amount: number;
  durationDays: number;
  utrNumber: string;
  paymentProofUrl?: string;
  accountHolderName?: string;
}

// 1. Create a new ad campaign (set status to payment_verification)
export async function createCampaignAction(input: CreateCampaignInput) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated.' };

    const { data, error } = await supabase.from('advertisements').insert({
      user_id: user.id,
      business_id: input.businessId || null,
      title: input.title,
      description: input.description,
      image_url: input.imageUrl || null,
      cta_text: input.ctaText || 'Visit Business',
      target_city: input.targetCity || 'All India',
      category: input.category || 'General',
      plan_name: input.planName,
      template_id: input.templateId,
      amount: input.amount,
      duration_days: input.durationDays,
      utr_number: input.utrNumber,
      payment_proof_url: input.paymentProofUrl || null,
      account_holder_name: input.accountHolderName || null,
      status: 'payment_verification',
      payment_status: 'pending',
    }).select().single();

    if (error) return { error: error.message };

    revalidatePath('/dashboard/advertisements');
    revalidatePath('/admin/advertisements');
    return { success: true, campaign: data };
  } catch (err: any) {
    return { error: err.message || 'Failed to create campaign.' };
  }
}

// 2. Get current user's ad campaigns
export async function getUserCampaignsAction() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
      .from('advertisements')
      .select('*, businesses(business_name, owner_name, city)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return data || [];
  } catch (err) {
    console.error('Error in getUserCampaignsAction:', err);
    return [];
  }
}

// 3. Admin: Get all ad campaigns
export async function getAdminCampaignsAction() {
  try {
    const supabase = await createClient();

    const { data } = await supabase
      .from('advertisements')
      .select('*, businesses(business_name, owner_name, email, phone)')
      .order('created_at', { ascending: false });

    return data || [];
  } catch (err) {
    console.error('Error in getAdminCampaignsAction:', err);
    return [];
  }
}

// 4. Admin: Approve Payment & Activate Campaign (Status -> running)
export async function approvePaymentAction(campaignId: string) {
  try {
    const supabase = await createClient();

    // Fetch campaign to get duration_days
    const { data: campaign, error: fetchErr } = await supabase
      .from('advertisements')
      .select('duration_days')
      .eq('id', campaignId)
      .single();

    if (fetchErr || !campaign) return { error: 'Campaign not found.' };

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (campaign.duration_days || 30));

    const { error } = await supabase
      .from('advertisements')
      .update({
        payment_status: 'verified',
        status: 'running',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })
      .eq('id', campaignId);

    if (error) return { error: error.message };

    revalidatePath('/admin/advertisements');
    revalidatePath('/dashboard/advertisements');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to approve payment.' };
  }
}

// 5. Admin: Reject Payment (Status -> payment_failed)
export async function rejectPaymentAction(campaignId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('advertisements')
      .update({
        payment_status: 'rejected',
        status: 'payment_failed',
      })
      .eq('id', campaignId);

    if (error) return { error: error.message };

    revalidatePath('/admin/advertisements');
    revalidatePath('/dashboard/advertisements');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to reject payment.' };
  }
}

// 6. Homepage: Get running ads with Fair Rotation Logic
export async function getHomepageRunningAdsAction() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('advertisements')
      .select('*, businesses(business_name, city, state, slug)')
      .eq('status', 'running');

    if (error || !data || data.length === 0) return [];

    // Fair Rotation Logic: Fisher-Yates shuffle array to randomize ad order
    const shuffled = [...data];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  } catch (err) {
    console.error('Error in getHomepageRunningAdsAction:', err);
    return [];
  }
}

// 7. Increment Ad Click Counter
export async function incrementAdClickAction(campaignId: string) {
  try {
    const supabase = await createClient();
    const { data: current } = await supabase
      .from('advertisements')
      .select('clicks')
      .eq('id', campaignId)
      .single();

    const currentClicks = current?.clicks || 0;
    return { success: true };
  } catch (err) {
    return { error: 'Failed to record click' };
  }
}

// 8. Delete advertisement
export async function deleteAdvertisement(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('advertisements').delete().eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/dashboard/advertisements');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete advertisement' };
  }
}

// 9. Legacy createAdvertisement adapter
export async function createAdvertisement(formData: any) {
  return createCampaignAction({
    title: formData.title,
    description: formData.description,
    category: formData.category,
    targetCity: formData.target_city,
    planId: 'basic',
    planName: 'Basic Campaign',
    templateId: 'template-1',
    amount: 999,
    durationDays: 30,
    utrNumber: 'DIRECT',
    businessName: 'My Business',
  });
}
