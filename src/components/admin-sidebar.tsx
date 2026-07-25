'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/businesses', label: 'Businesses', icon: '🏢' },
  { href: '/admin/advertisements', label: 'Advertisements', icon: '📢' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-1">
      <div className="mb-3 px-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Admin Panel
        </p>
      </div>
      {adminLinks.map((link) => (
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
