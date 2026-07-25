'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/business', label: 'My Business', icon: '🏢' },
  { href: '/dashboard/search', label: 'Search Businesses', icon: '🔍' },
  { href: '/dashboard/advertisements', label: 'My Advertisements', icon: '📢' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-1">
      {sidebarLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isActive(link.href)
              ? 'bg-amber-50 text-amber-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <span className="text-base">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
