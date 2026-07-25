'use client';

import { Sparkles, MapPin, Tag, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AdData {
  title: string;
  description: string;
  imageUrl?: string;
  ctaText?: string;
  targetCity?: string;
  category?: string;
  businessName?: string;
}

export interface AdTemplateDef {
  id: string;
  name: string;
  description: string;
  previewBg: string;
}

export const AD_TEMPLATES: AdTemplateDef[] = [
  {
    id: 'template-1',
    name: 'Minimal Classic',
    description: 'Clean white background with elegant blue accent and crisp typography.',
    previewBg: 'bg-white border-amber-200',
  },
  {
    id: 'template-2',
    name: 'Bold Ocean Showcase',
    description: 'Deep navy blue gradient with high-contrast text and glowing button.',
    previewBg: 'bg-gradient-to-br from-slate-900 to-slate-950 text-white',
  },
  {
    id: 'template-3',
    name: 'Gradient Spotlight',
    description: 'Modern purple-indigo gradient card with glowing sponsored badge.',
    previewBg: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white',
  },
  {
    id: 'template-4',
    name: 'Royal Gold Heritage',
    description: 'Warm cream background with golden border and royal heritage badge.',
    previewBg: 'bg-amber-50 border-amber-300 text-amber-950',
  },
  {
    id: 'template-5',
    name: 'Elegance Slate Luxe',
    description: 'Sleek dark slate theme with gold accent borders.',
    previewBg: 'bg-slate-900 border-amber-400 text-slate-100',
  },
  {
    id: 'template-6',
    name: 'Vibrant Warm Amber',
    description: 'Energetic warm orange gradient with strong action callout.',
    previewBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
  },
  {
    id: 'template-7',
    name: 'Modern Emerald',
    description: 'Fresh emerald green gradient with clean professional styling.',
    previewBg: 'bg-gradient-to-br from-emerald-700 to-teal-900 text-white',
  },
  {
    id: 'template-8',
    name: 'Corporate Navy Premium',
    description: 'Solid navy blue background with crisp white typography.',
    previewBg: 'bg-slate-950 text-white border-slate-800',
  },
];

interface RenderAdTemplateProps {
  templateId: string;
  adData: AdData;
  className?: string;
  onClickCta?: () => void;
}

export function RenderAdTemplate({
  templateId,
  adData,
  className = '',
  onClickCta,
}: RenderAdTemplateProps) {
  const {
    title = 'Your Campaign Title',
    description = 'Your advertisement description details appear right here.',
    imageUrl,
    ctaText = 'Visit Business',
    targetCity,
    category,
    businessName = 'Your Business',
  } = adData;

  const fallbackLogo = `https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80`;
  const logoSrc = imageUrl && imageUrl.trim() ? imageUrl : fallbackLogo;

  switch (templateId) {
    // ----------------------------------------------------
    // Template 1: Minimal Classic
    // ----------------------------------------------------
    case 'template-1':
      return (
        <div className={`relative overflow-hidden rounded-2xl border border-amber-200 bg-white p-5 shadow-lg transition-all ${className}`}>
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              <Sparkles className="h-3 w-3" /> Sponsored
            </span>
            {targetCity && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 text-amber-600" /> {targetCity}
              </span>
            )}
          </div>
          <div className="mt-4 flex gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
              <img src={logoSrc} alt={title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-amber-600">{businessName}</p>
              <h3 className="text-base font-bold text-gray-900 truncate">{title}</h3>
              <p className="mt-1 text-xs text-gray-600 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
            {category && (
              <span className="text-[11px] font-medium text-gray-400">🏷️ {category}</span>
            )}
            <Button size="sm" onClick={onClickCta} className="ml-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold font-semibold">
              {ctaText} <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // Template 2: Bold Ocean Showcase
    // ----------------------------------------------------
    case 'template-2':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 p-6 text-white shadow-xl ${className}`}>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-md px-3 py-0.5 text-xs font-semibold text-slate-300 border border-white/20">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" /> Featured Listing
            </span>
            {targetCity && <span className="text-xs text-slate-300">📍 {targetCity}</span>}
          </div>
          <div className="mt-4 flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-blue-400/40 bg-black/20 shadow-md">
              <img src={logoSrc} alt={title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">{businessName}</span>
              <h3 className="text-lg font-extrabold text-white leading-snug">{title}</h3>
              <p className="mt-1 text-xs text-slate-200 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-xs text-slate-400">{category}</span>
            <Button size="sm" onClick={onClickCta} className="bg-white text-slate-950 hover:bg-amber-50 font-bold">
              {ctaText}
            </Button>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // Template 3: Gradient Spotlight
    // ----------------------------------------------------
    case 'template-3':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white shadow-2xl ${className}`}>
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              ✨ Premium Spotlight
            </span>
            {targetCity && <span className="text-xs font-medium text-pink-100">📍 {targetCity}</span>}
          </div>
          <div className="mt-4 flex gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white/40 bg-white/10">
              <img src={logoSrc} alt={title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black leading-tight text-white">{title}</h3>
              <p className="mt-1 text-xs text-purple-100 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-xs text-pink-200 font-medium">{businessName}</span>
            <Button size="sm" onClick={onClickCta} className="bg-amber-300 text-indigo-950 hover:bg-amber-400 font-bold shadow-md">
              {ctaText}
            </Button>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // Template 4: Royal Gold Heritage
    // ----------------------------------------------------
    case 'template-4':
      return (
        <div className={`relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-5 text-amber-950 shadow-md ${className}`}>
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 uppercase tracking-widest">
              👑 Royal Partner
            </span>
            {targetCity && <span className="text-xs font-semibold text-amber-700">📍 {targetCity}</span>}
          </div>
          <div className="mt-3 flex gap-4 items-center">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-amber-400 bg-white p-0.5 shadow">
              <img src={logoSrc} alt={title} className="h-full w-full rounded-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700">{businessName}</p>
              <h3 className="text-base font-bold text-amber-900">{title}</h3>
              <p className="mt-1 text-xs text-amber-800 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-amber-200">
            <span className="text-xs font-medium text-amber-700">{category}</span>
            <Button size="sm" onClick={onClickCta} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
              {ctaText}
            </Button>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // Template 5: Elegance Slate Luxe
    // ----------------------------------------------------
    case 'template-5':
      return (
        <div className={`relative overflow-hidden rounded-2xl border border-amber-400/50 bg-slate-950 p-6 text-slate-100 shadow-2xl ${className}`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-400/30">
              💎 Exclusive Partner
            </span>
            {targetCity && <span className="text-xs text-slate-400">📍 {targetCity}</span>}
          </div>
          <div className="mt-4 flex gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-amber-400/40 bg-slate-900">
              <img src={logoSrc} alt={title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">{businessName}</span>
              <h3 className="text-lg font-extrabold text-amber-300 leading-tight">{title}</h3>
              <p className="mt-1 text-xs text-slate-300 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">{category}</span>
            <Button size="sm" onClick={onClickCta} className="bg-amber-400 text-slate-950 hover:bg-amber-300 font-extrabold">
              {ctaText}
            </Button>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // Template 6: Vibrant Warm Amber
    // ----------------------------------------------------
    case 'template-6':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-xl ${className}`}>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 text-xs font-bold">
              🔥 Hot Offer
            </span>
            {targetCity && <span className="text-xs font-medium text-amber-100">📍 {targetCity}</span>}
          </div>
          <div className="mt-4 flex gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-white/40 bg-white/10">
              <img src={logoSrc} alt={title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-white">{title}</h3>
              <p className="mt-1 text-xs text-amber-50 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-xs text-amber-100 font-medium">{businessName}</span>
            <Button size="sm" onClick={onClickCta} className="bg-white text-orange-600 hover:bg-amber-50 font-extrabold">
              {ctaText}
            </Button>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // Template 7: Modern Emerald
    // ----------------------------------------------------
    case 'template-7':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 p-6 text-white shadow-xl ${className}`}>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              🌿 Verified Business
            </span>
            {targetCity && <span className="text-xs text-emerald-200">📍 {targetCity}</span>}
          </div>
          <div className="mt-4 flex gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-emerald-400/40 bg-emerald-950">
              <img src={logoSrc} alt={title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-emerald-300">{businessName}</span>
              <h3 className="text-lg font-bold text-white leading-snug">{title}</h3>
              <p className="mt-1 text-xs text-emerald-100 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-xs text-emerald-300">{category}</span>
            <Button size="sm" onClick={onClickCta} className="bg-emerald-400 text-emerald-950 hover:bg-emerald-300 font-bold">
              {ctaText}
            </Button>
          </div>
        </div>
      );

    // ----------------------------------------------------
    // Template 8: Corporate Navy Premium (Default fallback)
    // ----------------------------------------------------
    default:
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-6 text-white shadow-xl ${className}`}>
          <div className="flex items-center justify-between border-b border-blue-900 pb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-800/50 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
              ⭐ Featured Advertiser
            </span>
            {targetCity && <span className="text-xs text-slate-400">📍 {targetCity}</span>}
          </div>
          <div className="mt-4 flex gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-blue-700 bg-slate-900">
              <img src={logoSrc} alt={title} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-slate-400">{businessName}</p>
              <h3 className="text-lg font-extrabold text-white leading-tight">{title}</h3>
              <p className="mt-1 text-xs text-slate-200 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between pt-3 border-t border-blue-900">
            <span className="text-xs text-slate-400">{category}</span>
            <Button size="sm" onClick={onClickCta} className="bg-amber-500 hover:bg-amber-500 text-slate-950 font-semibold font-bold">
              {ctaText}
            </Button>
          </div>
        </div>
      );
  }
}
