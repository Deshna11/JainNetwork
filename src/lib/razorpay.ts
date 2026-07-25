import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay SDK client (Server-Side Only)
export function getRazorpayInstance() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials missing in environment variables.');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Verify HMAC-SHA256 Payment Signature returned by Razorpay Checkout Popup
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
}

/**
 * Verify Webhook Cryptographic Signature
 */
export function verifyWebhookSignature({
  rawBody,
  signature,
}: {
  rawBody: string;
  signature: string;
}): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return false;

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
}
