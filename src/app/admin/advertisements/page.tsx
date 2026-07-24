import { getAllAdvertisements } from '@/actions/admin';
import { AdminAdsClient } from '@/components/admin-ads-client';

export const metadata = {
  title: 'Manage Advertisements — Admin',
};

export default async function AdminAdvertisementsPage() {
  const ads = await getAllAdvertisements();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Manage Advertisements</h1>
      <p className="mt-1 mb-6 text-gray-500">Approve, reject, or delete advertisements.</p>
      <AdminAdsClient
        initialAds={ads}
        searchAction={async (search: string) => {
          'use server';
          return getAllAdvertisements(search);
        }}
      />
    </div>
  );
}
