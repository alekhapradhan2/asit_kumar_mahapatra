'use client';

const stats = [
  { value: '18+', label: 'Years at the Bar', sub: 'High Court & District Practice', icon: '🏛️' },
  { value: '1,200+', label: 'Matters Litigated', sub: 'Civil, Criminal & Consumer', icon: '📁' },
  { value: '94%', label: 'Favorable Resolution', sub: 'Decrees, Acquittals & Settlements', icon: '⚖️' },
  { value: '24/7', label: 'Client Case Tracking', sub: 'Encrypted Digital Portal Access', icon: '🔒' },
];

export function StatsSection() {
  return (
    <section className="py-16 relative border-b-2 border-black bg-transparent">
      <div className="container-xl relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="court-card-stark p-6 sm:p-8 text-center group rounded-xs bg-white"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">{stat.icon}</div>
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-widest text-black font-extrabold mb-1">
                {stat.label}
              </div>
              <div className="text-[0.72rem] text-neutral-600 font-medium">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
