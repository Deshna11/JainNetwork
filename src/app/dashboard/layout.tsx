import { Navbar } from '@/components/navbar';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { MobileDashboardNav } from '@/components/mobile-dashboard-nav';
import { logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Dashboard — Arham Business Connect',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-col md:flex-row flex-1 gap-4 md:gap-8 px-4 py-6 md:py-8 sm:px-6 lg:px-8">
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-b pb-4 mb-2">
          <MobileDashboardNav />
        </div>
        {/* Sidebar — desktop only */}
        <aside className="hidden w-56 shrink-0 md:block">
          <DashboardSidebar />
          <div className="mt-6 border-t pt-4">
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
