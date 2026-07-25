'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBusiness } from '@/actions/business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { INDIAN_STATES } from '@/lib/constants';
import { BANK_DETAILS } from '@/lib/ad-plans';
import type { Category } from '@/types/database';

interface BusinessFormProps {
  categories: Category[];
}

export function BusinessRegisterForm({ categories }: BusinessFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await createBusiness(form);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('Business registered! Waiting for admin approval.');
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Your Business</CardTitle>
        <CardDescription>
          Fill in the details below. Fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name *</Label>
              <Input id="business_name" name="business_name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner_name">Owner Name *</Label>
              <Input id="owner_name" name="owner_name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <select
                id="category_id"
                name="category_id"
                required
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
              <Input id="phone" name="phone" type="tel" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" placeholder="https://" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <select
                id="state"
                name="state"
                required
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
            <Input id="address" name="address" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Tell people about your business..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gst_number">GST Number (optional)</Label>
            <Input id="gst_number" name="gst_number" />
          </div>

          <hr className="my-8" />

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Payment</h3>
            <p className="text-sm text-gray-600 mb-6">
              To complete your business registration, a one-time fee of <strong className="text-gray-900 font-bold">₹499 INR</strong> is required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Payment Instructions / QR */}
              <div className="w-full sm:w-1/2 flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-gray-200 text-center shadow-sm">
                <div className="w-48 h-48 mb-4 overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white p-2">
                  <img src={BANK_DETAILS.qrImageUrl} alt="Payment QR Code" className="h-full w-full object-contain" />
                </div>
                <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  UPI ID: {BANK_DETAILS.upiId}
                </p>
              </div>

              {/* Upload Proof */}
              <div className="w-full sm:w-1/2 space-y-4 pt-4 sm:pt-0">
                <div className="space-y-2">
                  <Label htmlFor="payment_proof" className="text-base font-semibold">Upload Payment Screenshot *</Label>
                  <p className="text-sm text-gray-500 mb-2">After making the payment, please upload the screenshot or receipt here.</p>
                  <Input 
                    id="payment_proof" 
                    name="payment_proof" 
                    type="file" 
                    accept="image/*"
                    required
                    className="cursor-pointer file:cursor-pointer file:bg-amber-100 file:text-amber-900 file:border-0 file:rounded file:px-3 file:py-1 file:mr-4 file:hover:bg-amber-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-500 text-slate-950 font-semibold hover:bg-amber-600 sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Business'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
