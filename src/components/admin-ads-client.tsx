'use client';

import { useState } from 'react';
import { updateAdStatus, adminDeleteAdvertisement } from '@/actions/admin';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';
import type { AdvertisementWithBusiness } from '@/types/database';

interface Props {
  initialAds: AdvertisementWithBusiness[];
  searchAction: (search: string) => Promise<AdvertisementWithBusiness[]>;
}

export function AdminAdsClient({ initialAds, searchAction }: Props) {
  const [ads, setAds] = useState(initialAds);
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const results = await searchAction(search);
    setAds(results as AdvertisementWithBusiness[]);
  }

  async function handleStatusChange(id: string, status: 'approved' | 'rejected') {
    setLoadingId(id);
    const result = await updateAdStatus(id, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Advertisement ${status}.`);
      setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
    setLoadingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    setLoadingId(id);
    const result = await adminDeleteAdvertisement(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Advertisement deleted.');
      setAds((prev) => prev.filter((a) => a.id !== id));
    }
    setLoadingId(null);
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          placeholder="Search advertisements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Business</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No advertisements found.
                </TableCell>
              </TableRow>
            ) : (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-gray-500">
                    {ad.businesses?.business_name || '—'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{ad.category}</TableCell>
                  <TableCell className="hidden md:table-cell">{ad.target_city}</TableCell>
                  <TableCell><StatusBadge status={ad.status} /></TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                    {formatDate(ad.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ad.status !== 'approved' && (
                        <Button
                          size="sm" variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleStatusChange(ad.id, 'approved')}
                          disabled={loadingId === ad.id}
                        >
                          Approve
                        </Button>
                      )}
                      {ad.status !== 'rejected' && (
                        <Button
                          size="sm" variant="outline"
                          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                          onClick={() => handleStatusChange(ad.id, 'rejected')}
                          disabled={loadingId === ad.id}
                        >
                          Reject
                        </Button>
                      )}
                      <Button
                        size="sm" variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(ad.id)}
                        disabled={loadingId === ad.id}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
