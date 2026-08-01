import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testTempAdminFetch() {
  console.log("=== LOGGING IN AS TEMP ADMIN ===");
  const { data: auth, error: loginErr } = await supabase.auth.signInWithPassword({
    email: 'tempadmin@jainnetwork.com',
    password: 'TempAdmin2026!Pass'
  });

  if (loginErr) {
    console.error("Login error:", loginErr);
    return;
  }

  console.log(`✅ Logged in as: ${auth.user.email} (ID: ${auth.user.id})`);

  console.log("\n=== FETCHING BUSINESSES WITH AUTHENTICATED ADMIN SESSION ===");
  const { data: businesses, error: fetchErr } = await supabase
    .from('businesses')
    .select('*, categories(id, name, slug)')
    .order('created_at', { ascending: false });

  if (fetchErr) {
    console.error("Fetch error:", fetchErr);
    return;
  }

  console.log(`Total businesses returned for admin: ${businesses.length}`);
  const pending = businesses.filter(b => b.status === 'pending');
  const approved = businesses.filter(b => b.status === 'approved');

  console.log(`  - Pending businesses: ${pending.length}`);
  console.log(`  - Approved businesses: ${approved.length}`);

  if (pending.length > 0) {
    console.log("\nSample Pending Businesses Returned to Admin:");
    pending.forEach(b => console.log(`  • ID: ${b.id} | Name: "${b.business_name}" | Status: ${b.status} | City: ${b.city}`));
  }
}

testTempAdminFetch();
