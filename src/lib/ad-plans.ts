export interface AdPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  durationLabel: string;
  description: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export const AD_PLANS: AdPlan[] = [
  {
    id: 'basic',
    name: 'Basic Campaign',
    price: 999,
    durationDays: 30,
    durationLabel: '30 Days (1 Month)',
    description: 'Great for getting started and reaching local customers on the homepage.',
    features: [
      'Homepage Banner & Business Card Placement',
      '30 Days Active Campaign',
      'Targeted Location & Category',
      'Basic Impression & Click Tracking',
      'Standard Ad Rotation',
    ],
  },
  {
    id: 'featured',
    name: 'Featured Campaign',
    price: 1999,
    durationDays: 90,
    durationLabel: '90 Days (3 Months)',
    description: 'Most popular plan for growing businesses seeking high visibility.',
    popular: true,
    badge: 'Best Value',
    features: [
      '⭐ Featured Sponsored Badge',
      '90 Days Active Campaign',
      'Priority Homepage Card Placement',
      'Higher Fair Rotation Frequency',
      'Detailed Performance Analytics',
      'Custom Action Button CTA',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Spotlight',
    price: 4999,
    durationDays: 180,
    durationLabel: '180 Days (6 Months)',
    description: 'Maximum exposure for established brands and top-tier campaigns.',
    badge: 'Maximum Reach',
    features: [
      '🔥 Top Spotlight Placement',
      '180 Days Active Campaign',
      'Maximum Rotation Priority',
      'Custom Banner & Logo Styling',
      'Full Analytics & Click Through Rate',
      'Priority Admin Approval & Support',
    ],
  },
];

export const BANK_DETAILS = {
  accountName: 'ARHAM AJIT FOUNDATION',
  bank: 'HDFC BANK',
  branch: 'MAHUVA Branch',
  ifsc: 'HDFC0000957',
  accountNumber: '50200109569616',
  upiId: '9819132283@hdfc',
  contactPhone: '98191 32283',
  qrImageUrl: '/payment-qr.png',
  notes: {
    noCash: '❌ No Cash Deposit',
    allowedMethods: '✅ Only Cheque / NEFT / RTGS / UPI',
    requestNote:
      'जो भाग्यशाली पैसे ट्रान्सफर / UPI या तो चेक डिपोजिट करते हे, उनको विनंती है की जो अकाउंट से पैसे ट्रान्सफर करते है उस एकाउंट होल्डर का पूरा नाम, पता और PAN ये सारी डिटेल 98191 32283 पे भेजे। 🙏',
  },
};
