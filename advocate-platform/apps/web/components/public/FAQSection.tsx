'use client';
import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    category: 'Client Portal',
    q: 'How does the Client Portal work for tracking my court case?',
    a: 'Every client is issued a unique Client ID and secure password upon case engagement. You can log in 24/7 from any device to inspect real-time case stages, next hearing dates, official court orders, and advocate strategy notes.',
  },
  {
    category: 'Consultations',
    q: 'What documents should I prepare for an initial legal consultation?',
    a: 'Please bring or upload copies of any FIR, police notices, trial court orders, contracts, revenue/property deeds, or legal notices received. You can attach a summary when booking via our consultation form.',
  },
  {
    category: 'eCourts Tracking',
    q: 'What is a CNR Number and how is it used?',
    a: 'A CNR (Case Number Record) is a unique 16-digit alphanumeric code assigned to every case filed in Indian Courts under the eCourts project. Our chambers tracks your CNR continuously and syncs official causelist updates directly into your client dashboard.',
  },
  {
    category: 'Confidentiality',
    q: 'How are client confidentiality and attorney-client privilege protected?',
    a: 'Under Section 126 of the Indian Evidence Act / Section 132 of the Bharatiya Sakshya Adhiniyam, all communications between a client and their advocate are legally privileged. In addition, our digital platform employs end-to-end data encryption and strict access controls.',
  },
  {
    category: 'Jurisdictions',
    q: 'In which courts and tribunals does Advocate Asit Kumar Mahapatra practice?',
    a: 'Our chambers actively represents clients in the High Court, District & Sessions Courts, Family Courts, Real Estate Regulatory Authority (RERA), State and National Consumer Commissions (NCDRC), and Central Administrative Tribunals.',
  },
  {
    category: 'Urgent Relief',
    q: 'Can urgent matters (like Anticipatory Bail or Stay Orders) be listed quickly?',
    a: 'Yes. For matters involving threat of imminent arrest, unlawful property demolition, or urgent stay requirements, our chambers drafts and files urgent listing mentioning memos before the competent vacation/regular bench.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Client Portal', 'Consultations', 'eCourts Tracking', 'Confidentiality', 'Urgent Relief'];

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  return (
    <section className="section-py relative border-b border-neutral-200 bg-transparent" id="faq">
      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Heading & Support Helper */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="section-label">Legal Inquiries & Policy</div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                Clear statutory answers regarding consultation procedures, court filings, CNR causelist tracking, and legal representation.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-white/80 border border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Direct Support Card */}
            <div className="p-6 rounded-xl bg-white/95 border border-neutral-200 shadow-xs mt-8">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-3 text-black">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
                </svg>
              </div>
              <h3 className="font-serif text-base font-bold text-black mb-1">
                Have a Specific Legal Question?
              </h3>
              <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                Speak directly with the litigation desk of Advocate Asit Kumar Mahapatra for an initial evaluation.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center py-3 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Request Case Consultation →
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-white/95 backdrop-blur-xs border border-neutral-200 transition-all duration-200"
              >
                <button
                  id={`faq-item-${i}`}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4 hover:bg-neutral-50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <div className="space-y-1">
                    <span className="text-[0.65rem] uppercase tracking-widest font-bold text-neutral-500 font-mono block">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-black tracking-tight block">
                      {faq.q}
                    </span>
                  </div>

                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-bold flex-shrink-0 transition-transform duration-200 ${
                      openIndex === i
                        ? 'bg-black text-white rotate-45'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    +
                  </span>
                </button>

                {openIndex === i && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-neutral-700 leading-relaxed border-t border-neutral-100 pt-4 bg-neutral-50/50 animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
