'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';
import { useState, useEffect, startTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { logout } from '@/actions/auth';
import type { Profile } from '@/types/database';

export function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    }

    getProfile();
  }, []);

  const navLinks = profile
    ? profile.role === 'admin'
      ? [
          { href: '/admin', label: 'Overview' },
          { href: '/admin/users', label: 'Users' },
          { href: '/admin/businesses', label: 'Businesses' },
          { href: '/admin/advertisements', label: 'Advertisements' },
        ]
      : [
          { href: '/', label: 'Dashboard' },
          { href: '/dashboard/business', label: 'My Business' },
          { href: '/dashboard/search', label: 'Search Businesses' },
          { href: '/dashboard/advertisements', label: 'My Advertisements' },
        ]
    : [];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/dashboard' || href === '/admin') return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Arham Business Connect" fetchPriority="high" decoding="async" className="h-10 w-auto" />
          <span className="text-lg font-semibold text-gray-900 hidden sm:inline-block">Arham Business Connect</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive(link.href)
                  ? 'text-amber-600'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-gray-100" />
          ) : profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors">
                <User className="h-5 w-5 text-gray-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-semibold text-gray-900">
                  My Account
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/dashboard/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600"
                  onSelect={(e) => {
                    e.preventDefault();
                    startTransition(() => {
                      logout();
                    });
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-amber-500 text-slate-950 font-semibold hover:bg-amber-600">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            <nav className="mt-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive(link.href)
                      ? 'bg-amber-50 text-amber-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 border-t" />
              {profile ? (
                <>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      startTransition(() => {
                        logout();
                      });
                    }}
                    className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
