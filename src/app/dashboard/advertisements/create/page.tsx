import { redirect } from 'next/navigation';
import { getMyBusiness, getCategories } from '@/actions/business';
import { CreateAdForm } from '@/components/create-ad-form';

export const metadata = {
  title: 'Create Advertisement — Jain Network',
};

export default async function CreateAdvertisementPage() {
  const [business, categories] = await Promise.all([getMyBusiness(), getCategories()]);

  if (!business) {
    redirect('/dashboard/business/register');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Create Advertisement</h1>
      <p className="mt-1 text-gray-500">Create a new ad to promote your business.</p>
      <div className="mt-6">
        <CreateAdForm categories={categories} />
      </div>
    </div>
  );
}
