'use client';

const stats = [
  {
    value: '18+',
    label: 'Years at the Bar',
    sub: 'High Court & District Practice',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
      </svg>
    ),
  },
  {
    value: '1,200+',
    label: 'Matters Litigated',
    sub: 'Civil, Criminal & Consumer',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    value: '94%',
    label: 'Favorable Resolution',
    sub: 'Decrees, Acquittals & Settlements',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M4 7h16M4 7l3 7h-6l3-7M20 7l3 7h-6l3-7M9 21h6" />
      </svg>
    ),
  },
  {
    value: '24/7',
    label: 'Client Case Tracking',
    sub: 'Encrypted Digital Portal Access',
    iconSvg: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

export function StatsSection() {
  return (
    <section className="py-14 relative border-b border-neutral-200 bg-transparent">
      <div className="container-xl relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 sm:p-8 text-center group rounded-3xl bg-white/95 backdrop-blur-md border border-neutral-200 hover:border-black shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center mx-auto mb-4 group-hover:bg-black group-hover:text-white transition-all duration-300">
                {stat.iconSvg}
              </div>
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-black font-extrabold mb-1 font-mono">
                {stat.label}
              </div>
              <div className="text-[0.72rem] text-neutral-500 font-medium">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
