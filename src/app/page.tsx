import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BusinessCard } from '@/components/business-card';
import { Button } from '@/components/ui/button';
import { getLatestBusinesses, getHomeStats, getCategories } from '@/actions/business';
import { getHomepageRunningAdsAction } from '@/actions/advertisement';
import { RenderAdTemplate } from '@/components/ad-templates';
import { HeroCarousel } from '@/components/hero-carousel';
import { HOW_IT_WORKS } from '@/lib/constants';
import { Sparkles, Search, PlusCircle } from 'lucide-react';

export default async function HomePage() {
  const [latestBusinesses, stats, categories, runningAds] = await Promise.all([
    getLatestBusinesses(6),
    getHomeStats(),
    getCategories(),
    getHomepageRunningAdsAction(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Modern Full-Width Hero Image Carousel Showcase */}
        <HeroCarousel />

        {/* Hero Search & Call-to-action Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 sm:py-24">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Jain Businesses
              <br />
              <span className="text-blue-200">Across India</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-blue-100">
              Find trusted businesses in the Jain community. Register your business, get discovered, and grow your network.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/businesses" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full sm:w-auto px-7 bg-white text-blue-900 hover:bg-blue-50 font-black text-base shadow-xl rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Search className="mr-2 h-5 w-5 text-blue-600" />
                  Search Businesses
                </Button>
              </Link>

              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full sm:w-auto px-7 bg-blue-950/60 text-white border-2 border-white/60 hover:bg-white hover:text-blue-950 font-black text-base shadow-lg rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <PlusCircle className="mr-2 h-5 w-5 text-amber-300" />
                  Register Your Business
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-gray-100 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.totalBusinesses}+</p>
                <p className="mt-1 text-sm text-gray-500">Registered Businesses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.totalCategories}</p>
                <p className="mt-1 text-sm text-gray-500">Business Categories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.totalCities}+</p>
                <p className="mt-1 text-sm text-gray-500">Cities Covered</p>
              </div>
            </div>
          </div>
        </section>

        {/* ⭐ Featured Businesses (Sponsored Campaigns with Fair Rotation) */}
        {runningAds.length > 0 && (
          <section className="bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-white py-16 sm:py-20 border-y border-blue-100/60">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" /> ⭐ Featured Businesses
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">Promoted Partners</h2>
                  <p className="mt-1 text-sm text-gray-600">Top recommended businesses & exclusive offers</p>
                </div>
                <Link href="/dashboard/advertisements/create">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold">
                    Promote Your Business
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {runningAds.map((ad: any) => (
                  <RenderAdTemplate
                    key={ad.id}
                    templateId={ad.template_id || 'template-1'}
                    adData={{
                      title: ad.title,
                      description: ad.description,
                      imageUrl: ad.image_url,
                      ctaText: ad.cta_text,
                      targetCity: ad.target_city,
                      category: ad.category,
                      businessName: ad.businesses?.business_name || ad.title,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Popular Categories */}
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Popular Categories</h2>
              <p className="mt-2 text-gray-500">Browse businesses by category</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {categories.slice(0, 10).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/businesses?category=${cat.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-blue-200 hover:shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Approved Businesses */}
        {latestBusinesses.length > 0 && (
          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Latest Businesses</h2>
                  <p className="mt-2 text-gray-500">Recently approved business listings</p>
                </div>
                <Link href="/businesses">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">How It Works</h2>
              <p className="mt-2 text-gray-500">Get your business listed in 4 simple steps</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
