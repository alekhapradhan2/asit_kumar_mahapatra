'use client';
import Link from 'next/link';

export function ContactCTA() {
  return (
    <section className="section-py relative overflow-hidden bg-transparent border-b border-neutral-200">
      <div className="container-xl text-center relative z-10">
        <div className="max-w-3xl mx-auto p-10 sm:p-14 rounded-2xl bg-black text-white relative overflow-hidden shadow-lg">
          <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
            </svg>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Evaluate Your Legal Position
          </h2>

          <p className="text-neutral-300 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Every legal matter requires timely intervention and statutory precision. Reach out to our chambers for a confidential preliminary evaluation.
          </p>

          <div className="flex flex-wrap gap-3.5 justify-center">
            <Link
              href="/contact"
              id="cta-contact-btn"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-colors shadow-sm"
            >
              <span>Schedule Legal Consultation</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="/practice-areas"
              id="cta-areas-btn"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-bold text-xs uppercase tracking-wider rounded-full border border-white/30 hover:border-white hover:bg-white/10 transition-colors"
            >
              Explore Practice Jurisdictions
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-mono">
            <span>Direct Chamber Phone: +91 98610 00000</span>
            <span>•</span>
            <span>Email: advocate.asitmahapatra@gmail.com</span>
          </div>
        </div>
      </div>
    </section>
  );
}
