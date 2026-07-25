import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusinessWithCategory } from '@/types/database';
import { truncateText } from '@/utils/helpers';

interface BusinessCardProps {
  business: BusinessWithCategory;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link href={`/businesses/${business.slug}`}>
      <Card className="h-full transition-all hover:shadow-md hover:border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-3">
            {/* Icon placeholder */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <span className="text-lg font-semibold">
                {business.business_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {business.categories?.name || 'Uncategorized'}
            </Badge>
          </div>

          <h3 className="mt-4 text-base font-semibold text-gray-900 line-clamp-1">
            {business.business_name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {business.city}, {business.state}
          </p>

          {business.description && (
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {truncateText(business.description, 120)}
            </p>
          )}

          <div className="mt-4 text-sm font-medium text-amber-600">
            View Details →
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
