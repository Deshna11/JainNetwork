import json
import urllib.request
import ssl
import sys

SUPABASE_URL = "https://opueithvutkkqkphhlug.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs"

def run_tests():
    print("🚀 Starting End-to-End Business Registration & Approval Workflow Tests...\n")

    # Get a category ID
    cat_url = f"{SUPABASE_URL}/rest/v1/categories?select=id&limit=1"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(cat_url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as resp:
        cats = json.loads(resp.read().decode('utf-8'))
        category_id = cats[0]['id']

    print(f"Using Category ID: {category_id}")

    # 1. Test registration insertion with status = 'pending'
    print("\n--- TEST 1: User Registration Insertion ---")
    test_slug = "test-approval-workflow-biz"
    biz_data = {
        "business_name": "Arham Workflow Test Business",
        "owner_name": "Test Owner",
        "email": "testowner@example.com",
        "phone": "9876543210",
        "address": "456 Test Road",
        "city": "Indore",
        "state": "Madhya Pradesh",
        "category_id": category_id,
        "slug": test_slug,
        "status": "pending",
        "payment_proof_url": "https://example.com/proof.jpg"
    }

    post_url = f"{SUPABASE_URL}/rest/v1/businesses"
    post_headers = {**headers, "Content-Type": "application/json", "Prefer": "return=representation"}
    req = urllib.request.Request(post_url, data=json.dumps(biz_data).encode('utf-8'), headers=post_headers, method="POST")
    
    with urllib.request.urlopen(req, context=ctx) as resp:
        created = json.loads(resp.read().decode('utf-8'))[0]
        biz_id = created['id']
        print(f"✅ Business inserted successfully! ID: {biz_id}")
        print(f"✅ Status set to: '{created['status']}'")
        assert created['status'] == 'pending', "Error: Status is not pending!"

    # 2. Test Public Read Access (Anon key RLS check)
    print("\n--- TEST 2: Public Read Access Check (Anon RLS) ---")
    public_url = f"{SUPABASE_URL}/rest/v1/businesses?id=eq.{biz_id}"
    req = urllib.request.Request(public_url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as resp:
        public_rows = json.loads(resp.read().decode('utf-8'))
        if len(public_rows) == 0:
            print("✅ VERIFIED: Public unauthenticated user CANNOT see pending business!")
        else:
            print("❌ FAILED: Pending business is visible to public!")
            sys.exit(1)

    # 3. Test Admin Approval (Transition from pending to approved)
    print("\n--- TEST 3: Admin Approval Execution ---")
    patch_url = f"{SUPABASE_URL}/rest/v1/businesses?id=eq.{biz_id}"
    patch_headers = {**headers, "Content-Type": "application/json", "Prefer": "return=representation"}
    req = urllib.request.Request(patch_url, data=json.dumps({"status": "approved"}).encode('utf-8'), headers=patch_headers, method="PATCH")
    with urllib.request.urlopen(req, context=ctx) as resp:
        updated = json.loads(resp.read().decode('utf-8'))[0]
        print(f"✅ Status updated to: '{updated['status']}'")
        assert updated['status'] == 'approved', "Error: Status failed to update to approved!"

    # 4. Test Public Read Access After Approval
    print("\n--- TEST 4: Public Visibility After Approval ---")
    req = urllib.request.Request(public_url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as resp:
        approved_rows = json.loads(resp.read().decode('utf-8'))
        if len(approved_rows) == 1:
            print("✅ VERIFIED: Approved business is now IMMEDIATELY visible on public site!")
        else:
            print("❌ FAILED: Approved business is missing from public site!")
            sys.exit(1)

    # 5. Test Admin Rejection (Transition from approved to rejected)
    print("\n--- TEST 5: Admin Rejection Execution ---")
    req = urllib.request.Request(patch_url, data=json.dumps({"status": "rejected"}).encode('utf-8'), headers=patch_headers, method="PATCH")
    with urllib.request.urlopen(req, context=ctx) as resp:
        updated_rej = json.loads(resp.read().decode('utf-8'))[0]
        print(f"✅ Status updated to: '{updated_rej['status']}'")

    req = urllib.request.Request(public_url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as resp:
        rejected_rows = json.loads(resp.read().decode('utf-8'))
        if len(rejected_rows) == 0:
            print("✅ VERIFIED: Rejected business is strictly HIDDEN from public site!")
        else:
            print("❌ FAILED: Rejected business appeared on public site!")
            sys.exit(1)

    # Clean up test row
    del_url = f"{SUPABASE_URL}/rest/v1/businesses?id=eq.{biz_id}"
    req = urllib.request.Request(del_url, headers=headers, method="DELETE")
    with urllib.request.urlopen(req, context=ctx) as resp:
        print("\n🧹 Test business record cleaned up.")

    print("\n🎉 ALL 5 END-TO-END APPROVAL WORKFLOW TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
