import Link from 'next/link';
import { getMyBusiness } from '@/actions/business';
import { StatusBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'My Business — Arham Business Connect',
};

export default async function MyBusinessPage() {
  const business = await getMyBusiness();

  if (!business) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Business</h1>
        <EmptyState
          title="No business registered"
          description="Register your business to get listed on the Arham Business Connect directory."
          actionLabel="Register Business"
          actionHref="/dashboard/business/register"
        />
      </div>
    );
  }

  const details = [
    { label: 'Business Name', value: business.business_name },
    { label: 'Owner Name', value: business.owner_name },
    { label: 'Category', value: business.categories?.name },
    { label: 'Phone', value: business.phone },
    { label: 'Email', value: business.email },
    { label: 'Website', value: business.website },
    { label: 'Address', value: business.address },
    { label: 'City', value: business.city },
    { label: 'State', value: business.state },
    { label: 'GST Number', value: business.gst_number },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Business</h1>
        <Link href="/dashboard/business/edit">
          <Button variant="outline" size="sm">Edit</Button>
        </Link>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <StatusBadge status={business.status} />
            {business.status === 'pending' && (
              <span className="text-sm text-yellow-700">Waiting for admin approval</span>
            )}
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {details.map(
              (detail) =>
                detail.value && (
                  <div key={detail.label}>
                    <dt className="text-sm font-medium text-gray-500">{detail.label}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{detail.value}</dd>
                  </div>
                )
            )}
          </dl>

          {business.description && (
            <div className="mt-6 border-t pt-4">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.description}</dd>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
