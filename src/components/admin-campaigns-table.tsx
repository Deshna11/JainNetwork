'use client';

import { useState } from 'react';
import { approvePaymentAction, rejectPaymentAction } from '@/actions/advertisement';
import { toast } from 'sonner';
import { RenderAdTemplate } from '@/components/ad-templates';
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  Building,
  User,
  Phone,
  FileImage,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminCampaignsTableProps {
  initialCampaigns: any[];
}

export function AdminCampaignsTable({ initialCampaigns }: AdminCampaignsTableProps) {
  const [campaigns, setCampaigns] = useState<any[]>(initialCampaigns);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [previewCamp, setPreviewCamp] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await approvePaymentAction(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Payment verified & Campaign activated (Running)!');
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, payment_status: 'verified', status: 'running' } : c
          )
        );
      }
    } catch (err: any) {
      toast.error('Failed to approve payment.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await rejectPaymentAction(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.error('Payment rejected. Status set to Payment Failed.');
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, payment_status: 'rejected', status: 'payment_failed' } : c
          )
        );
      }
    } catch (err: any) {
      toast.error('Failed to reject payment.');
    } finally {
      setLoadingId(null);
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
        No ad campaigns found in the database.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Proof Image Modal */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-gray-900">Payment Proof Screenshot</h3>
              <button
                onClick={() => setSelectedProofUrl(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-xl border border-gray-100">
              <img src={selectedProofUrl} alt="Payment Proof" className="w-full object-contain" />
            </div>
            <Button onClick={() => setSelectedProofUrl(null)} className="w-full">
              Close Preview
            </Button>
          </div>
        </div>
      )}

      {/* Ad Template Preview Modal */}
      {previewCamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-gray-900">Ad Preview (#{previewCamp.id.slice(0, 8)})</h3>
              <button
                onClick={() => setPreviewCamp(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>
            <RenderAdTemplate
              templateId={previewCamp.template_id || 'template-1'}
              adData={{
                title: previewCamp.title,
                description: previewCamp.description,
                imageUrl: previewCamp.image_url,
                ctaText: previewCamp.cta_text,
                targetCity: previewCamp.target_city,
                category: previewCamp.category,
                businessName: previewCamp.businesses?.business_name || 'Business',
              }}
            />
            <Button onClick={() => setPreviewCamp(null)} className="w-full">
              Close Ad Preview
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 uppercase text-[11px] font-bold text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Business & Owner</th>
              <th className="px-4 py-3">Plan & Amount</th>
              <th className="px-4 py-3">UTR / Transaction ID</th>
              <th className="px-4 py-3">Payment Proof</th>
              <th className="px-4 py-3">Statuses</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.map((camp) => {
              const isPending = camp.status === 'payment_verification' || camp.payment_status === 'pending';

              return (
                <tr key={camp.id} className="hover:bg-gray-50/80 transition-colors">
                  {/* Business & Owner */}
                  <td className="px-4 py-4 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900">
                      <Building className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>{camp.businesses?.business_name || camp.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <User className="h-3 w-3 text-gray-400 shrink-0" />
                      <span>{camp.businesses?.owner_name || 'N/A'}</span>
                    </div>
                    {camp.businesses?.phone && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{camp.businesses.phone}</span>
                      </div>
                    )}
                  </td>

                  {/* Plan & Amount */}
                  <td className="px-4 py-4">
                    <span className="font-bold text-gray-900 block">{camp.plan_name || 'Basic'}</span>
                    <span className="text-sm font-black text-amber-600 block">₹{camp.amount || 999}</span>
                    <span className="text-[10px] text-gray-400">{camp.duration_days || 30} Days</span>
                  </td>

                  {/* UTR / Transaction ID */}
                  <td className="px-4 py-4">
                    <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded text-xs">
                      {camp.utr_number || 'N/A'}
                    </span>
                    {camp.account_holder_name && (
                      <span className="block text-[10px] text-gray-400 mt-1">
                        Holder: {camp.account_holder_name}
                      </span>
                    )}
                  </td>

                  {/* Payment Proof Screenshot */}
                  <td className="px-4 py-4">
                    {camp.payment_proof_url ? (
                      <button
                        type="button"
                        onClick={() => setSelectedProofUrl(camp.payment_proof_url)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-800 underline"
                      >
                        <FileImage className="h-3.5 w-3.5" /> View Screenshot
                      </button>
                    ) : (
                      <span className="text-gray-400 text-[11px] italic">No proof uploaded</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPreviewCamp(camp)}
                      className="block text-[11px] text-purple-600 hover:underline mt-1"
                    >
                      👁️ Preview Ad
                    </button>
                  </td>

                  {/* Statuses */}
                  <td className="px-4 py-4 space-y-1">
                    <div>
                      {camp.status === 'running' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Running
                        </span>
                      )}
                      {camp.status === 'payment_verification' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          <Clock className="h-3 w-3" /> Verification Needed
                        </span>
                      )}
                      {camp.status === 'payment_failed' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          Payment Failed
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right space-x-2">
                    {isPending ? (
                      <>
                        <Button
                          size="sm"
                          disabled={loadingId === camp.id}
                          onClick={() => handleApprove(camp.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs"
                        >
                          <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loadingId === camp.id}
                          onClick={() => handleReject(camp.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 h-8 text-xs font-semibold"
                        >
                          <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                        </Button>
                      </>
                    ) : camp.status === 'running' ? (
                      <span className="text-xs font-bold text-emerald-600">✅ Active & Running</span>
                    ) : (
                      <span className="text-xs font-bold text-red-500">❌ Rejected</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
