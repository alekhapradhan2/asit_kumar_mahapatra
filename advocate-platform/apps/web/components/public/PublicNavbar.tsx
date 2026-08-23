'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Advocate Asit Kumar Mahapatra';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Practice Areas', href: '/practice-areas' },
  { label: 'Articles', href: '/articles' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Contact', href: '/contact' },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-3'
          : 'bg-white/85 backdrop-blur-md border-b border-neutral-200/80 py-4'
      }`}
    >
      {/* Edge-to-Edge Stretched Content Layout */}
      <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-6">
        {/* Far Left: Professional Monogram & Court Brand */}
        <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-serif text-sm font-bold tracking-wider transition-transform duration-300 group-hover:scale-105 shadow-xs">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v18" />
              <path d="M4 7h16" />
              <path d="M4 7l3 7h-6l3-7" />
              <path d="M20 7l3 7h-6l3-7" />
              <path d="M9 21h6" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-lg text-black tracking-tight leading-tight group-hover:underline">
              {siteName}
            </span>
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-neutral-500 font-bold font-mono">
              High Court & Supreme Court Counsel
            </span>
          </div>
        </Link>

        {/* Center / Stretched: Desktop Nav with Animated Hover Capsule */}
        <nav
          className="hidden lg:flex items-center gap-1.5 relative bg-neutral-100/90 p-1.5 rounded-full border border-neutral-200/80"
          aria-label="Main navigation"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {navLinks.map((link, idx) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredIdx(idx)}
                className={`relative px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-200 z-10 ${
                  isActive ? 'text-black font-bold' : 'text-neutral-600 hover:text-black'
                }`}
              >
                {/* Active or Hovered Background Pill Animation */}
                {isActive && (
                  <span className="absolute inset-0 bg-white rounded-full shadow-xs -z-10 border border-neutral-200" />
                )}
                {hoveredIdx === idx && !isActive && (
                  <span className="absolute inset-0 bg-white/70 rounded-full -z-10 transition-all duration-200" />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Far Right: Action CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <Link
            href="/client/login"
            id="nav-client-portal-btn"
            className="text-[0.72rem] uppercase tracking-wider font-bold text-neutral-800 border border-neutral-300 px-5 py-2.5 rounded-full hover:border-black hover:text-black hover:bg-neutral-50 transition-all duration-200"
          >
            Client Portal
          </Link>
          <Link
            href="/contact"
            id="nav-consult-btn"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white font-bold text-[0.72rem] uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-all shadow-xs group"
          >
            <span>Consultation</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          className="lg:hidden flex flex-col gap-1.5 p-2 text-black"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className={`block w-5 h-0.5 bg-black transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-black transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-black transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden w-full border-t border-neutral-200 bg-white/95 backdrop-blur-2xl px-6 py-5 space-y-2 shadow-xl animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-xs uppercase tracking-wider font-bold text-neutral-800 hover:text-black hover:bg-neutral-100 rounded-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-neutral-200 flex flex-col gap-2">
            <Link
              href="/client/login"
              className="block text-center text-xs uppercase tracking-wider font-bold text-neutral-800 py-2.5 border border-neutral-300 rounded-full hover:border-black transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Client Case Portal
            </Link>
            <Link
              href="/contact"
              className="block text-center text-xs uppercase tracking-wider font-bold bg-black text-white py-3 rounded-full hover:bg-neutral-800 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Get Consultation →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
