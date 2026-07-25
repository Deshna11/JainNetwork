import { redirect } from 'next/navigation';
import { getMyBusiness, getCategories } from '@/actions/business';
import { BusinessEditForm } from '@/components/business-edit-form';

export const metadata = {
  title: 'Edit Business — Arham Business Connect',
};

export default async function EditBusinessPage() {
  const [business, categories] = await Promise.all([getMyBusiness(), getCategories()]);

  if (!business) {
    redirect('/dashboard/business/register');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Business</h1>
      <p className="mt-1 text-gray-500">Update your business information.</p>
      <div className="mt-6">
        <BusinessEditForm business={business} categories={categories} />
      </div>
    </div>
  );
}
