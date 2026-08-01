import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testActionQuery() {
  console.log("=== COMPARING QUERY WITH INNER JOIN vs LEFT JOIN ===");

  // Query 1: *, categories(id, name, slug)
  const { data: q1, error: e1 } = await supabase
    .from('businesses')
    .select('*, categories(id, name, slug)')
    .order('created_at', { ascending: false });

  console.log(`Query 1 (select('*, categories(...)')) returned ${q1?.length} rows.`);

  // Query 2: *
  const { data: q2, error: e2 } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  console.log(`Query 2 (select('*')) returned ${q2?.length} rows.`);

  if (q1 && q2 && q1.length !== q2.length) {
    console.log("\n⚠️ DISCREPANCY FOUND! Some businesses are being excluded by the categories join!");
    const q1Ids = new Set(q1.map(b => b.id));
    const missingInQ1 = q2.filter(b => !q1Ids.has(b.id));
    console.log(`Missing businesses (${missingInQ1.length}):`);
    missingInQ1.forEach(b => console.log(`  • Name: "${b.business_name}" | Category ID: ${b.category_id} | Status: ${b.status}`));
  }
}

testActionQuery();
