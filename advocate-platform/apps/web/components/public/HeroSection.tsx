'use client';
import { useState } from 'react';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

const practiceHighlights = [
  {
    id: 'criminal',
    title: 'Criminal Defense',
    court: 'High Court & Sessions',
    tag: 'BNSS / Bail / FIR Quashing',
    svgPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    id: 'property',
    title: 'Property & Real Estate',
    court: 'Civil & RERA Benches',
    tag: 'Title & Demolition Stays',
    svgPath: 'M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4',
  },
  {
    id: 'family',
    title: 'Family & Matrimonial',
    court: 'Family Court & Mediation',
    tag: 'Divorce & Custody',
    svgPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  },
  {
    id: 'consumer',
    title: 'Consumer Protection',
    court: 'NCDRC & State Commission',
    tag: 'Builder Delay & Refunds',
    svgPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 'civil',
    title: 'Civil & Commercial',
    court: 'Commercial Division',
    tag: 'Order 37 & Injunctions',
    svgPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  },
];

export function HeroSection() {
  const [activeHighlight, setActiveHighlight] = useState(0);

  return (
    <section className="relative flex flex-col justify-center items-center overflow-hidden pt-28 pb-10 border-b border-neutral-200 bg-transparent text-center w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col items-center">
        {/* Supreme Court & High Court Counsel Verified Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full mb-5 text-[0.72rem] font-semibold tracking-wide text-neutral-800 bg-white/90 border border-neutral-300 shadow-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
          <span>Supreme Court & High Court Counsel • Bar Council Certified</span>
        </div>

        {/* Grand Compact Editorial Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-black leading-[1.12] mb-4 tracking-tight max-w-5xl">
          Precision in Law.{' '}
          <br />
          <span className="italic font-normal font-serif text-neutral-700">
            Relentless in Courtroom Advocacy.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed mb-6 font-normal">
          Chambers of <strong className="text-black font-semibold">{siteName}</strong> delivers strategic trial defense, High Court appellate litigation, and 24/7 transparent digital case tracking across India.
        </p>

        {/* Modern Action Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Link
            href="/contact"
            id="hero-consult-btn"
            className="inline-flex items-center gap-2 px-7 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-all shadow-xs group"
          >
            <span>Schedule Case Consultation</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <Link
            href="/client/login"
            id="hero-portal-btn"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-full border border-neutral-300 hover:border-black hover:bg-white transition-all shadow-xs backdrop-blur-md"
          >
            <svg className="w-3.5 h-3.5 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Client Case Portal</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-neutral-700 hover:text-black transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Direct Chambers Hotline</span>
          </Link>
        </div>

        {/* Compact Practice Quick-Explorer Bar */}
        <div className="w-full max-w-5xl p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-neutral-200 shadow-xs mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {practiceHighlights.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveHighlight(idx)}
                className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                  activeHighlight === idx
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100/80 text-neutral-800 border border-neutral-200/60'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      activeHighlight === idx
                        ? 'bg-neutral-800 text-white'
                        : 'bg-neutral-200/70 text-neutral-800'
                    }`}
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.svgPath} />
                    </svg>
                  </div>
                  <span
                    className={`text-[0.55rem] font-mono uppercase tracking-wider px-1 py-0.5 rounded ${
                      activeHighlight === idx
                        ? 'bg-neutral-800 text-neutral-300'
                        : 'bg-neutral-200/60 text-neutral-600'
                    }`}
                  >
                    {item.court}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight mb-0.5">{item.title}</div>
                  <div
                    className={`text-[0.62rem] truncate ${
                      activeHighlight === idx ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {item.tag}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-neutral-200/60 flex flex-wrap items-center justify-between px-3 text-xs text-neutral-600">
            <span className="text-[0.7rem] font-medium">
              Selected Jurisdiction:{' '}
              <strong className="text-black font-bold">
                {practiceHighlights[activeHighlight].title}
              </strong>{' '}
              ({practiceHighlights[activeHighlight].tag})
            </span>
            <Link
              href={`/practice-areas/${practiceHighlights[activeHighlight].id}-law`}
              className="text-[0.7rem] font-bold text-black hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Practice Procedures</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Compact Vector Trust Proof Strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-neutral-700 pt-4 border-t border-neutral-200/80 w-full max-w-4xl">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
            </svg>
            <span className="font-bold text-black text-[0.72rem]">High Court & Supreme Court</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300" />

          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
            </svg>
            <span className="font-bold text-black text-[0.72rem]">18+ Years at Bar</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300" />

          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="font-bold text-black text-[0.72rem]">Attorney-Client Privilege</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300" />

          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
            </svg>
            <span className="font-bold text-black text-[0.72rem]">24/7 Digital Tracking</span>
          </div>
        </div>
      </div>
    </section>
  );
}
