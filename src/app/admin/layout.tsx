import { Navbar } from '@/components/navbar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Panel — Jain Network',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <AdminSidebar />
          <div className="mt-6 space-y-1 border-t pt-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500">
                ← Back to Dashboard
              </Button>
            </Link>
            <form action={logout}>
              <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
