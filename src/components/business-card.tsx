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
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Icon placeholder */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <span className="text-sm font-semibold">
                {business.business_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <Badge variant="secondary" className="shrink-0 text-[10px] px-2 py-0 font-medium">
              {business.categories?.name || 'Uncategorized'}
            </Badge>
          </div>

          <h3 className="mt-3 text-sm font-semibold text-gray-900 line-clamp-1">
            {business.business_name}
          </h3>

          <p className="mt-0.5 text-[11px] text-gray-500">
            {business.city}, {business.state}
          </p>

          {business.description && (
            <p className="mt-2 text-xs text-gray-600 line-clamp-2">
              {truncateText(business.description, 100)}
            </p>
          )}

          <div className="mt-3 text-xs font-semibold text-amber-600">
            View Details →
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
