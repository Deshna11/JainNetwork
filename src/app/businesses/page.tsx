import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BusinessCard } from '@/components/business-card';
import { SearchBar } from '@/components/search-bar';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { searchBusinesses, getCategories, getDistinctCities } from '@/actions/business';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ query?: string; category?: string; city?: string; page?: string }>;
}

export const metadata = {
  title: 'Browse Businesses — Arham Business Connect',
  description: 'Search and discover Jain businesses across India.',
};

async function BusinessResults({
  searchParams,
}: {
  searchParams: { query?: string; category?: string; city?: string; page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { businesses, total, totalPages } = await searchBusinesses({
    query: searchParams.query,
    category: searchParams.category,
    city: searchParams.city,
    page,
  });

  if (businesses.length === 0) {
    return (
      <EmptyState
        title="No businesses found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-gray-500">
        Showing {businesses.length} of {total} business{total !== 1 ? 'es' : ''}
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={{
                pathname: '/businesses',
                query: { ...searchParams, page: String(page - 1) },
              }}
            >
              <Button variant="outline" size="sm">
                Previous
              </Button>
            </Link>
          )}
          <span className="px-4 text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={{
                pathname: '/businesses',
                query: { ...searchParams, page: String(page + 1) },
              }}
            >
              <Button variant="outline" size="sm">
                Next
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default async function BusinessesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const [categories, cities] = await Promise.all([getCategories(), getDistinctCities()]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Browse Businesses</h1>
            <p className="mt-2 text-gray-500">
              Search and discover trusted businesses in the Jain community.
            </p>
          </div>

          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
            <Suspense fallback={null}>
              <SearchBar categories={categories} cities={cities} />
            </Suspense>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-48 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
                ))}
              </div>
            }
          >
            <BusinessResults searchParams={resolvedParams} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
