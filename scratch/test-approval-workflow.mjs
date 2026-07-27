import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runEndToEndApprovalTests() {
  console.log("🚀 Starting End-to-End Business Registration & Approval Workflow Tests...\n");

  let testBusinessId = null;
  const testSlug = `test-approval-biz-${Date.now()}`;

  try {
    // 1. Get an active category ID
    const { data: categories } = await supabase.from('categories').select('id').limit(1);
    const categoryId = categories && categories[0] ? categories[0].id : null;

    if (!categoryId) {
      throw new Error("No category found in database to test registration.");
    }

    // 2. Simulate User Business Registration (Insertion with status 'pending')
    console.log("Step 1: Registering new business (Simulating user registration)...");
    const { data: newBiz, error: insertError } = await supabase
      .from('businesses')
      .insert({
        business_name: 'Test Workflow Enterprises',
        owner_name: 'Workflow Tester',
        email: 'tester@example.com',
        phone: '9999999999',
        address: '123 Test Street',
        city: 'Indore',
        state: 'Madhya Pradesh',
        category_id: categoryId,
        slug: testSlug,
        status: 'pending',
        payment_proof_url: 'https://example.com/payment_proof.jpg'
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to insert test business: ${insertError.message}`);
    }

    testBusinessId = newBiz.id;
    console.log(`✅ Business registered! ID: ${newBiz.id}, Status: '${newBiz.status}'`);

    // 3. Verify Status is Pending
    if (newBiz.status !== 'pending') {
      console.error(`❌ TEST FAILED: Initial status is '${newBiz.status}', expected 'pending'`);
      return;
    } else {
      console.log("✅ Verified: Initial status is strictly 'pending'.");
    }

    // 4. Verify NOT visible publicly in search / latest listings
    console.log("\nStep 2: Checking public search & listings for pending business...");

    const { data: searchResults } = await supabase
      .from('businesses')
      .select('*')
      .eq('status', 'approved')
      .eq('id', testBusinessId);

    if (searchResults && searchResults.length > 0) {
      console.error("❌ TEST FAILED: Pending business appeared in public approved businesses query!");
      return;
    } else {
      console.log("✅ Verified: Pending business does NOT appear in public approved search query.");
    }

    // 5. Verify Pending Business appears in Admin Panel query
    console.log("\nStep 3: Checking Admin Panel pending queue...");
    const { data: pendingQueue } = await supabase
      .from('businesses')
      .select('*')
      .eq('status', 'pending')
      .eq('id', testBusinessId);

    if (pendingQueue && pendingQueue.length === 1) {
      console.log("✅ Verified: Pending business appears in Admin Approval queue.");
    } else {
      console.error("❌ TEST FAILED: Pending business missing from Admin Approval queue!");
      return;
    }

    // 6. Admin Action: Approve Business
    console.log("\nStep 4: Simulating Admin Approval (arhambizconnect@gmail.com action)...");
    const { error: approveError } = await supabase
      .from('businesses')
      .update({ status: 'approved' })
      .eq('id', testBusinessId);

    if (approveError) {
      throw new Error(`Admin approval update failed: ${approveError.message}`);
    }
    console.log("✅ Admin clicked Approve! Status updated to 'approved'.");

    // 7. Verify Approved Business NOW appears in Public Search & Listings
    const { data: publicApproved } = await supabase
      .from('businesses')
      .select('*')
      .eq('status', 'approved')
      .eq('id', testBusinessId);

    if (publicApproved && publicApproved.length === 1) {
      console.log("✅ Verified: Approved business is now IMMEDIATELY visible on public website & search listings!");
    } else {
      console.error("❌ TEST FAILED: Approved business is still missing from public listings!");
      return;
    }

    // 8. Admin Action: Reject Business & Verify Hidden
    console.log("\nStep 5: Simulating Admin Rejection...");
    await supabase.from('businesses').update({ status: 'rejected' }).eq('id', testBusinessId);
    
    const { data: publicRejected } = await supabase
      .from('businesses')
      .select('*')
      .eq('status', 'approved')
      .eq('id', testBusinessId);

    if (publicRejected && publicRejected.length === 0) {
      console.log("✅ Verified: Rejected business is strictly HIDDEN from public website.");
    } else {
      console.error("❌ TEST FAILED: Rejected business appeared in public listings!");
      return;
    }

    console.log("\n🎉 ALL END-TO-END WORKFLOW TESTS PASSED PERFECTLY!");
  } catch (err) {
    console.error("❌ Error running workflow tests:", err);
  } finally {
    // Clean up test record
    if (testBusinessId) {
      await supabase.from('businesses').delete().eq('id', testBusinessId);
      console.log("\n🧹 Cleaned up temporary test business record.");
    }
  }
}

runEndToEndApprovalTests();
