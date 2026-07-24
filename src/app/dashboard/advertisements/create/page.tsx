import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdCampaignWizard } from '@/components/ad-campaign-wizard';

export default async function CreateAdvertisementPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?next=/dashboard/advertisements/create');
  }

  // Fetch active categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name');

  // Fetch user's registered businesses
  const { data: userBusinesses } = await supabase
    .from('businesses')
    .select('id, business_name, city, state')
    .eq('owner_id', user.id);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">Create Advertisement Campaign</h1>
        <p className="mt-1 text-sm text-gray-500">
          Promote your business on the homepage with high-impact sponsored listings.
        </p>
      </div>

      <AdCampaignWizard
        categories={categories || []}
        userBusinesses={userBusinesses || []}
      />
    </div>
  );
}
