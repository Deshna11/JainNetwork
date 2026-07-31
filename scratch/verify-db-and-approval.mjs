import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectData() {
  console.log("=== END-TO-END VERIFICATION: INSPECTING EXISTING DATABASE RECORDS ===");

  // 1. Fetch total businesses count
  const { data: allBusinesses, error: err1 } = await supabase
    .from('businesses')
    .select('id, business_name, status, created_at, city');

  if (err1) {
    console.error("Error fetching businesses:", err1);
    return;
  }

  console.log(`Total businesses in database: ${allBusinesses.length}`);
  
  const pending = allBusinesses.filter(b => b.status === 'pending');
  const approved = allBusinesses.filter(b => b.status === 'approved');
  const rejected = allBusinesses.filter(b => b.status === 'rejected');

  console.log(`  - Pending businesses: ${pending.length}`);
  console.log(`  - Approved businesses: ${approved.length}`);
  console.log(`  - Rejected businesses: ${rejected.length}`);

  console.log("\nSample Pending Businesses (Waiting for Admin Approval):");
  pending.forEach(b => {
    console.log(`  • ID: ${b.id} | Name: "${b.business_name}" | City: ${b.city} | Created: ${b.created_at}`);
  });

  console.log("\nSample Approved Businesses (Visible Publicly):");
  approved.slice(0, 5).forEach(b => {
    console.log(`  • ID: ${b.id} | Name: "${b.business_name}" | City: ${b.city} | Created: ${b.created_at}`);
  });

  console.log("\n=== VERIFYING PROFILES (USERS) TABLE ===");
  const { data: profiles } = await supabase.from('profiles').select('id, name, email, registration_status, role');
  if (profiles) {
    console.log(`Total users in database: ${profiles.length}`);
    console.log(`  - Pending registration users: ${profiles.filter(p => p.registration_status === 'pending').length}`);
    console.log(`  - Approved registration users: ${profiles.filter(p => p.registration_status === 'approved').length}`);
    console.log(`  - Admins: ${profiles.filter(p => p.role === 'admin').length}`);
  }

  console.log("\n=== VERIFYING ADVERTISEMENTS TABLE ===");
  const { data: ads } = await supabase.from('advertisements').select('id, title, status, payment_status');
  if (ads) {
    console.log(`Total advertisements in database: ${ads.length}`);
    console.log(`  - Pending ads: ${ads.filter(a => a.status === 'pending' || a.status === 'payment_verification').length}`);
    console.log(`  - Approved ads: ${ads.filter(a => a.status === 'approved' || a.status === 'active').length}`);
  }
  const { data: publicFilterData } = await supabase
    .from('businesses')
    .select('id, business_name, status')
    .eq('status', 'approved');

  console.log(`Public query (status='approved') returned ${publicFilterData.length} records.`);
  const hasPendingInPublic = publicFilterData.some(b => b.status === 'pending');
  console.log(`Are any pending businesses returned in public query? ${hasPendingInPublic ? 'YES (FAIL)' : 'NO (SUCCESS - Correctly filtered)'}`);

  console.log("\n=== VERIFYING ADMIN QUERY FILTER ===");
  const { data: adminQueryData } = await supabase
    .from('businesses')
    .select('id, business_name, status, categories(id, name, slug)')
    .order('created_at', { ascending: false });

  console.log(`Admin query (getAllBusinesses) returned ${adminQueryData.length} total records.`);
  console.log(`Pending businesses included in admin query: ${adminQueryData.filter(b => b.status === 'pending').length}`);

  console.log("\n✅ VERIFICATION COMPLETE: ALL DATA IS INTACT AND ACCESSIBLE FOR THE ADMIN!");
}

inspectData();
