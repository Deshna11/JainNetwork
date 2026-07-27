import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BusinessCard } from '@/components/business-card';
import { Button } from '@/components/ui/button';
import { getLatestBusinesses, getHomeStats, getCategories, getMyBusiness } from '@/actions/business';
import { getHomepageRunningAdsAction } from '@/actions/advertisement';
import { getProfile } from '@/actions/auth';
import { RenderAdTemplate } from '@/components/ad-templates';
import { HeroCarousel } from '@/components/hero-carousel';
import { HOW_IT_WORKS } from '@/lib/constants';
import {
  Sparkles,
  Search,
  PlusCircle,
  TrendingUp,
  Scale,
  Calculator,
  Stethoscope,
  Compass,
  Building2,
  Gem,
  Utensils,
  Megaphone,
  Globe,
  Lightbulb,
  ShoppingBag,
  Briefcase,
  Coins,
  ShieldCheck,
  Camera,
  Palette,
  Plane,
  Bath,
} from 'lucide-react';

const POPULAR_CATEGORIES = [
  { name: 'Financial Advisors', icon: TrendingUp },
  { name: 'Lawyers', icon: Scale },
  { name: 'Chartered Accountants', icon: Calculator },
  { name: 'Doctors', icon: Stethoscope },
  { name: 'Architects', icon: Compass },
  { name: 'Builders', icon: Building2 },
  { name: 'Jewellers', icon: Gem },
  { name: 'Food Products', icon: Utensils },
  { name: 'Digital Marketers', icon: Megaphone },
  { name: 'Exporters', icon: Globe },
  { name: 'Cosmetics & Skincare', icon: Sparkles },
  { name: 'Entrepreneurs', icon: Lightbulb },
  { name: 'Retailers', icon: ShoppingBag },
  { name: 'Consultants', icon: Briefcase },
  { name: 'Investors', icon: Coins },
  { name: 'Photographers', icon: Camera },
  { name: 'Graphics Designers', icon: Palette },
  { name: 'Travel Agents', icon: Plane },
  { name: 'Tiles and Sanitarywares', icon: Bath },
];

export default async function HomePage() {
  const [latestBusinesses, stats, categories, runningAds, profile, business] = await Promise.all([
    getLatestBusinesses(6),
    getHomeStats(),
    getCategories(),
    getHomepageRunningAdsAction(),
    getProfile(),
    getMyBusiness(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Non-intrusive banner if user is logged in but hasn't registered a business yet */}
      {profile && !business && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 py-2.5 px-4 shadow-sm border-b border-amber-600/30">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs sm:text-sm font-bold">
            <div>
              <span>✨ You haven&apos;t registered a business yet. Register your business to unlock additional features and get listed on the directory.</span>
            </div>
            <Link href="/dashboard/business/register" className="shrink-0">
              <Button size="sm" className="bg-slate-950 text-white hover:bg-slate-800 text-xs font-black px-4 py-1.5 h-auto rounded-lg shadow-sm">
                Register Your Business →
              </Button>
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Modern Full-Width Hero Image Carousel Showcase */}
        <HeroCarousel />

        {/* Hero Search & Call-to-action Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 py-16 sm:py-24">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Jain Businesses
              <br />
              <span className="text-slate-300">Across India</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-200">
              Find trusted businesses in the Jain community. Register your business, get discovered, and grow your network.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/businesses" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full sm:w-auto px-7 bg-white text-slate-900 hover:bg-amber-50 font-black text-base shadow-xl rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Search className="mr-2 h-5 w-5 text-amber-600" />
                  Search Businesses
                </Button>
              </Link>

              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-12 w-full sm:w-auto px-7 bg-slate-950/60 text-white border-2 border-white/60 hover:bg-white hover:text-slate-950 font-black text-base shadow-lg rounded-xl transition-all duration-300 hover:scale-105"
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
                <p className="text-3xl font-bold text-amber-600">{stats.totalBusinesses}+</p>
                <p className="mt-1 text-sm text-gray-500">Registered Businesses</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600">{stats.totalCategories}</p>
                <p className="mt-1 text-sm text-gray-500">Business Categories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-600">{stats.totalCities}+</p>
                <p className="mt-1 text-sm text-gray-500">Cities Covered</p>
              </div>
            </div>
          </div>
        </section>

        {/* ⭐ Featured Businesses (Sponsored Campaigns with Fair Rotation) */}
        {runningAds.length > 0 && (
          <section className="bg-gradient-to-b from-slate-50/60 via-amber-50/30 to-white py-16 sm:py-20 border-y border-amber-100/60">
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
                  <Button variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50 font-semibold">
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
              <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">Popular Categories</h2>
              <p className="mt-2 text-sm text-gray-500">Explore businesses & professionals across key industries</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {POPULAR_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={`/businesses?category=${encodeURIComponent(cat.name)}`}
                    className="group relative flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white p-5 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-slate-950">
                      <IconComponent className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 transition-colors group-hover:text-amber-600">
                      {cat.name}
                    </p>
                  </Link>
                );
              })}
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
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-semibold text-lg font-bold ">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ⭐ The Vision Behind Arham Business Connect */}
        <section className="bg-white py-16 sm:py-24 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-900 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Leadership & Vision
              </span>
              <h2 className="text-2xl font-black text-gray-900 sm:text-4xl tracking-tight">
                The Vision Behind Arham Business Connect
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
                Meet the person dedicated to building meaningful connections within the Jain business community.
              </p>
            </div>

            {/* Two-Column Card Layout */}
            <div className="mt-12 mx-auto max-w-4xl rounded-3xl border border-gray-200/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 shadow-2xl text-white">
              <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-center md:justify-between gap-8 md:gap-12">
                {/* Left Side: Circular Portrait with Metallic Gold Border */}
                <div className="shrink-0">
                  <div className="relative inline-block">
                    <div className="h-48 w-48 sm:h-52 sm:w-52 rounded-full p-[3px] bg-gradient-to-tr from-[#B8860B] via-[#D4AF37] to-[#F3E5AB] shadow-xl shadow-amber-950/20">
                      <img
                        src="/darshan-oswal.jpg"
                        alt="Darshan Bharatji Oswal"
                        className="h-full w-full rounded-full object-cover object-[center_15%] shadow-inner"
                      />
                    </div>
                    {/* Premium Metallic Gold Verified Badge */}
                    <div
                      className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#B8860B] via-[#D4AF37] to-[#F3E5AB] text-slate-950 font-bold shadow-md border-2 border-slate-950"
                      title="Brand Ambassador & AI Engineer"
                    >
                      <ShieldCheck className="h-4 w-4 text-slate-950" />
                    </div>
                  </div>
                </div>

                {/* Right Side: Details & Quote */}
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                      Brand Ambassador
                    </span>
                    <h3 className="mt-1 text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Darshan Bharatji Oswal
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-slate-300">
                      B.Tech CSE | AI Engineer | Jeweller
                    </p>
                  </div>

                  <div className="my-4 border-t border-slate-800" />

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                    &ldquo;The face of Arham Business Connect, inspiring entrepreneurs to connect, collaborate, and create opportunities.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
