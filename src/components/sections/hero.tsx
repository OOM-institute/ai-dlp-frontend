// HeroSection.tsx
import React from 'react';
import { HeroData } from '@/types/page-spec';

const HeroSection: React.FC<{ data: HeroData }> = ({ data }) => (
  <section
    className="relative min-h-screen flex items-center justify-center px-4"
    style={{
      backgroundColor: data.backgroundColor,
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${data.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="max-w-4xl mx-auto text-center">
      <h1
        className="text-5xl md:text-6xl font-bold mb-6"
        style={{ color: data.textColor }}
      >
        {data.headline}
      </h1>
      <p
        className="text-xl md:text-2xl mb-8 opacity-90"
        style={{ color: data.textColor }}
      >
        {data.subheadline}
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
        {data.ctaText}
      </button>
    </div>
  </section>
);

export default HeroSection;