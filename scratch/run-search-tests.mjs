import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://opueithvutkkqkphhlug.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ITEMS_PER_PAGE = 12;

async function executeSearch({ query, category, city, page = 1 }) {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const buildQuery = (strictMode = true) => {
    let queryBuilder = supabase
      .from('businesses')
      .select('*, categories(id, name, slug)', { count: 'exact' })
      .eq('status', 'approved');

    if (query && query.trim()) {
      const cleanQuery = query.trim().replace(/[%_]/g, '\\$&');
      queryBuilder = queryBuilder.or(
        `business_name.ilike.%${cleanQuery}%,owner_name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,city.ilike.%${cleanQuery}%,state.ilike.%${cleanQuery}%,address.ilike.%${cleanQuery}%`
      );
    }

    if (strictMode && category && category.trim()) {
      const categorySlugs = category.split(',').map((s) => s.trim()).filter(Boolean);
      if (categorySlugs.length > 0) {
        queryBuilder = queryBuilder.in('categories.slug', categorySlugs);
      }
    }

    if (strictMode && city && city.trim()) {
      const parts = city.split(',').map((c) => c.trim()).filter(Boolean);
      const placeName = parts[0];
      const stateName = parts.length > 1 ? parts[parts.length - 1] : null;

      if (placeName) {
        const searchTerms = [placeName];
        const lower = placeName.toLowerCase();
        if (lower === 'mumbai') searchTerms.push('Bombay');
        if (lower === 'bombay') searchTerms.push('Mumbai');
        if (lower === 'bengaluru' || lower === 'bangalore') searchTerms.push('Bengaluru', 'Bangalore');
        if (lower === 'chennai' || lower === 'madras') searchTerms.push('Chennai', 'Madras');
        if (lower === 'vadodara' || lower === 'baroda') searchTerms.push('Vadodara', 'Baroda');

        const orConditions = searchTerms.flatMap((term) => [
          `city.ilike.%${term}%`,
          `address.ilike.%${term}%`,
          `state.ilike.%${term}%`,
        ]);

        if (stateName) {
          orConditions.push(`state.ilike.%${stateName}%`);
        }

        queryBuilder = queryBuilder.or(orConditions.join(','));
      }
    }

    return queryBuilder;
  };

  let { data, count, error } = await buildQuery(true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if ((!data || data.length === 0) && (query || city)) {
    let fallbackQuery = supabase
      .from('businesses')
      .select('*, categories(id, name, slug)', { count: 'exact' })
      .eq('status', 'approved');

    if (query && query.trim().length >= 3) {
      const clean = query.trim().replace(/[%_]/g, '');
      const prefix = clean.slice(0, Math.max(3, clean.length - 2));
      fallbackQuery = fallbackQuery.or(
        `business_name.ilike.%${prefix}%,description.ilike.%${prefix}%,city.ilike.%${prefix}%`
      );
    }

    const fallbackResult = await fallbackQuery
      .order('created_at', { ascending: false })
      .range(from, to);

    if (fallbackResult.data && fallbackResult.data.length > 0) {
      data = fallbackResult.data;
      count = fallbackResult.count;
    }
  }

  if (error) {
    console.error('Search error:', error);
    return { businesses: [], total: 0 };
  }

  return { businesses: data || [], total: count || 0 };
}

async function runTestSuite() {
  console.log('=====================================================');
  console.log('🧪 RUNNING CROSS-ACCOUNT GLOBAL SEARCH TEST SUITE');
  console.log('=====================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, testName, details) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      if (details) console.log(`   └─ ${details}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (details) console.error(`   └─ ${details}`);
      failedCount++;
    }
  }

  // TEST 1: Cross-account search by business name
  console.log('--- TEST GROUP 1: Business Name Search ---');
  const t1 = await executeSearch({ query: 'Royal Gemstones' });
  assert(
    t1.businesses.some((b) => b.business_name.includes('Royal Gemstones')),
    'Test 1.1: Search "Royal Gemstones" returns cross-account business owned by Priya Jain (Jaipur)',
    `Found ${t1.total} matches: ${t1.businesses.map((b) => b.business_name).join(', ')}`
  );

  const t1_2 = await executeSearch({ query: 'Kothari Software' });
  assert(
    t1_2.businesses.some((b) => b.business_name.includes('Kothari Software')),
    'Test 1.2: Search "Kothari Software" returns cross-account business owned by Amit Kothari (Surat)',
    `Found ${t1_2.total} matches: ${t1_2.businesses.map((b) => b.business_name).join(', ')}`
  );

  // TEST 2: Cross-account search by Location
  console.log('\n--- TEST GROUP 2: Location Search ---');
  const t2 = await executeSearch({ city: 'Indore' });
  assert(
    t2.businesses.length >= 2 && t2.businesses.some((b) => b.city === 'Indore'),
    'Test 2.1: Search location "Indore" returns all Indore businesses across different accounts',
    `Found ${t2.total} businesses in Indore: ${t2.businesses.map((b) => `${b.business_name} (${b.owner_name})`).join(', ')}`
  );

  const t2_2 = await executeSearch({ city: 'Ahmedabad' });
  assert(
    t2_2.businesses.some((b) => b.business_name.includes('Doshi Textile Mills')),
    'Test 2.2: Search location "Ahmedabad" returns Doshi Textile Mills (Vikram Doshi)',
    `Found ${t2_2.total} matches in Ahmedabad`
  );

  // TEST 3: Description Keyword Search
  console.log('\n--- TEST GROUP 3: Description Keyword Search ---');
  const t3 = await executeSearch({ query: 'mutual funds' });
  assert(
    t3.businesses.some((b) => b.business_name.includes('Mehta Financial')),
    'Test 3.1: Search keyword "mutual funds" returns Mehta Financial Consultancy',
    `Found matching business: ${t3.businesses.map((b) => b.business_name).join(', ')}`
  );

  const t3_2 = await executeSearch({ query: 'poha' });
  assert(
    t3_2.businesses.some((b) => b.business_name.includes('Jain Sweets')),
    'Test 3.2: Search keyword "poha" returns Jain Sweets & Namkeen',
    `Found matching business: ${t3_2.businesses.map((b) => b.business_name).join(', ')}`
  );

  // TEST 4: Category Search
  console.log('\n--- TEST GROUP 4: Category Search ---');
  const t4 = await executeSearch({ query: 'Manufacturing' });
  assert(
    t4.businesses.some((b) => b.business_name.includes('Doshi Textile Mills')),
    'Test 4.1: Search by category keyword "Manufacturing" returns matching cross-account manufacturing businesses',
    `Found ${t4.total} manufacturing businesses: ${t4.businesses.map((b) => b.business_name).join(', ')}`
  );

  // TEST 5: Partial Searches
  console.log('\n--- TEST GROUP 5: Partial Searches ---');
  const t5_1 = await executeSearch({ query: 'Ind' });
  assert(
    t5_1.businesses.length >= 2,
    'Test 5.1: Partial query "Ind" matches Indore businesses',
    `Found ${t5_1.total} matches: ${t5_1.businesses.map((b) => b.business_name).join(', ')}`
  );

  const t5_2 = await executeSearch({ query: 'Mumb' });
  assert(
    t5_2.businesses.some((b) => b.business_name.includes('Mehta Financial')),
    'Test 5.2: Partial query "Mumb" matches Mumbai businesses',
    `Found ${t5_2.total} matches`
  );

  const t5_3 = await executeSearch({ query: 'Jewel' });
  assert(
    t5_3.businesses.some((b) => b.business_name.includes('Royal Gemstones')),
    'Test 5.3: Partial query "Jewel" matches Jewellery business',
    `Found ${t5_3.total} matches`
  );

  // TEST 6: Location Alias Resolution
  console.log('\n--- TEST GROUP 6: Location Alias Resolution ---');
  const t6 = await executeSearch({ city: 'Bombay' });
  assert(
    t6.businesses.some((b) => b.city === 'Mumbai' || b.city === 'Bombay'),
    'Test 6.1: Location alias "Bombay" resolves and returns businesses in Mumbai',
    `Found ${t6.total} matches for Bombay: ${t6.businesses.map((b) => `${b.business_name} (${b.city})`).join(', ')}`
  );

  // TEST 7: Fuzzy Spelling Fallback
  console.log('\n--- TEST GROUP 7: Fuzzy Spelling Fallback ---');
  const t7 = await executeSearch({ query: 'Swets' });
  assert(
    t7.businesses.length > 0,
    'Test 7.1: Incorrect spelling "Swets" returns fuzzy fallback business suggestions',
    `Returned ${t7.total} fallback suggestions: ${t7.businesses.map((b) => b.business_name).join(', ')}`
  );

  console.log('\n=====================================================');
  console.log(`📊 TEST RESULTS: ${passedCount} PASSED | ${failedCount} FAILED`);
  console.log('=====================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
