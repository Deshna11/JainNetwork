import { redirect } from 'next/navigation';
import { getMyBusiness, getCategories } from '@/actions/business';
import { BusinessRegisterForm } from '@/components/business-form';

export const metadata = {
  title: 'Register Business — Arham Business Connect',
};

export default async function RegisterBusinessPage() {
  const [business, categories] = await Promise.all([getMyBusiness(), getCategories()]);

  // If user already has a business, redirect to edit
  if (business) {
    redirect('/dashboard/business/edit');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Register Business</h1>
      <p className="mt-1 text-gray-500">Submit your business for listing on the directory.</p>
      <div className="mt-6">
        <BusinessRegisterForm categories={categories} />
      </div>
    </div>
  );
}
