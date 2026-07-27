import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log("🚀 Starting Verification Tests for Nationwide 410,000+ India Gazetteer...\n");

  const testQueries = [
    { query: "Mahabaleshwar", expected: "Mahabaleshwar", description: "Hill station: Mahabaleshwar" },
    { query: "Panchgani", expected: "Panchgani", description: "Hill station: Panchgani" },
    { query: "Lonavala", expected: "Lonavla", description: "Hill station / Town: Lonavala" },
    { query: "Lavasa", expected: "Lavasa", description: "Hill city: Lavasa" },
    { query: "Saputara", expected: "Saputara", description: "Hill station: Saputara" },
    { query: "Mount Abu", expected: "Mount Abu", description: "Hill station: Mount Abu" },
    { query: "Palitana", expected: "Palitana", description: "Pilgrimage / Town: Palitana" },
    { query: "Shikharji", expected: "Shikharji", description: "Pilgrimage: Shikharji / Sammed Shikharji" },
    { query: "Shravanabelagola", expected: "Sravana Belgola", description: "Pilgrimage: Shravanabelagola" },
    { query: "Ranakpur", expected: "Ranakpur", description: "Pilgrimage / Village: Ranakpur" },
    { query: "Matheran", expected: "Matheran", description: "Hill station: Matheran" },
    { query: "kukshi", expected: "Kukshi", description: "Tehsil / Town: Kukshi" },
    { query: "mahuva", expected: "Mahuva", description: "Town: Mahuva" },
    { query: "mahidpur", expected: "Mahidpur", description: "Town: Mahidpur" },
    { query: "maharajganj", expected: "Maharajganj", description: "Town / District: Maharajganj" },
  ];

  let passedCount = 0;

  for (const test of testQueries) {
    const startTime = Date.now();
    const { data, error } = await supabase.rpc('search_locations_fn', {
      search_query: test.query,
      result_limit: 10,
    });
    const duration = Date.now() - startTime;

    if (error) {
      console.error(`❌ TEST FAILED [${test.description}]:`, error.message);
      continue;
    }

    const resultNames = data.map((d) => `${d.name} (${d.type}, ${d.state})`);
    const foundMatch = data.some(
      (d) =>
        d.name.toLowerCase().includes(test.expected.toLowerCase()) ||
        (d.aliases && d.aliases.some((a) => a.toLowerCase().includes(test.expected.toLowerCase()))) ||
        d.formatted.toLowerCase().includes(test.expected.toLowerCase())
    );

    if (foundMatch) {
      passedCount++;
      console.log(`✅ TEST PASSED [${test.description}] (${duration}ms)`);
      console.log(`   Top Result: ${data[0]?.formatted} [Type: ${data[0]?.type}, Score: ${data[0]?.match_score}]`);
    } else {
      console.error(`❌ TEST FAILED [${test.description}] (${duration}ms)`);
      console.error(`   Expected: ${test.expected}`);
      console.error(`   Actual Top 3: ${resultNames.slice(0, 3).join(", ")}`);
    }
    console.log("------------------------------------------------------------------");
  }

  console.log(`\n🎉 Verification Summary: ${passedCount}/${testQueries.length} gazetteer test cases PASSED!`);
}

runTests().catch(console.error);
