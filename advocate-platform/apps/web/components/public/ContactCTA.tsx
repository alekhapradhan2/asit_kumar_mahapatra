'use client';
import Link from 'next/link';

interface ContactCTAProps {
  badge?: string;
  title?: string;
  highlightedText?: string;
  description?: string;
}

export function ContactCTA({
  badge = 'Direct Chamber Access',
  title = 'Ready to Discuss Your Legal Matter?',
  highlightedText = 'Schedule a Confidential Evaluation',
  description = 'Strategic courtroom advocacy and timely statutory advice for trial, bail, property disputes, and High Court appellate proceedings.',
}: ContactCTAProps) {
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 98610 00000';
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'advocate.asitmahapatra@gmail.com';

  return (
    <section className="w-full bg-[#09090b] text-white border-y border-neutral-800 py-10 sm:py-12 relative overflow-hidden">
      {/* Ambient Top Highlight Line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-neutral-400/40 to-transparent" />
      
      {/* Background Scales Watermark (Right-aligned, subtle) */}
      <div className="absolute -right-6 -bottom-10 opacity-[0.03] pointer-events-none select-none hidden md:block">
        <svg className="w-64 h-64 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
        </svg>
      </div>

      <div className="container-xl px-4 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Side: Headline & Description */}
          <div className="text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.68rem] font-semibold tracking-wider uppercase text-neutral-300 bg-white/5 border border-white/10 mb-3 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{badge} • Bar Council Certified</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-2">
              {title}{' '}
              <span className="italic font-normal font-serif text-neutral-300">
                {highlightedText}
              </span>
            </h2>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-4 max-w-xl">
              {description}
            </p>

            {/* Micro Assurances */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[0.72rem] text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                100% Confidential (Sec. 126 Privilege)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Direct Chamber Assessment
              </span>
            </div>
          </div>

          {/* Right Side: Action Buttons & Direct Dial */}
          <div className="flex flex-col items-center lg:items-end gap-3.5 w-full sm:w-auto shrink-0">
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full sm:w-auto">
              <Link
                href="/contact"
                id="cta-contact-btn"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-all shadow-md group w-full sm:w-auto"
              >
                <span>Schedule Consultation</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                id="cta-phone-btn"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-transparent text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-white/20 hover:border-white hover:bg-white/10 transition-all w-full sm:w-auto"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call Chamber</span>
              </a>
            </div>

            {/* Secondary links */}
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <Link href="/practice-areas" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                Explore Practice Areas →
              </Link>
              <span>•</span>
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
