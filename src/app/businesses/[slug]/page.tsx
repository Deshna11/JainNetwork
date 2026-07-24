import { notFound } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getBusinessBySlug } from '@/actions/business';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business) return { title: 'Business Not Found' };
  return {
    title: `${business.business_name} — Jain Network`,
    description: business.description || `${business.business_name} in ${business.city}, ${business.state}`,
  };
}

export default async function BusinessDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business || business.status !== 'approved') {
    notFound();
  }

  const details = [
    { label: 'Owner', value: business.owner_name },
    { label: 'Category', value: business.categories?.name },
    { label: 'Phone', value: business.phone },
    { label: 'Email', value: business.email },
    { label: 'Website', value: business.website },
    { label: 'Address', value: business.address },
    { label: 'City', value: business.city },
    { label: 'State', value: business.state },
    { label: 'GST Number', value: business.gst_number },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/businesses">
            <Button variant="ghost" size="sm" className="mb-6 text-gray-500">
              ← Back to Businesses
            </Button>
          </Link>

          <Card>
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <span className="text-2xl font-bold">
                    {business.business_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{business.business_name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{business.categories?.name}</Badge>
                    <span className="text-sm text-gray-500">
                      {business.city}, {business.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {business.description && (
                <div className="mt-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                    About
                  </h2>
                  <p className="mt-2 text-gray-700 leading-relaxed">{business.description}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="mt-8 border-t pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Business Details
                </h2>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {details.map(
                    (detail) =>
                      detail.value && (
                        <div key={detail.label}>
                          <dt className="text-sm font-medium text-gray-500">{detail.label}</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {detail.label === 'Website' ? (
                              <a
                                href={detail.value.startsWith('http') ? detail.value : `https://${detail.value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {detail.value}
                              </a>
                            ) : detail.label === 'Email' ? (
                              <a href={`mailto:${detail.value}`} className="text-blue-600 hover:underline">
                                {detail.value}
                              </a>
                            ) : detail.label === 'Phone' ? (
                              <a href={`tel:${detail.value}`} className="text-blue-600 hover:underline">
                                {detail.value}
                              </a>
                            ) : (
                              detail.value
                            )}
                          </dd>
                        </div>
                      )
                  )}
                </dl>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
