import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function findPendingEverywhere() {
  console.log("=== SEARCHING FOR ALL PENDING RECORDS IN SUPABASE ===");

  // 1. Pending Businesses
  const { data: pendingBiz } = await supabase.from('businesses').select('*').eq('status', 'pending');
  console.log(`Pending businesses: ${pendingBiz?.length || 0}`);

  // 2. Pending Profiles (Registration status)
  const { data: pendingUsers } = await supabase.from('profiles').select('id, email, name, registration_status').eq('registration_status', 'pending');
  console.log(`Pending users (registration_status = 'pending'): ${pendingUsers?.length || 0}`);
  if (pendingUsers && pendingUsers.length > 0) {
    console.log("Pending users list:", pendingUsers);
  }

  // 3. Pending Advertisements
  const { data: pendingAds } = await supabase.from('advertisements').select('*').or('status.eq.pending,status.eq.payment_verification');
  console.log(`Pending advertisements: ${pendingAds?.length || 0}`);

  // 4. Check payments table
  const { data: payments } = await supabase.from('payments').select('*');
  console.log(`Total payments in DB: ${payments?.length || 0}`);
  if (payments && payments.length > 0) {
    console.log("Payments sample:", payments);
  }
}

findPendingEverywhere();
