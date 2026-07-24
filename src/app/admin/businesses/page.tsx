import { getAllBusinesses } from '@/actions/admin';
import { AdminBusinessesClient } from '@/components/admin-businesses-client';

export const metadata = {
  title: 'Manage Businesses — Admin',
};

export default async function AdminBusinessesPage() {
  const businesses = await getAllBusinesses();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Manage Businesses</h1>
      <p className="mt-1 mb-6 text-gray-500">Approve, reject, or delete business listings.</p>
      <AdminBusinessesClient
        initialBusinesses={businesses}
        searchAction={async (search: string) => {
          'use server';
          return getAllBusinesses(search);
        }}
      />
    </div>
  );
}
