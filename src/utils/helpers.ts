/**
 * Generate a URL-friendly slug from text.
 * Example: "Royal Jewellers" + "Indore" → "royal-jewellers-indore"
 */
export function generateSlug(businessName: string, city: string): string {
  const combined = `${businessName} ${city}`;
  return combined
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove special characters
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/-+/g, '-')         // Remove consecutive hyphens
    .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
}

/**
 * Truncate text to a specified length with ellipsis.
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Capitalize first letter of each word.
 */
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
