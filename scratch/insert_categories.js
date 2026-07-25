const url = 'https://opueithvutkkqkphhlug.supabase.co/rest/v1/categories';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wdWVpdGh2dXRra3FrcGhobHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjU5MDAsImV4cCI6MjEwMDQwMTkwMH0.NWGTbGKe8Vwc29JKbYDsaxSoEelgPm2vypJ0DfqCCzs';

const categories = [
  "Financial Advisors",
  "Lawyers",
  "Chartered Accountants (CA)",
  "Doctors",
  "Architects",
  "Builders",
  "Jewellers",
  "Food Products",
  "Digital Marketers",
  "Exporters",
  "Cosmetics & Skincare",
  "Entrepreneurs",
  "Retailers",
  "Consultants",
  "Investors"
];

const toInsert = categories.map(c => ({
  name: c,
  slug: c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  is_active: true
}));

fetch(url, {
  method: 'POST',
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify(toInsert)
}).then(res => res.json()).then(console.log).catch(console.error);
