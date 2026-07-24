import Link from 'next/link';
import { getMyBusiness } from '@/actions/business';
import { getProfile } from '@/actions/auth';
import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const [business, profile] = await Promise.all([getMyBusiness(), getProfile()]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-gray-500">
        Welcome back{profile?.name ? `, ${profile.name}` : ''}!
      </p>

      {/* Business Status Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">My Business</CardTitle>
        </CardHeader>
        <CardContent>
          {business ? (
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {business.business_name}
                </h3>
                <StatusBadge status={business.status} />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {business.categories?.name} • {business.city}, {business.state}
              </p>

              {/* Status-specific messages */}
              {business.status === 'pending' && (
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    ⏳ Your business is waiting for admin approval. You will be notified once it&apos;s reviewed.
                  </p>
                </div>
              )}
              {business.status === 'rejected' && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-800">
                    ❌ Your business listing was rejected. Please update your details and contact support.
                  </p>
                </div>
              )}
              {business.status === 'approved' && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm text-green-800">
                    ✅ Your business is live and visible to everyone!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">You haven&apos;t registered a business yet.</p>
              <Link href="/dashboard/business/register" className="mt-4 inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700">Register Business</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {business ? (
          <>
            <Link href="/dashboard/business/edit">
              <Card className="h-full transition-all hover:shadow-md hover:border-blue-200 cursor-pointer">
                <CardContent className="flex items-center gap-3 p-5">
                  <span className="text-2xl">✏️</span>
                  <div>
                    <p className="font-medium text-gray-900">Edit Business</p>
                    <p className="text-xs text-gray-500">Update your details</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/advertisements/create">
              <Card className="h-full transition-all hover:shadow-md hover:border-blue-200 cursor-pointer">
                <CardContent className="flex items-center gap-3 p-5">
                  <span className="text-2xl">📢</span>
                  <div>
                    <p className="font-medium text-gray-900">Create Advertisement</p>
                    <p className="text-xs text-gray-500">Promote your business</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </>
        ) : (
          <Link href="/dashboard/business/register">
            <Card className="h-full transition-all hover:shadow-md hover:border-blue-200 cursor-pointer">
              <CardContent className="flex items-center gap-3 p-5">
                <span className="text-2xl">🏢</span>
                <div>
                  <p className="font-medium text-gray-900">Register Business</p>
                  <p className="text-xs text-gray-500">Get listed on the directory</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
        <Link href="/dashboard/search">
          <Card className="h-full transition-all hover:shadow-md hover:border-blue-200 cursor-pointer">
            <CardContent className="flex items-center gap-3 p-5">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="font-medium text-gray-900">Search Businesses</p>
                <p className="text-xs text-gray-500">Find businesses near you</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
