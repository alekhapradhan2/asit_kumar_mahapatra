'use client';
import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

const practiceLinks = [
  { label: 'Criminal Law Defense (BNSS)', href: '/practice-areas/criminal-law' },
  { label: 'Property & Real Estate Litigation', href: '/practice-areas/property-law' },
  { label: 'Family & Matrimonial Disputes', href: '/practice-areas/family-law' },
  { label: 'Consumer Protection & NCDRC', href: '/practice-areas/consumer-law' },
  { label: 'Civil & Commercial Litigation', href: '/practice-areas/civil-law' },
  { label: 'Cyber Law & Digital Evidence', href: '/practice-areas/cyber-law' },
];

const quickLinks = [
  { label: 'Chambers Overview', href: '/about' },
  { label: 'Practice Jurisdictions', href: '/practice-areas' },
  { label: 'Law Review & Articles', href: '/articles' },
  { label: 'Verified Judicial Outcomes', href: '/success-stories' },
  { label: 'Book Legal Consultation', href: '/contact' },
  { label: 'Client Case Portal', href: '/client/login' },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white/85 backdrop-blur-md text-neutral-800 relative z-10">
      {/* Main Footer */}
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Chambers Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-serif text-sm font-bold">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
                </svg>
              </div>
              <span className="font-serif text-lg font-bold text-black tracking-tight">{siteName}</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              High Court & Supreme Court Legal Counsel. Dedicated to strategic courtroom advocacy, constitutional liberty, and transparent digital case tracking across India.
            </p>
            <div className="pt-2 text-xs text-neutral-700 font-mono space-y-1">
              <div>Bar Council Certified Advocate</div>
              <div>18+ Years Specialized Litigation</div>
            </div>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4 font-mono">
              Practice Jurisdictions
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              {practiceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-black hover:underline transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4 font-mono">
              Chambers Directory
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-black hover:underline transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chambers Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4 font-mono">
              Chambers Office
            </h3>
            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-black flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{process.env.NEXT_PUBLIC_OFFICE_ADDRESS || 'High Court Bar Association & Chamber Complex, Cuttack / Bhubaneswar, Odisha'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-black flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="font-mono">{process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 98610 00000'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-black flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="font-mono">{process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'advocate.asitmahapatra@gmail.com'}</span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/client/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-black border border-neutral-300 px-3.5 py-1.5 rounded-full hover:border-black transition-colors"
              >
                <span>Authorized Client Portal</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Council of India Mandatory Disclaimer */}
      <div className="border-t border-neutral-200 py-6 bg-neutral-50/80">
        <div className="container-xl text-[0.7rem] text-neutral-500 leading-relaxed space-y-2">
          <p className="font-bold text-neutral-700 uppercase tracking-widest font-mono">
            Bar Council of India Disclaimer & Notice
          </p>
          <p>
            As per the rules of the Bar Council of India, advocates are prohibited from soliciting work or advertising. By visiting this website, the user acknowledges that the information provided is solely for informational purposes at their own request and does not constitute legal advice or create an attorney-client relationship.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-neutral-400 font-mono">
            <div>© {new Date().getFullYear()} {siteName}. All Rights Reserved.</div>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/disclaimer" className="hover:underline">Legal Disclaimer</Link>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
