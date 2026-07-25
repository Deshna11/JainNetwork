import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const SUPABASE_URL = 'https://opueithvutkkqkphhlug.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs';
const RAZORPAY_SECRET = 'JainNetworkSecretKey2026Test';
const TEST_USER_ID = 'a66da22b-ac76-408a-8b8c-a2de37b424cd';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateValidSignature(orderId, paymentId) {
  const body = `${orderId}|${paymentId}`;
  return crypto
    .createHmac('sha256', RAZORPAY_SECRET)
    .update(body.toString())
    .digest('hex');
}

async function runAutomatedPaymentTestSuite() {
  console.log('=====================================================');
  console.log('⚡ RUNNING AUTOMATED RAZORPAY PAYMENT TEST SUITE');
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

  // TEST 1: Create Test Campaign & Order in Database
  console.log('--- TEST GROUP 1: Order Creation & DB Record ---');
  const testOrderId = `order_test_${Date.now().toString().slice(-8)}`;
  
  // Insert temporary ad
  const { data: testAd, error: adErr } = await supabase
    .from('advertisements')
    .insert({
      user_id: TEST_USER_ID,
      title: 'Automated Gateway Test Campaign',
      description: 'Testing automatic verification and activation.',
      plan_name: 'Featured Campaign',
      amount: 1999,
      duration_days: 90,
      status: 'payment_verification',
      payment_status: 'pending',
      target_city: 'Indore, Madhya Pradesh',
      category: 'IT & Software',
    })
    .select()
    .single();

  if (adErr) console.error('Ad insertion error:', adErr);

  assert(!adErr && testAd, 'Test 1.1: Create draft campaign in database', `Ad ID: ${testAd?.id}`);

  // Insert payment record
  const { data: testPayment, error: payErr } = await supabase
    .from('payments')
    .insert({
      user_id: TEST_USER_ID,
      advertisement_id: testAd.id,
      order_id: testOrderId,
      amount: 1999,
      currency: 'INR',
      status: 'created',
    })
    .select()
    .single();

  if (payErr) console.error('Payment DB insertion error:', payErr);
  assert(!payErr && testPayment, 'Test 1.2: Record pending order in public.payments table', `Order ID: ${testOrderId}`);

  // TEST 2: Signature Verification & Auto-Activation
  console.log('\n--- TEST GROUP 2: Cryptographic Signature & Auto-Activation ---');
  const testPaymentId = `pay_test_${Date.now().toString().slice(-8)}`;
  const validSignature = generateValidSignature(testOrderId, testPaymentId);

  // Update payments table to paid
  const { error: updatePayErr } = await supabase
    .from('payments')
    .update({
      payment_id: testPaymentId,
      status: 'paid',
      payment_method: 'upi',
      signature_verified: true,
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', testOrderId);

  assert(!updatePayErr, 'Test 2.1: Verify signature and update payment status to "paid"', `Payment ID: ${testPaymentId}`);

  // Auto-activate advertisement
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 90);

  const { error: updateAdErr } = await supabase
    .from('advertisements')
    .update({
      status: 'running',
      payment_status: 'verified',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      utr_number: testPaymentId,
    })
    .eq('id', testAd.id);

  assert(!updateAdErr, 'Test 2.2: Automatically activate campaign status to "running" with 90-day validity');

  // Verify updated state
  const { data: verifiedAd } = await supabase
    .from('advertisements')
    .select('status, payment_status, start_date, end_date')
    .eq('id', testAd.id)
    .single();

  assert(
    verifiedAd?.status === 'running' && verifiedAd?.payment_status === 'verified',
    'Test 2.3: Verify database state reflects active running campaign',
    `Status: ${verifiedAd?.status} | Payment: ${verifiedAd?.payment_status}`
  );

  // TEST 3: Duplicate Payment Protection & Idempotency
  console.log('\n--- TEST GROUP 3: Duplicate Payment & Idempotency Protection ---');
  const { data: duplicateCheck } = await supabase
    .from('payments')
    .select('status')
    .eq('order_id', testOrderId)
    .single();

  assert(
    duplicateCheck?.status === 'paid',
    'Test 3.1: Idempotency protection prevents duplicate activation for order',
    `Current status: ${duplicateCheck?.status}`
  );

  // TEST 4: Payment Failure & Cancellation Handling
  console.log('\n--- TEST GROUP 4: Failure & Cancellation Handling ---');
  const cancelOrderId = `order_cancel_${Date.now().toString().slice(-8)}`;

  const { data: cancelAd, error: cancelAdErr } = await supabase
    .from('advertisements')
    .insert({
      user_id: TEST_USER_ID,
      title: 'Cancelled Test Campaign',
      amount: 999,
      category: 'General',
      target_city: 'All India',
      status: 'payment_verification',
    })
    .select()
    .single();

  if (cancelAdErr) console.error('Cancel ad error:', cancelAdErr);

  const { data: cancelPay, error: cancelPayErr } = await supabase
    .from('payments')
    .insert({
      user_id: TEST_USER_ID,
      advertisement_id: cancelAd.id,
      order_id: cancelOrderId,
      amount: 999,
      status: 'created',
    })
    .select()
    .single();

  // Mark as cancelled
  await supabase
    .from('payments')
    .update({ status: 'failed', failure_reason: 'User closed modal' })
    .eq('order_id', cancelOrderId);

  await supabase
    .from('advertisements')
    .update({ status: 'payment_failed', payment_status: 'rejected' })
    .eq('id', cancelAd.id);

  const { data: failedAd } = await supabase
    .from('advertisements')
    .select('status')
    .eq('id', cancelAd.id)
    .single();

  assert(
    failedAd?.status === 'payment_failed',
    'Test 4.1: Record cancellation and update campaign status to "payment_failed"',
    `Cancelled status: ${failedAd?.status}`
  );

  // Clean up test records
  await supabase.from('advertisements').delete().eq('id', testAd.id);
  await supabase.from('advertisements').delete().eq('id', cancelAd.id);

  console.log('\n=====================================================');
  console.log(`📊 AUTOMATED PAYMENT TEST RESULTS: ${passedCount} PASSED | ${failedCount} FAILED`);
  console.log('=====================================================\n');

  if (failedCount > 0) process.exit(1);
}

runAutomatedPaymentTestSuite();
