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

export function MobileDashboardNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex w-max space-x-2 px-1">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive(link.href)
                ? 'bg-amber-100 text-amber-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
