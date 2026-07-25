import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function BusinessesLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="mt-4 h-5 w-96 bg-gray-100 rounded animate-pulse"></div>
          </div>

          <div className="sticky top-[72px] z-40 mb-8 rounded-xl border border-gray-200 bg-white/95 p-5 shadow-sm">
            <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
          </div>

          <div className="mb-6 h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
