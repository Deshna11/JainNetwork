import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAdminAndBusinesses() {
  console.log("=== INSPECTING ADMIN PROFILES ===");
  const { data: admins, error: e1 } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin');
  
  console.log("Admins in profiles table:", admins);

  console.log("\n=== INSPECTING ALL PROFILES WITH EMAIL LIKE 'arham' ===");
  const { data: arhamProfiles, error: e2 } = await supabase
    .from('profiles')
    .select('*')
    .ilike('email', '%arham%');
  
  console.log("Profiles matching 'arham':", arhamProfiles);

  console.log("\n=== INSPECTING RECENTLY CREATED BUSINESSES (LAST 20) ===");
  const { data: businesses, error: e3 } = await supabase
    .from('businesses')
    .select('*, categories(id, name, slug)')
    .order('created_at', { ascending: false })
    .limit(20);

  if (e3) {
    console.error("Error fetching businesses:", e3);
  } else {
    console.log(`Total businesses fetched: ${businesses.length}`);
    businesses.forEach((b, i) => {
      console.log(`[${i+1}] ID: ${b.id} | Name: "${b.business_name}" | Status: "${b.status}" | Owner: "${b.owner_name}" (${b.email}) | Category: ${b.categories?.name || 'NULL'}`);
    });
  }

  console.log("\n=== INSPECTING ADVERTISEMENTS TABLE ===");
  const { data: ads, error: e4 } = await supabase
    .from('advertisements')
    .select('*, businesses(id, business_name)')
    .order('created_at', { ascending: false });

  if (e4) {
    console.error("Error fetching ads:", e4);
  } else {
    console.log(`Total advertisements fetched: ${ads.length}`);
    ads.forEach((a, i) => {
      console.log(`[${i+1}] ID: ${a.id} | Title: "${a.title}" | Status: "${a.status}" | Amount: ${a.amount} | Biz: ${a.businesses?.business_name || 'NULL'}`);
    });
  }
}

checkAdminAndBusinesses();
