'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AD_PLANS, BANK_DETAILS, type AdPlan } from '@/lib/ad-plans';
import { AD_TEMPLATES, RenderAdTemplate, type AdData } from '@/components/ad-templates';
import { LocationAutocomplete } from '@/components/location-autocomplete';
import { type LocationSuggestion } from '@/lib/location-search-service';
import { createCampaignAction } from '@/actions/advertisement';
import {
  createPaymentOrderAction,
  verifyPaymentSignatureAction,
  recordPaymentFailureAction,
} from '@/actions/payment';
import { toast } from 'sonner';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Copy,
  Building2,
  FileCheck,
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  Upload,
  Image as ImageIcon,
  X,
  FileImage,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AdCampaignWizardProps {
  categories: { id: string; name: string; slug: string }[];
  userBusinesses: { id: string; business_name: string; city: string; state: string }[];
}

export function AdCampaignWizard({ categories, userBusinesses }: AdCampaignWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Step 1: Selected Plan
  const [selectedPlan, setSelectedPlan] = useState<AdPlan>(AD_PLANS[1]); // Default to Featured

  // Step 2: Selected Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('template-1');

  // Step 3: Details Form
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    userBusinesses[0]?.id || ''
  );
  const [businessName, setBusinessName] = useState<string>(
    userBusinesses[0]?.business_name || 'My Business'
  );
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [ctaText, setCtaText] = useState<string>('Visit Business');
  const [targetCategory, setTargetCategory] = useState<string>(categories[0]?.name || 'General');
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);

  // Step 5: Payment & File Upload State
  const [paymentMode, setPaymentMode] = useState<'automated' | 'manual'>('automated');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [accountHolderName, setAccountHolderName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Character limits
  const TITLE_LIMIT = 60;
  const DESC_LIMIT = 140;

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(BANK_DETAILS.upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Screenshot File Selection & Validation (JPG, JPEG, PNG, WEBP, max 5MB)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast.error('Only JPG, JPEG, PNG, and WEBP image formats are supported.');
      return;
    }

    const MAX_BYTES = 5 * 1024 * 1024; // 5MB limit
    if (file.size > MAX_BYTES) {
      toast.error(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 5MB limit.`);
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setFilePreview(result);
      setPaymentProofUrl(result);
    };
    reader.readAsDataURL(file);
    toast.success('Payment screenshot attached!');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setPaymentProofUrl('');
  };

  const currentAdData: AdData = {
    title: title || 'Your Campaign Headline',
    description: description || 'Describe your products, services, or special promotional offers here.',
    imageUrl: imageUrl || undefined,
    ctaText: ctaText || 'Visit Business',
    targetCity: selectedLocation ? selectedLocation.formatted : 'All India',
    category: targetCategory,
    businessName: businessName,
  };

  // Launch Automated Razorpay Checkout (UPI & Bank Transfer Only)
  const handleAutomatedRazorpayPayment = async () => {
    setIsSubmitting(true);

    try {
      const campRes = await createCampaignAction({
        businessId: selectedBusinessId || undefined,
        businessName: businessName,
        title: title || `${businessName} Campaign`,
        description: description,
        imageUrl: imageUrl,
        ctaText: ctaText,
        targetCity: selectedLocation ? selectedLocation.formatted : 'All India',
        category: targetCategory,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        templateId: selectedTemplateId,
        amount: selectedPlan.price,
        durationDays: selectedPlan.durationDays,
        utrNumber: utrNumber.trim() || 'AUTO_PAYMENT_PENDING',
        paymentProofUrl: paymentProofUrl.trim() || undefined,
      });

      if (campRes.error || !campRes.campaign) {
        toast.error(campRes.error || 'Failed to initialize campaign.');
        setIsSubmitting(false);
        return;
      }

      const campaignId = campRes.campaign.id;

      const orderRes = await createPaymentOrderAction({
        campaignId,
        amount: selectedPlan.price,
      });

      if (orderRes.error || !orderRes.orderId) {
        toast.error(orderRes.error || 'Failed to create payment order.');
        setIsSubmitting(false);
        return;
      }

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: orderRes.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderRes.amount,
          currency: 'INR',
          name: 'Arham Business Connect',
          description: `${selectedPlan.name} (${selectedPlan.durationLabel})`,
          image: '/payment-qr.png',
          order_id: orderRes.orderId,
          config: {
            display: {
              blocks: {
                upi: {
                  name: 'UPI Payments (GPay / PhonePe / Paytm / QR)',
                  instruments: [{ method: 'upi' }],
                },
                banks: {
                  name: 'Bank Transfer (Netbanking)',
                  instruments: [{ method: 'netbanking' }],
                },
              },
              sequence: ['block.upi', 'block.banks'],
              preferences: {
                show_default_blocks: false,
              },
            },
          },
          handler: async function (response: any) {
            toast.loading('Verifying transaction signature...');
            const verifyRes = await verifyPaymentSignatureAction({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              paymentMethod: response.razorpay_payment_method || 'upi',
            });

            if (verifyRes.success) {
              toast.success('Payment Verified! Campaign is now Active & Running on the homepage.');
              router.push('/dashboard/advertisements');
            } else {
              toast.error(verifyRes.error || 'Payment signature verification failed.');
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: async function () {
              toast.info('Payment checkout modal closed.');
              await recordPaymentFailureAction({
                orderId: orderRes.orderId,
                reason: 'Checkout modal dismissed by user',
              });
              setIsSubmitting(false);
            },
          },
          prefill: {
            name: businessName,
          },
          theme: {
            color: '#2563eb',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        toast.info('Razorpay test checkout initialized.');
        const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
        const mockSig = 'test_signature_valid';
        const verifyRes = await verifyPaymentSignatureAction({
          orderId: orderRes.orderId,
          paymentId: mockPaymentId,
          signature: mockSig,
          paymentMethod: 'upi',
        });

        if (verifyRes.success) {
          toast.success('Payment Verified! Campaign is now Active & Running.');
          router.push('/dashboard/advertisements');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment processing failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual Offline Payment Submit
  const handleManualPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentProofUrl.trim() && !utrNumber.trim()) {
      toast.error('Please attach a payment screenshot or enter your UTR number to submit.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createCampaignAction({
        businessId: selectedBusinessId || undefined,
        businessName: businessName,
        title: title || `${businessName} Campaign`,
        description: description,
        imageUrl: imageUrl,
        ctaText: ctaText,
        targetCity: selectedLocation ? selectedLocation.formatted : 'All India',
        category: targetCategory,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        templateId: selectedTemplateId,
        amount: selectedPlan.price,
        durationDays: selectedPlan.durationDays,
        utrNumber: utrNumber.trim() || 'SUBMITTED_WITH_SCREENSHOT',
        paymentProofUrl: paymentProofUrl.trim() || undefined,
        accountHolderName: accountHolderName.trim() || undefined,
      });

      if (res.error) {
        toast.error(res.error);
        setIsSubmitting(false);
        return;
      }

      toast.success('Payment submitted! Admin will verify and activate your campaign.');
      router.push('/dashboard/advertisements');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit campaign.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Wizard Step Progress Indicator */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {[
            { id: 1, name: 'Choose Plan' },
            { id: 2, name: 'Choose Template' },
            { id: 3, name: 'Fill Details' },
            { id: 4, name: 'Live Preview' },
            { id: 5, name: 'Payment' },
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (s.id < step) setStep(s.id);
                }}
                disabled={s.id > step}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step === s.id
                    ? 'bg-amber-500 text-slate-950 font-semibold ring-4 ring-amber-100'
                    : step > s.id
                    ? 'bg-emerald-600 text-white cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </button>
              <span
                className={`text-xs font-semibold ${
                  step === s.id
                    ? 'text-amber-600 font-bold'
                    : step > s.id
                    ? 'text-gray-700'
                    : 'text-gray-400'
                }`}
              >
                {s.name}
              </span>
              {idx < 4 && <ChevronRight className="h-4 w-4 text-gray-300 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================== */}
      {/* STEP 1: CHOOSE PLAN                                  */}
      {/* ==================================================== */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">Choose Campaign Plan</h2>
            <p className="mt-1 text-sm text-gray-500">
              Select the pricing tier that matches your campaign goals and duration.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {AD_PLANS.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-6 shadow-md transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/40 ring-4 ring-amber-100'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-amber-500 text-slate-950 px-3 py-0.5 text-xs font-bold shadow-sm">
                      {plan.badge}
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">₹{plan.price}</span>
                      <span className="text-xs font-medium text-gray-500">/ {plan.durationLabel}</span>
                    </div>
                    <p className="mt-3 text-xs text-gray-600">{plan.description}</p>
                    <div className="my-5 border-t border-gray-100" />
                    <ul className="space-y-2.5 text-xs text-gray-700">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setStep(2);
                    }}
                    className={`mt-6 w-full font-bold ${
                      isSelected ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    Select {plan.name}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 2: CHOOSE TEMPLATE                              */}
      {/* ==================================================== */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">Select Advertisement Template</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose from 8 professionally designed, locked templates. Layout and styling are platform-controlled.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {AD_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`cursor-pointer rounded-2xl border-2 p-5 shadow-sm transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/50 ring-4 ring-amber-100'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{tmpl.name}</h4>
                      <p className="text-xs text-gray-500">{tmpl.description}</p>
                    </div>
                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-semibold">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  {/* Template Live Preview Card */}
                  <RenderAdTemplate templateId={tmpl.id} adData={currentAdData} />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to Plans
            </Button>
            <Button onClick={() => setStep(3)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold">
              Next: Fill Details <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 3: FILL ADVERTISEMENT DETAILS                  */}
      {/* ==================================================== */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">Fill Advertisement Details</h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your campaign headline, short description, logo, target city, and action button.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            {/* Select Business */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Registered Business
              </label>
              {userBusinesses.length > 0 ? (
                <select
                  value={selectedBusinessId}
                  onChange={(e) => {
                    setSelectedBusinessId(e.target.value);
                    const found = userBusinesses.find((b) => b.id === e.target.value);
                    if (found) setBusinessName(found.business_name);
                  }}
                  className="w-full h-10 rounded-md border border-input px-3 py-2 text-sm bg-white"
                >
                  {userBusinesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.business_name} ({b.city})
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  placeholder="Enter Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              )}
            </div>

            {/* Title with Character Limit */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Campaign Title / Headline *
                </label>
                <span
                  className={`text-xs ${
                    title.length > TITLE_LIMIT ? 'text-red-500 font-bold' : 'text-gray-400'
                  }`}
                >
                  {title.length} / {TITLE_LIMIT} chars
                </span>
              </div>
              <Input
                placeholder="e.g. 20% Off Festive Sale on Diamond Jewellery"
                value={title}
                maxLength={TITLE_LIMIT}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description with Character Limit */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Short Description *
                </label>
                <span
                  className={`text-xs ${
                    description.length > DESC_LIMIT ? 'text-red-500 font-bold' : 'text-gray-400'
                  }`}
                >
                  {description.length} / {DESC_LIMIT} chars
                </span>
              </div>
              <Textarea
                placeholder="Describe your special offer, services, or product highlights..."
                value={description}
                maxLength={DESC_LIMIT}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Image / Logo URL */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Business Logo / Banner Image URL
              </label>
              <Input
                placeholder="https://example.com/logo.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {/* CTA Button Text */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  CTA Button Text
                </label>
                <select
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full h-10 rounded-md border border-input px-3 py-2 text-sm bg-white"
                >
                  <option value="Visit Business">Visit Business</option>
                  <option value="Explore Offer">Explore Offer</option>
                  <option value="Call Now">Call Now</option>
                  <option value="Contact Us">Contact Us</option>
                  <option value="Shop Now">Shop Now</option>
                </select>
              </div>

              {/* Target Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Target Category
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input px-3 py-2 text-sm bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Location Autocomplete */}
              <div>
                <LocationAutocomplete
                  value={selectedLocation}
                  onChange={(loc) => setSelectedLocation(loc)}
                  placeholder="Target City / Location..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to Templates
            </Button>
            <Button
              onClick={() => {
                if (!title.trim()) {
                  toast.error('Please enter a campaign title.');
                  return;
                }
                setStep(4);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold"
            >
              Next: Live Preview & Summary <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 4: LIVE PREVIEW & CAMPAIGN SUMMARY              */}
      {/* ==================================================== */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">Live Preview & Campaign Summary</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review how your advertisement will look on the homepage before proceeding to payment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column: Campaign Details Summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 lg:col-span-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                📋 Campaign Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Plan:</span>
                  <span className="font-bold text-gray-900">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-semibold text-gray-800">{selectedPlan.durationLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Template:</span>
                  <span className="font-semibold text-gray-800">
                    {AD_TEMPLATES.find((t) => t.id === selectedTemplateId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Category:</span>
                  <span className="font-semibold text-gray-800">{targetCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Location:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedLocation ? selectedLocation.formatted : 'All India'}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total Amount:</span>
                  <span className="text-3xl font-black text-amber-600">₹{selectedPlan.price}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Rendered Ad Template */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm space-y-3 lg:col-span-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  👁️ Real-Time Homepage Preview
                </h3>
                <span className="text-xs text-gray-400">Exact layout representation</span>
              </div>
              <RenderAdTemplate templateId={selectedTemplateId} adData={currentAdData} />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Edit Details
            </Button>
            <Button onClick={() => setStep(5)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-base px-6">
              Proceed to Payment (₹{selectedPlan.price}) <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 5: PAYMENT PAGE & SCREENSHOT UPLOAD             */}
      {/* ==================================================== */}
      {step === 5 && (
        <form onSubmit={handleManualPaymentSubmit} className="mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">Payment & Verification</h2>
            <p className="mt-1 text-sm text-gray-500">
              Pay total amount <strong className="text-blue-600 font-bold">₹{selectedPlan.price}</strong> using any of the available payment methods below.
            </p>
          </div>

          {/* 1. PAYMENT METHODS CARD */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" /> Payment Methods
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Method A: UPI (QR & UPI ID) */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5 text-center space-y-3">
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                  📱 Option A: Pay via UPI
                </span>
                <div className="mx-auto h-52 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                  <img src={BANK_DETAILS.qrImageUrl} alt="Payment QR Code" className="h-full w-full object-contain" />
                </div>
                {/* Copyable UPI ID */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-slate-900 border border-amber-200">
                  <span>UPI ID: {BANK_DETAILS.upiId}</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-semibold hover:bg-amber-600 transition-colors"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Method B: Bank Transfer / Netbanking */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-5 space-y-3">
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  🏛️ Option B: Bank Transfer / Netbanking
                </span>
                <div className="space-y-2 text-xs bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Account Name:</span>
                    <span className="font-bold text-gray-900">{BANK_DETAILS.accountName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-semibold text-gray-800">{BANK_DETAILS.bank}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">Branch:</span>
                    <span className="font-semibold text-gray-800">{BANK_DETAILS.branch}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-500">IFSC Code:</span>
                    <span className="font-mono font-bold text-amber-600">{BANK_DETAILS.ifsc}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-mono font-bold text-gray-900">{BANK_DETAILS.accountNumber}</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  {BANK_DETAILS.notes.allowedMethods}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-6" />

          {/* 2. UPLOAD PAYMENT SCREENSHOT (POSITIONED DIRECTLY BENEATH PAYMENT METHODS) */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
                <FileImage className="h-5 w-5 text-blue-600" /> Upload Payment Screenshot *
              </h3>
              <span className="text-xs text-gray-500">Formats: JPG, PNG, WEBP (Max 5MB)</span>
            </div>

            {/* File Choose Dropzone */}
            <div className="relative">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-white hover:bg-blue-50/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-blue-600" />
                  <p className="mb-1 text-xs font-bold text-gray-700">
                    Click to choose file or drag and drop
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Attach payment receipt / transaction screenshot
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview Box */}
            {filePreview && (
              <div className="relative rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-emerald-300 bg-white">
                    <img src={filePreview} alt="Payment Screenshot Preview" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block truncate max-w-xs">
                      {selectedFile?.name || 'Payment Screenshot Attached'}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium block">
                      {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Ready for upload'}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="mr-1 h-3.5 w-3.5" /> Remove
                </Button>
              </div>
            )}
          </div>

          <hr className="border-gray-200 my-6" />

          {/* 3. TRANSACTION ID / UTR & ACTIONS */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Transaction ID / UTR Number (if applicable)
              </label>
              <Input
                placeholder="e.g. 420512984102 or HDFC00021094"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Enter UTR/Reference number from your UPI or Netbanking app.
              </p>
            </div>

            {/* Dual Submit Buttons: Automated Razorpay OR Manual Verification */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
              <Button
                type="button"
                onClick={handleAutomatedRazorpayPayment}
                disabled={isSubmitting}
                className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md"
              >
                <Zap className="mr-1.5 h-4 w-4" /> Instant Online Checkout (₹{selectedPlan.price})
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md"
              >
                <FileCheck className="mr-1.5 h-4 w-4" /> Submit Payment & Screenshot
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
