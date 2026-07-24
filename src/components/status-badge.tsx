import { Badge } from '@/components/ui/badge';
import { STATUS_CONFIG } from '@/lib/constants';
import type { BusinessStatus, AdStatus } from '@/types/database';

interface StatusBadgeProps {
  status: BusinessStatus | AdStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
