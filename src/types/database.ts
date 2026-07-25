// ============================================
// Database Types for Supabase Tables
// ============================================

export type UserRole = 'user' | 'admin';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';
export type BusinessStatus = 'pending' | 'approved' | 'rejected';
export type AdStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registration_status: RegistrationStatus;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  category_id: string;
  slug: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  website: string | null;
  description: string | null;
  address: string;
  city: string;
  state: string;
  gst_number: string | null;
  status: BusinessStatus;
  payment_proof_url: string | null;
  created_at: string;
  updated_at: string;
}

// Business with joined category data
export interface BusinessWithCategory extends Business {
  categories: Pick<Category, 'id' | 'name' | 'slug'>;
}

export interface Advertisement {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  category: string;
  target_city: string;
  status: AdStatus;
  created_at: string;
}

// Advertisement with joined business data (for admin views)
export interface AdvertisementWithBusiness extends Advertisement {
  businesses: Pick<Business, 'id' | 'business_name' | 'slug'>;
}

// Form input types (for create/update operations)
export interface BusinessFormData {
  business_name: string;
  owner_name: string;
  category_id: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  gst_number?: string;
  payment_proof_url?: string;
}

export interface AdvertisementFormData {
  title: string;
  description?: string;
  category: string;
  target_city: string;
}

// Homepage stats
export interface HomeStats {
  totalBusinesses: number;
  totalCategories: number;
  totalCities: number;
}

// Admin dashboard stats
export interface AdminStats {
  totalUsers: number;
  totalBusinesses: number;
  pendingBusinesses: number;
  pendingAdvertisements: number;
}

// Search/filter params
export interface SearchParams {
  query?: string;
  category?: string;
  city?: string;
  page?: number;
}
