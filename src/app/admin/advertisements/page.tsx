import { getAdminCampaignsAction } from '@/actions/advertisement';
import { AdminCampaignsTable } from '@/components/admin-campaigns-table';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Advertisement Management — Admin Panel',
};

export default async function AdminAdvertisementsPage() {
  const campaigns = await getAdminCampaignsAction();

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-gray-900">
            <ShieldCheck className="h-6 w-6 text-blue-600" /> Admin: Advertisement Campaigns
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Verify manual UPI/Bank transfer payments and approve sponsored homepage campaigns.
          </p>
        </div>
      </div>

      {/* Campaigns Table Component */}
      <AdminCampaignsTable initialCampaigns={campaigns} />
    </div>
  );
}
