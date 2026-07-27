import { createClient } from '@/lib/supabase/client';

export interface LocationSuggestion {
  id: string;
  name: string;
  district?: string;
  state: string;
  type: 'State' | 'Union Territory' | 'District' | 'City' | 'Town' | 'Village' | 'Locality';
  formatted: string;
  aliases?: string[];
}

export interface LocationSearchResult {
  suggestions: LocationSuggestion[];
  didYouMean?: LocationSuggestion[];
}

// Fallback dataset for emergency offline or instant load scenarios
export const INDIA_PLACES_DATASET: LocationSuggestion[] = [
  { id: 'loc-indore-mp', name: 'Indore', district: 'Indore', state: 'Madhya Pradesh', type: 'City', formatted: 'Indore, Madhya Pradesh' },
  { id: 'loc-dhar-mp', name: 'Dhar', district: 'Dhar', state: 'Madhya Pradesh', type: 'City', formatted: 'Dhar, Madhya Pradesh' },
  { id: 'loc-kukshi-mp', name: 'Kukshi', district: 'Dhar', state: 'Madhya Pradesh', type: 'Town', formatted: 'Kukshi, Madhya Pradesh' },
  { id: 'loc-mumbai-mh', name: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', type: 'City', formatted: 'Mumbai, Maharashtra', aliases: ['Bombay'] },
  { id: 'loc-mahuva-gj', name: 'Mahuva', district: 'Bhavnagar', state: 'Gujarat', type: 'Town', formatted: 'Mahuva, Bhavnagar, Gujarat' },
  { id: 'loc-mahidpur-mp', name: 'Mahidpur', district: 'Ujjain', state: 'Madhya Pradesh', type: 'Town', formatted: 'Mahidpur, Ujjain, Madhya Pradesh' },
  { id: 'loc-maharajganj-up', name: 'Maharajganj', district: 'Maharajganj', state: 'Uttar Pradesh', type: 'Town', formatted: 'Maharajganj, Uttar Pradesh' },
  { id: 'loc-indi-ka', name: 'Indi', district: 'Vijayapura', state: 'Karnataka', type: 'Town', formatted: 'Indi, Vijayapura, Karnataka' },
  { id: 'loc-bengaluru-ka', name: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', type: 'City', formatted: 'Bengaluru, Karnataka', aliases: ['Bangalore'] },
  { id: 'loc-delhi-dl', name: 'Delhi', district: 'New Delhi', state: 'Delhi', type: 'City', formatted: 'Delhi, India' },
  { id: 'loc-palitana-gj', name: 'Palitana', district: 'Bhavnagar', state: 'Gujarat', type: 'Town', formatted: 'Palitana, Bhavnagar, Gujarat' },
  { id: 'loc-shravanabelagola-ka', name: 'Shravanabelagola', district: 'Hassan', state: 'Karnataka', type: 'Town', formatted: 'Shravanabelagola, Hassan, Karnataka' },
  { id: 'loc-sammed-shikharji-jh', name: 'Sammed Shikharji', district: 'Giridih', state: 'Jharkhand', type: 'Town', formatted: 'Sammed Shikharji, Giridih, Jharkhand' }
];

/**
 * Perform autocomplete search on India's local location database.
 * Supports States, Union Territories, Districts, Cities, Towns, Villages, & Localities.
 * Features prefix, partial, and fuzzy spelling matching.
 */
export async function searchLocationSuggestions(
  query: string
): Promise<LocationSearchResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { suggestions: [] };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('search_locations_fn', {
      search_query: trimmed,
      result_limit: 15,
    });

    if (!error && Array.isArray(data) && data.length > 0) {
      const suggestions: LocationSuggestion[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        district: item.district || undefined,
        state: item.state,
        type: item.type,
        formatted: item.formatted,
        aliases: item.aliases || undefined,
      }));

      // High match score items (score >= 40) are primary suggestions
      const directMatches = suggestions.filter((s: any) => (s as any).match_score !== undefined ? (s as any).match_score >= 40 : true);
      const lowMatches = suggestions.filter((s: any) => (s as any).match_score !== undefined && (s as any).match_score < 40);

      if (directMatches.length > 0) {
        return { suggestions: directMatches };
      } else {
        return {
          suggestions: [],
          didYouMean: suggestions.slice(0, 3),
        };
      }
    }
  } catch (err) {
    console.error('Error querying location database:', err);
  }

  // Fallback in-memory search if DB query fails or returns no rows
  const lowerQuery = trimmed.toLowerCase();
  const fallbackMatches = INDIA_PLACES_DATASET.filter((p) => {
    return (
      p.name.toLowerCase().includes(lowerQuery) ||
      p.state.toLowerCase().includes(lowerQuery) ||
      (p.district && p.district.toLowerCase().includes(lowerQuery)) ||
      p.formatted.toLowerCase().includes(lowerQuery) ||
      (p.aliases && p.aliases.some((a) => a.toLowerCase().includes(lowerQuery)))
    );
  });

  if (fallbackMatches.length > 0) {
    return { suggestions: fallbackMatches };
  }

  const didYouMean = INDIA_PLACES_DATASET.filter((p) =>
    p.name.toLowerCase().startsWith(lowerQuery[0])
  ).slice(0, 3);

  return {
    suggestions: [],
    didYouMean: didYouMean.length > 0 ? didYouMean : [INDIA_PLACES_DATASET[0]],
  };
}
