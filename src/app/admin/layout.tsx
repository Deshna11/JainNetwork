import { Navbar } from '@/components/navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Panel — Arham Business Connect',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:py-8 sm:px-6 lg:px-8">
        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
