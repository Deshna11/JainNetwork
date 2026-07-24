import Link from 'next/link';
import { getMyAdvertisements } from '@/actions/advertisement';
import { getMyBusiness } from '@/actions/business';
import { AdvertisementsTable } from '@/components/advertisements-table';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'My Advertisements — Jain Network',
};

export default async function MyAdvertisementsPage() {
  const [advertisements, business] = await Promise.all([
    getMyAdvertisements(),
    getMyBusiness(),
  ]);

  if (!business) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Advertisements</h1>
        <EmptyState
          title="Register a business first"
          description="You need to register a business before creating advertisements."
          actionLabel="Register Business"
          actionHref="/dashboard/business/register"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Advertisements</h1>
          <p className="mt-1 text-gray-500">Manage your business advertisements.</p>
        </div>
        <Link href="/dashboard/advertisements/create">
          <Button className="bg-blue-600 hover:bg-blue-700">Create Ad</Button>
        </Link>
      </div>

      <div className="mt-6">
        {advertisements.length > 0 ? (
          <AdvertisementsTable advertisements={advertisements} />
        ) : (
          <EmptyState
            title="No advertisements yet"
            description="Create your first advertisement to promote your business."
            actionLabel="Create Advertisement"
            actionHref="/dashboard/advertisements/create"
          />
        )}
      </div>
    </div>
  );
}
