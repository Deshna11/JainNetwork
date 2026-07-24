import { Suspense } from 'react';
import { SearchBar } from '@/components/search-bar';
import { BusinessCard } from '@/components/business-card';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { searchBusinesses, getCategories, getDistinctCities } from '@/actions/business';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ query?: string; category?: string; city?: string; page?: string }>;
}

export const metadata = {
  title: 'Search Businesses — Jain Network',
};

export default async function DashboardSearchPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const [categories, cities] = await Promise.all([getCategories(), getDistinctCities()]);

  const page = parseInt(resolvedParams.page || '1');
  const { businesses, total, totalPages } = await searchBusinesses({
    query: resolvedParams.query,
    category: resolvedParams.category,
    city: resolvedParams.city,
    page,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Search Businesses</h1>
      <p className="mt-1 text-gray-500">Find businesses in the Jain community.</p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <Suspense fallback={null}>
          <SearchBar categories={categories} cities={cities} basePath="/dashboard/search" />
        </Suspense>
      </div>

      <div className="mt-8">
        {businesses.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-gray-500">
              Showing {businesses.length} of {total} result{total !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link href={{ pathname: '/dashboard/search', query: { ...resolvedParams, page: String(page - 1) } }}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                )}
                <span className="px-4 text-sm text-gray-500">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link href={{ pathname: '/dashboard/search', query: { ...resolvedParams, page: String(page + 1) } }}>
                    <Button variant="outline" size="sm">Next</Button>
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No businesses found"
            description="Try adjusting your search or filters."
          />
        )}
      </div>
    </div>
  );
}
