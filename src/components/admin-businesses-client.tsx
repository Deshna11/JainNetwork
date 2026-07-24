'use client';

import { useState } from 'react';
import { updateBusinessStatus, adminDeleteBusiness } from '@/actions/admin';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';
import type { BusinessWithCategory } from '@/types/database';

interface Props {
  initialBusinesses: BusinessWithCategory[];
  searchAction: (search: string) => Promise<BusinessWithCategory[]>;
}

export function AdminBusinessesClient({ initialBusinesses, searchAction }: Props) {
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const results = await searchAction(search);
    setBusinesses(results as BusinessWithCategory[]);
  }

  async function handleStatusChange(id: string, status: 'approved' | 'rejected') {
    setLoadingId(id);
    const result = await updateBusinessStatus(id, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Business ${status}.`);
      setBusinesses((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    }
    setLoadingId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure? This will also delete all related advertisements.')) return;
    setLoadingId(id);
    const result = await adminDeleteBusiness(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Business deleted.');
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
    }
    setLoadingId(null);
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          placeholder="Search businesses..."
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
              <TableHead>Business</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No businesses found.
                </TableCell>
              </TableRow>
            ) : (
              businesses.map((biz) => (
                <TableRow key={biz.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{biz.business_name}</p>
                      <p className="text-xs text-gray-500">{biz.owner_name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{biz.categories?.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{biz.city}</TableCell>
                  <TableCell><StatusBadge status={biz.status} /></TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                    {formatDate(biz.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {biz.status !== 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleStatusChange(biz.id, 'approved')}
                          disabled={loadingId === biz.id}
                        >
                          Approve
                        </Button>
                      )}
                      {biz.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                          onClick={() => handleStatusChange(biz.id, 'rejected')}
                          disabled={loadingId === biz.id}
                        >
                          Reject
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(biz.id)}
                        disabled={loadingId === biz.id}
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
