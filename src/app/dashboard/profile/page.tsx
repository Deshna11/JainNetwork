import { getProfile } from '@/actions/auth';
import { getMyBusiness } from '@/actions/business';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const metadata = {
  title: 'Profile — Arham Business Connect',
};

export default async function ProfilePage() {
  const profile = await getProfile();
  const business = await getMyBusiness();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-500">Your account and business information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile?.name || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile?.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{profile?.role || '—'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50 pb-4">
          <CardTitle className="text-lg">Registered Business</CardTitle>
          {business && (
            <Badge variant={business.status === 'approved' ? 'default' : 'secondary'} className="capitalize bg-amber-500 hover:bg-amber-600 text-white border-transparent">
              {business.status}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {business ? (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{business.business_name}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{business.description}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.categories?.name || '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {business.email} <br/>
                  {business.phone}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{business.city}, {business.state}</dd>
              </div>
              {business.website && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-amber-600 hover:underline">
                    <a href={business.website} target="_blank" rel="noreferrer">{business.website}</a>
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-sm text-gray-600 mb-4">You have not registered a business yet.</p>
              <Link href="/dashboard/business/register" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-amber-500 text-slate-950 shadow hover:bg-amber-600 h-9 px-4 py-2">
                Register your business
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
