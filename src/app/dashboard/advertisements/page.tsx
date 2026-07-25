import Link from 'next/link';
import { getUserCampaignsAction } from '@/actions/advertisement';
import { Button } from '@/components/ui/button';
import { RenderAdTemplate } from '@/components/ad-templates';
import {
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  MousePointerClick,
  TrendingUp,
  Receipt,
} from 'lucide-react';

export const metadata = {
  title: 'My Advertisements — Arham Business Connect',
};

export default async function MyAdvertisementsPage() {
  const campaigns = await getUserCampaignsAction();

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Advertisements</h1>
          <p className="mt-1 text-xs text-gray-500">
            Track campaign status, impression metrics, and active homepage placements.
          </p>
        </div>
        <Link href="/dashboard/advertisements/create">
          <Button className="bg-amber-500 text-slate-950 font-semibold hover:bg-amber-600 font-bold  shadow-sm">
            <PlusCircle className="mr-1.5 h-4 w-4" /> Create New Campaign
          </Button>
        </Link>
      </div>

      {/* Campaigns Listing */}
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {campaigns.map((camp: any) => {
            const views = camp.views || 0;
            const clicks = camp.clicks || 0;
            const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';

            // Calculate remaining days
            let remainingDays = 0;
            if (camp.end_date) {
              const diffMs = new Date(camp.end_date).getTime() - new Date().getTime();
              remainingDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
            } else {
              remainingDays = camp.duration_days || 30;
            }

            const adData = {
              title: camp.title,
              description: camp.description || '',
              imageUrl: camp.image_url || undefined,
              ctaText: camp.cta_text || 'Visit Business',
              targetCity: camp.target_city || 'All India',
              category: camp.category || 'General',
              businessName: camp.businesses?.business_name || 'My Business',
            };

            return (
              <div
                key={camp.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left: Rendered Ad Preview */}
                  <div className="w-full lg:w-96 shrink-0">
                    <span className="mb-2 block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Ad Template Preview ({camp.template_id})
                    </span>
                    <RenderAdTemplate templateId={camp.template_id || 'template-1'} adData={adData} />
                  </div>

                  {/* Right: Campaign Details & Analytics */}
                  <div className="flex-1 space-y-4">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-gray-400">
                          ID: #{camp.id.slice(0, 8).toUpperCase()}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mt-0.5">
                          {camp.title}
                        </h3>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {camp.status === 'running' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Running
                          </span>
                        )}
                        {camp.status === 'payment_verification' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                            <Clock className="h-3.5 w-3.5" /> Payment Verification
                          </span>
                        )}
                        {camp.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                          </span>
                        )}
                        {camp.status === 'payment_failed' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
                            <AlertCircle className="h-3.5 w-3.5" /> Payment Failed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta info grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <span className="text-gray-400 block font-medium">Plan</span>
                        <span className="font-bold text-gray-900">{camp.plan_name || 'Basic'} (₹{camp.amount || 999})</span>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <span className="text-gray-400 block font-medium">Duration</span>
                        <span className="font-semibold text-gray-800">{camp.duration_days || 30} Days</span>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <span className="text-gray-400 block font-medium">Remaining</span>
                        <span className="font-bold text-amber-600">{remainingDays} Days Left</span>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <span className="text-gray-400 block font-medium">Target City</span>
                        <span className="font-semibold text-gray-800 truncate block">{camp.target_city || 'All India'}</span>
                      </div>
                    </div>

                    {/* Impression Analytics */}
                    <div className="grid grid-cols-3 gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-center">
                      <div>
                        <span className="flex items-center justify-center gap-1 text-[11px] font-medium text-gray-500">
                          <Eye className="h-3.5 w-3.5 text-amber-600" /> Impressions
                        </span>
                        <span className="text-base font-black text-gray-900">{views}</span>
                      </div>
                      <div>
                        <span className="flex items-center justify-center gap-1 text-[11px] font-medium text-gray-500">
                          <MousePointerClick className="h-3.5 w-3.5 text-emerald-600" /> Clicks
                        </span>
                        <span className="text-base font-black text-gray-900">{clicks}</span>
                      </div>
                      <div>
                        <span className="flex items-center justify-center gap-1 text-[11px] font-medium text-gray-500">
                          <TrendingUp className="h-3.5 w-3.5 text-purple-600" /> CTR
                        </span>
                        <span className="text-base font-black text-purple-700">{ctr}%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-gray-100">
                      <span className="text-gray-400">
                        UTR: <strong className="font-mono text-gray-700">{camp.utr_number || 'N/A'}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <Link href="/dashboard/advertisements/create">
                          <Button size="sm" variant="outline">
                            Renew Campaign
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-amber-500" />
          <h3 className="mt-4 text-lg font-bold text-gray-900">No active campaigns yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create an advertisement campaign to reach thousands of potential customers on the homepage.
          </p>
          <Link href="/dashboard/advertisements/create" className="mt-6 inline-block">
            <Button className="bg-amber-500 text-slate-950 font-semibold hover:bg-amber-600 font-bold ">
              <PlusCircle className="mr-1.5 h-4 w-4" /> Create Your First Campaign
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
