import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testWebsiteDisplay() {
  console.log("=== TESTING WEBSITE BUSINESS DISPLAY ===");

  // 1. Homepage Latest Businesses query (getLatestBusinesses)
  const { data: latest, error: e1 } = await supabase
    .from('businesses')
    .select('*, categories(id, name, slug)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(6);

  console.log(`Homepage getLatestBusinesses(6) returned ${latest?.length} items:`);
  latest?.forEach(b => console.log(`  - "${b.business_name}" (${b.city})`));

  // 2. All approved businesses (searchBusinesses without filters)
  const { data: allApproved, count } = await supabase
    .from('businesses')
    .select('*, categories(id, name, slug)', { count: 'exact' })
    .eq('status', 'approved');

  console.log(`\nDirectory searchBusinesses returned ${count} total approved items:`);
  allApproved?.forEach(b => console.log(`  - Slug: /businesses/${b.slug} | Name: "${b.business_name}"`));
}

testWebsiteDisplay();
