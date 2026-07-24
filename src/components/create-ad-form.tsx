'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAdvertisement } from '@/actions/advertisement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Category } from '@/types/database';

interface CreateAdFormProps {
  categories: Category[];
}

export function CreateAdForm({ categories }: CreateAdFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await createAdvertisement({
      title: form.get('title') as string,
      description: form.get('description') as string,
      category: form.get('category') as string,
      target_city: form.get('target_city') as string,
    });

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('Advertisement created! Waiting for admin approval.');
      router.push('/dashboard/advertisements');
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Advertisement</CardTitle>
        <CardDescription>
          Promote your business to reach more customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Payment placeholder */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            💳 Payment integration coming in Phase 2. Advertisements are currently free.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" required placeholder="Advertisement title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} placeholder="Describe your advertisement..." />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                name="category"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_city">Target City *</Label>
              <Input id="target_city" name="target_city" required placeholder="e.g. Mumbai" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Advertisement'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
