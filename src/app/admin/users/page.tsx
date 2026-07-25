import { getAllUsers } from '@/actions/admin';
import { AdminUsersClient } from '@/components/admin-users-client';

export const metadata = {
  title: 'Manage Users — Admin',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
      <p className="mt-1 mb-6 text-gray-500">View and manage platform users.</p>
      <AdminUsersClient
        initialUsers={users}
        searchAction={async (search: string) => {
          'use server';
          return getAllUsers(search);
        }}
      />
    </div>
  );
}
