import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runCategoryTests() {
  console.log("🚀 Starting Verification Tests for Registration-Only Business Categories...\n");

  const registrationOnlyCategories = [
    'Electricals',
    'Imitation Jewellery',
    'Novelty',
    'Hardware',
    'Paints',
    'Office & School Stationery',
    'Tailoring Materials',
    'Fashion Designers',
    'FMCG',
    'Sports Equipment',
    'Decoration Items',
    'Decorators',
    'Shamiyana Suppliers',
    'Anchors',
    'Singers',
    'Musicians',
    'Musical Instruments',
    'Furniture',
    'Home Appliances',
    'Interior Designers',
    'Motivational Speakers',
    'Insurance Agents',
    'Content Creators',
    'Home Decor',
  ];

  // 1. Verify all 24 categories exist in master database table
  console.log("Step 1: Verifying registration categories in master database list...");
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
  for (const catName of registrationOnlyCategories) {
    const found = allCategories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
    if (found) {
      console.log(`✅ Category Active in Registration List: "${found.name}" [slug: ${found.slug}]`);
    } else {
      missingCount++;
      console.error(`❌ Missing Category: "${catName}"`);
    }
  }

  if (missingCount === 0) {
    console.log(`\n✅ All ${registrationOnlyCategories.length} registration categories exist in database!`);
    console.log(`Total active categories available for registration & search: ${allCategories.length}`);
  } else {
    console.error(`❌ ${missingCount} categories missing!`);
  }

  console.log("\n🎉 REGISTRATION CATEGORIES VERIFICATION COMPLETE!");
}

runCategoryTests();
