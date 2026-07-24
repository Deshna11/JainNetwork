'use client';

import { useState } from 'react';
import { adminDeleteUser } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { formatDate } from '@/utils/helpers';
import type { Profile } from '@/types/database';

interface Props {
  initialUsers: Profile[];
  searchAction: (search: string) => Promise<Profile[]>;
}

export function AdminUsersClient({ initialUsers, searchAction }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const results = await searchAction(search);
    setUsers(results);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure? This will delete the user and all their data.')) return;
    setLoadingId(id);
    const result = await adminDeleteUser(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('User deleted.');
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
    setLoadingId(null);
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          placeholder="Search users..."
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden sm:table-cell">Joined</TableHead>
              <TableHead className="w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || '—'}</TableCell>
                  <TableCell className="text-sm text-gray-500">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell>
                    {user.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(user.id)}
                        disabled={loadingId === user.id}
                      >
                        Delete
                      </Button>
                    )}
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
