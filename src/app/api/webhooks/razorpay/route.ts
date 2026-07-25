import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
    }

    // Verify webhook HMAC-SHA256 signature
    const isValid = verifyWebhookSignature({ rawBody, signature });
    if (!isValid) {
      console.error('Invalid Razorpay webhook signature');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle order.paid or payment.captured events
    if (event === 'order.paid' || event === 'payment.captured') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id || payload.payload?.order?.entity?.id;
      const paymentId = paymentEntity?.id;
      const paymentMethod = paymentEntity?.method || 'upi';

      if (orderId && paymentId) {
        const supabase = await createClient();

        // Check if already processed (Idempotency protection)
        const { data: existing } = await supabase
          .from('payments')
          .select('status, advertisement_id')
          .eq('order_id', orderId)
          .single();

        if (existing && existing.status !== 'paid') {
          // Update payments table
          await supabase
            .from('payments')
            .update({
              payment_id: paymentId,
              status: 'paid',
              payment_method: paymentMethod,
              signature_verified: true,
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId);

          // Update advertisement table to running
          if (existing.advertisement_id) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30);

            await supabase
              .from('advertisements')
              .update({
                status: 'running',
                payment_status: 'verified',
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                utr_number: paymentId,
              })
              .eq('id', existing.advertisement_id);
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Error in Razorpay Webhook:', err);
    return NextResponse.json({ error: err.message || 'Webhook handler error' }, { status: 500 });
  }
}
