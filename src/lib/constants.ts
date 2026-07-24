// Indian states list
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
  'Chandigarh', 'Andaman & Nicobar Islands', 'Dadra & Nagar Haveli and Daman & Diu', 'Lakshadweep',
] as const;

// Status configuration for badges
export const STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'secondary' as const },
  approved: { label: 'Approved', variant: 'default' as const },
  rejected: { label: 'Rejected', variant: 'destructive' as const },
} as const;

// Pagination
export const ITEMS_PER_PAGE = 12;

// How it works steps
export const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Create Account',
    description: 'Sign up with your email and password to get started.',
  },
  {
    step: '2',
    title: 'Register Business',
    description: 'Fill in your business details and submit for approval.',
  },
  {
    step: '3',
    title: 'Get Approved',
    description: 'Our admin team reviews and approves your business listing.',
  },
  {
    step: '4',
    title: 'Get Discovered',
    description: 'Your business appears in search results for everyone to find.',
  },
] as const;
