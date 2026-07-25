'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/businesses', label: 'Businesses', icon: '🏢' },
  { href: '/admin/advertisements', label: 'Advertisements', icon: '📢' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
];

export function MobileAdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex w-max space-x-2 px-1">
        {adminLinks.map((link) => (
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
