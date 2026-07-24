'use client';

import { useState } from 'react';
import { deleteAdvertisement } from '@/actions/advertisement';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';
import type { Advertisement } from '@/types/database';

interface AdsTableProps {
  advertisements: Advertisement[];
}

export function AdvertisementsTable({ advertisements }: AdsTableProps) {
  const [ads, setAds] = useState(advertisements);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    setDeletingId(id);
    const result = await deleteAdvertisement(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Advertisement deleted.');
      setAds((prev) => prev.filter((a) => a.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="hidden sm:table-cell">City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map((ad) => (
            <TableRow key={ad.id}>
              <TableCell className="font-medium">{ad.title}</TableCell>
              <TableCell className="hidden sm:table-cell">{ad.category}</TableCell>
              <TableCell className="hidden sm:table-cell">{ad.target_city}</TableCell>
              <TableCell><StatusBadge status={ad.status} /></TableCell>
              <TableCell className="hidden md:table-cell text-gray-500 text-sm">
                {formatDate(ad.created_at)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(ad.id)}
                  disabled={deletingId === ad.id}
                >
                  {deletingId === ad.id ? '...' : 'Delete'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
