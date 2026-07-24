export interface LocationSuggestion {
  id: string;
  name: string;
  district?: string;
  state: string;
  type: 'City' | 'Town' | 'Village' | 'District' | 'State';
  formatted: string;
  aliases?: string[];
}

export interface LocationSearchResult {
  suggestions: LocationSuggestion[];
  didYouMean?: LocationSuggestion[];
}

// Master Indian Places Dataset covering Cities, Towns, Tehsils, Villages, & Districts
export const INDIA_PLACES_DATASET: LocationSuggestion[] = [
  // User Requested & "Dha-" Places
  { id: 'loc-dhar-mp', name: 'Dhar', district: 'Dhar', state: 'Madhya Pradesh', type: 'City', formatted: 'Dhar, Madhya Pradesh' },
  { id: 'loc-dahod-gj', name: 'Dahod', district: 'Dahod', state: 'Gujarat', type: 'City', formatted: 'Dahod, Gujarat', aliases: ['Dohad'] },
  { id: 'loc-kukshi-mp', name: 'Kukshi', district: 'Dhar', state: 'Madhya Pradesh', type: 'Town', formatted: 'Kukshi, Madhya Pradesh' },
  { id: 'loc-sardarpur-mp', name: 'Sardarpur', district: 'Dhar', state: 'Madhya Pradesh', type: 'Town', formatted: 'Sardarpur, Madhya Pradesh' },
  { id: 'loc-dharampur-gj', name: 'Dharampur', district: 'Valsad', state: 'Gujarat', type: 'Town', formatted: 'Dharampur, Gujarat' },
  { id: 'loc-dharmapuri-tn', name: 'Dharmapuri', district: 'Dharmapuri', state: 'Tamil Nadu', type: 'City', formatted: 'Dharmapuri, Tamil Nadu' },
  { id: 'loc-dharamsala-hp', name: 'Dharamsala', district: 'Kangra', state: 'Himachal Pradesh', type: 'City', formatted: 'Dharamsala, Himachal Pradesh', aliases: ['Dharamshala'] },
  { id: 'loc-dharwad-ka', name: 'Dharwad', district: 'Dharwad', state: 'Karnataka', type: 'City', formatted: 'Dharwad, Karnataka' },
  { id: 'loc-dharangaon-mh', name: 'Dharangaon', district: 'Jalgaon', state: 'Maharashtra', type: 'Town', formatted: 'Dharangaon, Maharashtra' },
  { id: 'loc-dhari-gj', name: 'Dhari', district: 'Amreli', state: 'Gujarat', type: 'Town', formatted: 'Dhari, Gujarat' },

  // Major Cities & Metro Hubs
  { id: 'loc-mumbai-mh', name: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', type: 'City', formatted: 'Mumbai, Maharashtra', aliases: ['Bombay'] },
  { id: 'loc-indore-mp', name: 'Indore', district: 'Indore', state: 'Madhya Pradesh', type: 'City', formatted: 'Indore, Madhya Pradesh' },
  { id: 'loc-indapur-mh', name: 'Indapur', district: 'Pune', state: 'Maharashtra', type: 'Town', formatted: 'Indapur, Maharashtra' },
  { id: 'loc-indi-ka', name: 'Indi', district: 'Vijayapura', state: 'Karnataka', type: 'Town', formatted: 'Indi, Karnataka' },
  { id: 'loc-indore-wb', name: 'Indore', district: 'Bankura', state: 'West Bengal', type: 'Village', formatted: 'Indore, West Bengal' },
  { id: 'loc-bengaluru-ka', name: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', type: 'City', formatted: 'Bengaluru, Karnataka', aliases: ['Bangalore', 'Banglore'] },
  { id: 'loc-delhi-dl', name: 'Delhi', district: 'New Delhi', state: 'Delhi', type: 'City', formatted: 'Delhi' },
  { id: 'loc-ahmedabad-gj', name: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', type: 'City', formatted: 'Ahmedabad, Gujarat', aliases: ['Amdavad'] },
  { id: 'loc-surat-gj', name: 'Surat', district: 'Surat', state: 'Gujarat', type: 'City', formatted: 'Surat, Gujarat' },
  { id: 'loc-pune-mh', name: 'Pune', district: 'Pune', state: 'Maharashtra', type: 'City', formatted: 'Pune, Maharashtra', aliases: ['Poona'] },
  { id: 'loc-jaipur-rj', name: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', type: 'City', formatted: 'Jaipur, Rajasthan' },
  { id: 'loc-hyderabad-tg', name: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', type: 'City', formatted: 'Hyderabad, Telangana' },
  { id: 'loc-chennai-tn', name: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', type: 'City', formatted: 'Chennai, Tamil Nadu', aliases: ['Madras'] },
  { id: 'loc-kolkata-wb', name: 'Kolkata', district: 'Kolkata', state: 'West Bengal', type: 'City', formatted: 'Kolkata, West Bengal', aliases: ['Calcutta'] },

  // Disambiguated Duplicate Names
  { id: 'loc-rampur-up', name: 'Rampur', district: 'Rampur', state: 'Uttar Pradesh', type: 'City', formatted: 'Rampur, Uttar Pradesh' },
  { id: 'loc-rampur-uk', name: 'Rampur', district: 'Dehradun', state: 'Uttarakhand', type: 'Town', formatted: 'Rampur, Uttarakhand' },
  { id: 'loc-rampur-br', name: 'Rampur', district: 'Gaya', state: 'Bihar', type: 'Town', formatted: 'Rampur, Bihar' },
  { id: 'loc-rampur-hp', name: 'Rampur Bushahr', district: 'Shimla', state: 'Himachal Pradesh', type: 'Town', formatted: 'Rampur Bushahr, Himachal Pradesh' },

  // Jain Pilgrimage Centers & Unique Towns/Villages
  { id: 'loc-palitana-gj', name: 'Palitana', district: 'Bhavnagar', state: 'Gujarat', type: 'Town', formatted: 'Palitana, Gujarat' },
  { id: 'loc-shravanabelagola-ka', name: 'Shravanabelagola', district: 'Hassan', state: 'Karnataka', type: 'Town', formatted: 'Shravanabelagola, Karnataka', aliases: ['Sravanabelagola'] },
  { id: 'loc-sammed-shikharji-jh', name: 'Sammed Shikharji (Parasnath)', district: 'Giridih', state: 'Jharkhand', type: 'Town', formatted: 'Sammed Shikharji, Jharkhand', aliases: ['Shikharji', 'Parasnath'] },
  { id: 'loc-pawapuri-br', name: 'Pawapuri', district: 'Nalanda', state: 'Bihar', type: 'Town', formatted: 'Pawapuri, Bihar' },
  { id: 'loc-sonagiri-mp', name: 'Sonagiri', district: 'Datia', state: 'Madhya Pradesh', type: 'Town', formatted: 'Sonagiri, Madhya Pradesh' },
  { id: 'loc-ranakpur-rj', name: 'Ranakpur', district: 'Pali', state: 'Rajasthan', type: 'Village', formatted: 'Ranakpur, Rajasthan' },
  { id: 'loc-girnar-gj', name: 'Girnar (Junagadh)', district: 'Junagadh', state: 'Gujarat', type: 'Town', formatted: 'Girnar, Junagadh, Gujarat', aliases: ['Junagadh'] },
  { id: 'loc-hastinapur-up', name: 'Hastinapur', district: 'Meerut', state: 'Uttar Pradesh', type: 'Town', formatted: 'Hastinapur, Uttar Pradesh' },
  { id: 'loc-mountabu-rj', name: 'Mount Abu', district: 'Sirohi', state: 'Rajasthan', type: 'Town', formatted: 'Mount Abu, Rajasthan', aliases: ['Dilwara'] },
  { id: 'loc-taranga-gj', name: 'Taranga', district: 'Mehsana', state: 'Gujarat', type: 'Village', formatted: 'Taranga, Gujarat' },
  { id: 'loc-karkala-ka', name: 'Karkala', district: 'Udupi', state: 'Karnataka', type: 'Town', formatted: 'Karkala, Karnataka' },
  { id: 'loc-moodabidri-ka', name: 'Moodabidri', district: 'Dakshina Kannada', state: 'Karnataka', type: 'Town', formatted: 'Moodabidri, Karnataka' },

  // Madhya Pradesh Places (Cities, Towns, Tehsils)
  { id: 'loc-bhopal-mp', name: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh', type: 'City', formatted: 'Bhopal, Madhya Pradesh' },
  { id: 'loc-ujjain-mp', name: 'Ujjain', district: 'Ujjain', state: 'Madhya Pradesh', type: 'City', formatted: 'Ujjain, Madhya Pradesh' },
  { id: 'loc-gwalior-mp', name: 'Gwalior', district: 'Gwalior', state: 'Madhya Pradesh', type: 'City', formatted: 'Gwalior, Madhya Pradesh' },
  { id: 'loc-jabalpur-mp', name: 'Jabalpur', district: 'Jabalpur', state: 'Madhya Pradesh', type: 'City', formatted: 'Jabalpur, Madhya Pradesh' },
  { id: 'loc-khandwa-mp', name: 'Khandwa', district: 'Khandwa', state: 'Madhya Pradesh', type: 'City', formatted: 'Khandwa, Madhya Pradesh' },
  { id: 'loc-mhow-mp', name: 'Mhow (Dr. Ambedkar Nagar)', district: 'Indore', state: 'Madhya Pradesh', type: 'Town', formatted: 'Mhow, Madhya Pradesh' },
  { id: 'loc-ratlam-mp', name: 'Ratlam', district: 'Ratlam', state: 'Madhya Pradesh', type: 'City', formatted: 'Ratlam, Madhya Pradesh' },
  { id: 'loc-neemuch-mp', name: 'Neemuch', district: 'Neemuch', state: 'Madhya Pradesh', type: 'City', formatted: 'Neemuch, Madhya Pradesh' },
  { id: 'loc-mandsaur-mp', name: 'Mandsaur', district: 'Mandsaur', state: 'Madhya Pradesh', type: 'City', formatted: 'Mandsaur, Madhya Pradesh' },
  { id: 'loc-dewas-mp', name: 'Dewas', district: 'Dewas', state: 'Madhya Pradesh', type: 'City', formatted: 'Dewas, Madhya Pradesh' },
  { id: 'loc-khargone-mp', name: 'Khargone', district: 'Khargone', state: 'Madhya Pradesh', type: 'City', formatted: 'Khargone, Madhya Pradesh' },
  { id: 'loc-barwani-mp', name: 'Barwani', district: 'Barwani', state: 'Madhya Pradesh', type: 'City', formatted: 'Barwani, Madhya Pradesh' },
  { id: 'loc-sagar-mp', name: 'Sagar', district: 'Sagar', state: 'Madhya Pradesh', type: 'City', formatted: 'Sagar, Madhya Pradesh' },
  { id: 'loc-satna-mp', name: 'Satna', district: 'Satna', state: 'Madhya Pradesh', type: 'City', formatted: 'Satna, Madhya Pradesh' },
  { id: 'loc-rewai-mp', name: 'Rewa', district: 'Rewa', state: 'Madhya Pradesh', type: 'City', formatted: 'Rewa, Madhya Pradesh' },

  // Rajasthan Places
  { id: 'loc-udaipur-rj', name: 'Udaipur', district: 'Udaipur', state: 'Rajasthan', type: 'City', formatted: 'Udaipur, Rajasthan' },
  { id: 'loc-jodhpur-rj', name: 'Jodhpur', district: 'Jodhpur', state: 'Rajasthan', type: 'City', formatted: 'Jodhpur, Rajasthan' },
  { id: 'loc-kota-rj', name: 'Kota', district: 'Kota', state: 'Rajasthan', type: 'City', formatted: 'Kota, Rajasthan' },
  { id: 'loc-ajmer-rj', name: 'Ajmer', district: 'Ajmer', state: 'Rajasthan', type: 'City', formatted: 'Ajmer, Rajasthan' },
  { id: 'loc-bhilwara-rj', name: 'Bhilwara', district: 'Bhilwara', state: 'Rajasthan', type: 'City', formatted: 'Bhilwara, Rajasthan' },

  // Gujarat Places
  { id: 'loc-vadodara-gj', name: 'Vadodara', district: 'Vadodara', state: 'Gujarat', type: 'City', formatted: 'Vadodara, Gujarat', aliases: ['Baroda'] },
  { id: 'loc-rajkot-gj', name: 'Rajkot', district: 'Rajkot', state: 'Gujarat', type: 'City', formatted: 'Rajkot, Gujarat' },
  { id: 'loc-bhavnagar-gj', name: 'Bhavnagar', district: 'Bhavnagar', state: 'Gujarat', type: 'City', formatted: 'Bhavnagar, Gujarat' },
  { id: 'loc-jamnagar-gj', name: 'Jamnagar', district: 'Jamnagar', state: 'Gujarat', type: 'City', formatted: 'Jamnagar, Gujarat' },

  // Maharashtra Places
  { id: 'loc-nagpur-mh', name: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', type: 'City', formatted: 'Nagpur, Maharashtra' },
  { id: 'loc-nashik-mh', name: 'Nashik', district: 'Nashik', state: 'Maharashtra', type: 'City', formatted: 'Nashik, Maharashtra' },
  { id: 'loc-aurangabad-mh', name: 'Chhatrapati Sambhajinagar', district: 'Aurangabad', state: 'Maharashtra', type: 'City', formatted: 'Chhatrapati Sambhajinagar, Maharashtra', aliases: ['Aurangabad'] },
  { id: 'loc-solapur-mh', name: 'Solapur', district: 'Solapur', state: 'Maharashtra', type: 'City', formatted: 'Solapur, Maharashtra' },
  { id: 'loc-kolhapur-mh', name: 'Kolhapur', district: 'Kolhapur', state: 'Maharashtra', type: 'City', formatted: 'Kolhapur, Maharashtra' },

  // Uttar Pradesh Places
  { id: 'loc-lucknow-up', name: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', type: 'City', formatted: 'Lucknow, Uttar Pradesh' },
  { id: 'loc-kanpur-up', name: 'Kanpur', district: 'Kanpur', state: 'Uttar Pradesh', type: 'City', formatted: 'Kanpur, Uttar Pradesh' },
  { id: 'loc-varanasi-up', name: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', type: 'City', formatted: 'Varanasi, Uttar Pradesh', aliases: ['Banaras', 'Kashi'] },
  { id: 'loc-agra-up', name: 'Agra', district: 'Agra', state: 'Uttar Pradesh', type: 'City', formatted: 'Agra, Uttar Pradesh' },
  { id: 'loc-lalitpur-up', name: 'Lalitpur', district: 'Lalitpur', state: 'Uttar Pradesh', type: 'Town', formatted: 'Lalitpur, Uttar Pradesh' },
  { id: 'loc-noida-up', name: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', type: 'City', formatted: 'Noida, Uttar Pradesh' },

  // Other States
  { id: 'loc-raipur-cg', name: 'Raipur', district: 'Raipur', state: 'Chhattisgarh', type: 'City', formatted: 'Raipur, Chhattisgarh' },
  { id: 'loc-ranchi-jh', name: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', type: 'City', formatted: 'Ranchi, Jharkhand' },
  { id: 'loc-patna-br', name: 'Patna', district: 'Patna', state: 'Bihar', type: 'City', formatted: 'Patna, Bihar' },
  { id: 'loc-guwahati-as', name: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam', type: 'City', formatted: 'Guwahati, Assam' },
  { id: 'loc-chandigarh-ch', name: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh', type: 'City', formatted: 'Chandigarh' },
];

/**
 * Async location search service built to support dynamic typeahead lookups.
 * Designed to easily connect to a backend location API or database.
 */
export async function searchLocationSuggestions(
  query: string
): Promise<LocationSearchResult> {
  // Simulate fast network lookup (30ms) for async API interface compatibility
  await new Promise((resolve) => setTimeout(resolve, 30));

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return { suggestions: [] };
  }

  // Exact & Prefix matches across Name, District, State, Formatted text, and Aliases
  const matches: LocationSuggestion[] = [];

  for (const place of INDIA_PLACES_DATASET) {
    const matchName = place.name.toLowerCase().includes(trimmed);
    const matchDistrict = place.district ? place.district.toLowerCase().includes(trimmed) : false;
    const matchState = place.state.toLowerCase().includes(trimmed);
    const matchFormatted = place.formatted.toLowerCase().includes(trimmed);
    const matchAlias = place.aliases
      ? place.aliases.some((a) => a.toLowerCase().includes(trimmed))
      : false;

    if (matchName || matchDistrict || matchState || matchFormatted || matchAlias) {
      matches.push(place);
    }
  }

  // Sort matches by relevance (exact prefix > alias > state match)
  matches.sort((a, b) => {
    const aStartsWith = a.name.toLowerCase().startsWith(trimmed);
    const bStartsWith = b.name.toLowerCase().startsWith(trimmed);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.name.localeCompare(b.name);
  });

  if (matches.length > 0) {
    return { suggestions: matches.slice(0, 10) };
  }

  // Fallback "Did you mean..." fuzzy search
  const didYouMean = INDIA_PLACES_DATASET.filter((p) => {
    const firstChar = trimmed[0];
    return p.name.toLowerCase().startsWith(firstChar);
  }).slice(0, 3);

  return {
    suggestions: [],
    didYouMean: didYouMean.length > 0 ? didYouMean : [INDIA_PLACES_DATASET[0]], // Dhar fallback
  };
}
