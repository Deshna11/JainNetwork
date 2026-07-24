import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">JN</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Jain Network</span>
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

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-gray-500">
                Built for the Jain community
              </li>
              <li className="text-sm text-gray-500">
                Free business listings
              </li>
              <li className="text-sm text-gray-500">
                Admin-verified businesses
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Jain Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
