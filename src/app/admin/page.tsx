import Link from 'next/link';
import { getAdminStats, getPendingUsers } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/helpers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [stats, pendingUsers] = await Promise.all([
    getAdminStats(),
    getPendingUsers(),
  ]);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
    { label: 'Total Businesses', value: stats.totalBusinesses, icon: '🏢' },
    { label: 'Pending Businesses', value: stats.pendingBusinesses, icon: '⏳', highlight: true },
    { label: 'Pending Advertisements', value: stats.pendingAdvertisements, icon: '📢', highlight: true },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-1 text-gray-500">Overview of the platform.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const href = stat.label.includes('Users') ? '/admin/users' :
                       stat.label.includes('Businesses') ? '/admin/businesses' :
                       '/admin/advertisements';
                       
          return (
            <Link key={stat.label} href={href} className="block transition-transform hover:scale-[1.02]">
              <Card className={`h-full ${stat.highlight && stat.value > 0 ? 'border-yellow-200 bg-yellow-50 shadow-md' : 'hover:border-gray-300'}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pending Registrations</h2>
            <p className="text-sm text-gray-500">Users waiting for approval to register their business.</p>
          </div>
          <Link href="/admin/users">
            <Button variant="outline" size="sm">View All Users</Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            {pendingUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No pending users right now.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name || 'No Name'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden sm:inline-block text-xs text-gray-400">
                        Joined {formatDate(user.created_at)}
                      </span>
                      <Link href="/admin/users">
                        <Button size="sm" className="bg-amber-500 text-slate-950 hover:bg-amber-600 font-semibold">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
