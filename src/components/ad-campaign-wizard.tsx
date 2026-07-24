'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AD_PLANS, BANK_DETAILS, type AdPlan } from '@/lib/ad-plans';
import { AD_TEMPLATES, RenderAdTemplate, type AdData } from '@/components/ad-templates';
import { LocationAutocomplete } from '@/components/location-autocomplete';
import { type LocationSuggestion } from '@/lib/location-search-service';
import { createCampaignAction } from '@/actions/advertisement';
import { toast } from 'sonner';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Copy,
  Upload,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Building2,
  FileCheck,
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

  // Step 5: Payment Form
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [accountHolderName, setAccountHolderName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Character limits
  const TITLE_LIMIT = 60;
  const DESC_LIMIT = 140;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(BANK_DETAILS.upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
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

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!utrNumber.trim()) {
      toast.error('Please enter the Transaction ID / UTR Number of your payment.');
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
        utrNumber: utrNumber.trim(),
        paymentProofUrl: paymentProofUrl.trim() || undefined,
        accountHolderName: accountHolderName.trim() || undefined,
      });

      if (res.error) {
        toast.error(res.error);
        setIsSubmitting(false);
        return;
      }

      toast.success('Campaign submitted! Payment verification in progress.');
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
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
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
                    ? 'text-blue-600 font-bold'
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
                      ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-100'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
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
                      isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
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
                      ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-100'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{tmpl.name}</h4>
                      <p className="text-xs text-gray-500">{tmpl.description}</p>
                    </div>
                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
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
            <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
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
                  <span className="text-3xl font-black text-blue-600">₹{selectedPlan.price}</span>
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
            <Button onClick={() => setStep(5)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-6">
              Proceed to Payment (₹{selectedPlan.price}) <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* STEP 5: MANUAL PAYMENT & UPLOAD PROOF                */}
      {/* ==================================================== */}
      {step === 5 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-gray-900">Manual Payment Verification</h2>
            <p className="mt-1 text-sm text-gray-500">
              Transfer total amount <strong className="text-blue-600">₹{selectedPlan.price}</strong> via UPI or Bank Transfer and upload transaction proof.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Payment QR & Bank Details */}
            <div className="space-y-4 lg:col-span-6">
              {/* QR Code Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Scan QR Code to Pay via UPI
                </h4>
                <div className="mx-auto h-64 w-64 overflow-hidden rounded-xl border border-gray-200 shadow-md">
                  <img src={BANK_DETAILS.qrImageUrl} alt="Payment QR Code" className="h-full w-full object-contain" />
                </div>
                
                {/* Copyable UPI ID */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-900 border border-blue-200">
                  <span>UPI ID: {BANK_DETAILS.upiId}</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Exact Bank Details Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  <Building2 className="h-4 w-4 text-blue-600" /> Bank Transfer Details (NEFT / RTGS / IMPS)
                </h4>
                <div className="space-y-2 text-xs">
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
                    <span className="font-mono font-bold text-blue-600">{BANK_DETAILS.ifsc}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Current Account No:</span>
                    <span className="font-mono font-bold text-gray-900">{BANK_DETAILS.accountNumber}</span>
                  </div>
                </div>
              </div>

              {/* Warnings & Notes */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-2 text-xs text-amber-950">
                <div className="flex items-center justify-between font-bold">
                  <span>{BANK_DETAILS.notes.noCash}</span>
                  <span>{BANK_DETAILS.notes.allowedMethods}</span>
                </div>
                <div className="border-t border-amber-200/60 pt-2 text-[11px] font-medium leading-relaxed">
                  {BANK_DETAILS.notes.requestNote}
                </div>
              </div>
            </div>

            {/* Right: Payment Proof Upload Form */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 lg:col-span-6">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                <FileCheck className="h-5 w-5 text-emerald-600" /> Upload Payment Proof
              </h3>

              {/* Transaction ID / UTR Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Transaction ID / UTR Number *
                </label>
                <Input
                  placeholder="e.g. 420512984102 or HDFC00021094"
                  value={utrNumber}
                  required
                  onChange={(e) => setUtrNumber(e.target.value)}
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Unique UTR/Reference number from your UPI or Netbanking app.
                </p>
              </div>

              {/* Payment Proof Screenshot URL / File */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Payment Proof Screenshot URL
                </label>
                <Input
                  placeholder="https://example.com/payment-screenshot.png"
                  value={paymentProofUrl}
                  onChange={(e) => setPaymentProofUrl(e.target.value)}
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Paste image link or upload proof for fast admin verification.
                </p>
              </div>

              {/* Account Holder Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Account Holder Name / PAN (Optional)
                </label>
                <Input
                  placeholder="Full Name on Bank Account"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                />
              </div>

              {/* Summary Box */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-2 text-xs text-blue-950">
                <div className="flex justify-between font-semibold">
                  <span>Plan: {selectedPlan.name}</span>
                  <span className="text-blue-700 font-bold">₹{selectedPlan.price}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Status after payment:</span>
                  <span className="font-semibold text-amber-700">Payment Verification</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md"
              >
                {isSubmitting ? 'Submitting Campaign...' : 'I Have Paid — Submit for Verification'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
