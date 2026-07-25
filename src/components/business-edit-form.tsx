'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateBusiness } from '@/actions/business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { INDIAN_STATES } from '@/lib/constants';
import type { Category, BusinessWithCategory } from '@/types/database';

interface EditFormProps {
  business: BusinessWithCategory;
  categories: Category[];
}

export function BusinessEditForm({ business, categories }: EditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await updateBusiness({
      business_name: form.get('business_name') as string,
      owner_name: form.get('owner_name') as string,
      category_id: form.get('category_id') as string,
      phone: form.get('phone') as string,
      email: form.get('email') as string,
      website: form.get('website') as string,
      description: form.get('description') as string,
      address: form.get('address') as string,
      city: form.get('city') as string,
      state: form.get('state') as string,
      gst_number: form.get('gst_number') as string,
    });

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('Business updated successfully!');
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Business</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name *</Label>
              <Input id="business_name" name="business_name" defaultValue={business.business_name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner_name">Owner Name *</Label>
              <Input id="owner_name" name="owner_name" defaultValue={business.owner_name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <select
                id="category_id"
                name="category_id"
                required
                defaultValue={business.category_id}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={business.phone} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" defaultValue={business.email} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" defaultValue={business.website || ''} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" defaultValue={business.city} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <select
                id="state"
                name="state"
                required
                defaultValue={business.state}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input id="address" name="address" defaultValue={business.address} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={business.description || ''} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gst_number">GST Number (optional)</Label>
            <Input id="gst_number" name="gst_number" defaultValue={business.gst_number || ''} />
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-500 text-slate-950 font-semibold hover:bg-amber-600 sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Business'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
