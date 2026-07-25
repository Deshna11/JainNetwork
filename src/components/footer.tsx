import Link from 'next/link';

import { Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Arham Business Connect" loading="lazy" decoding="async" className="h-10 w-auto" />
              <span className="text-lg font-semibold text-gray-900">Arham Business Connect</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Discover and connect with trusted Jain businesses across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/businesses" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Browse Businesses
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Register Your Business
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-gray-500">Built for the Jain community</li>
              <li className="text-sm text-gray-500">Free business listings</li>
              <li className="text-sm text-gray-500">Admin-verified businesses</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact Us</h3>
            <ul className="mt-3 space-y-3">
              <li>
                <a href="mailto:arhambizconnect@gmail.com" className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 transition-colors">
                  <Mail className="h-4 w-4" /> arhambizconnect@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/917588668857" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 transition-colors">
                  <MessageCircle className="h-4 w-4" /> +91 7588668857 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-4 pt-2">
                <a href="https://www.linkedin.com/in/arham-business-38bbb8424" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/arhambusinessconnect" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-600 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="https://www.threads.com/@arhambusinessconnect" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-600 transition-colors flex items-center justify-center font-bold text-lg leading-none" title="Threads">
                  @
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Arham Business Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
