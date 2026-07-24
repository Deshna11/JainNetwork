import { getAdminStats } from '@/actions/admin';
import { Card, CardContent } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

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
        {statCards.map((stat) => (
          <Card key={stat.label} className={stat.highlight && stat.value > 0 ? 'border-yellow-200 bg-yellow-50' : ''}>
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
        ))}
      </div>
    </div>
  );
}
