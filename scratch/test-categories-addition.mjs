import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runCategoryTests() {
  console.log("🚀 Starting Verification Tests for New Business Categories...\n");

  const requiredCategories = [
    { name: 'Photographers', slug: 'photographers' },
    { name: 'Graphics Designers', slug: 'graphics-designers' },
    { name: 'Travel Agents', slug: 'travel-agents' },
    { name: 'Tiles and Sanitarywares', slug: 'tiles-sanitarywares' },
  ];

  // 1. Verify categories exist in database
  console.log("Step 1: Verifying master category list in database...");
  const { data: allCategories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (catError) {
    console.error("❌ Failed to query categories:", catError.message);
    return;
  }

  let missingCount = 0;
  for (const req of requiredCategories) {
    const found = allCategories.find((c) => c.slug === req.slug || c.name.toLowerCase() === req.name.toLowerCase());
    if (found) {
      console.log(`✅ Category Active in Master List: "${found.name}" [slug: ${found.slug}, ID: ${found.id}]`);
    } else {
      missingCount++;
      console.error(`❌ Missing Category: "${req.name}"`);
    }
  }

  if (missingCount === 0) {
    console.log(`\n✅ All ${requiredCategories.length} new categories exist in master category table!`);
    console.log(`Total active master categories available across application: ${allCategories.length}`);
  } else {
    console.error(`❌ ${missingCount} categories missing from database!`);
  }

  console.log("\n🎉 CATEGORY MASTER LIST VERIFICATION COMPLETE!");
}

runCategoryTests();
