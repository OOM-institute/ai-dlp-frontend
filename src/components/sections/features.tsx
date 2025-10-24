// features.tsx
import React from 'react';
import { FeaturesData } from '@/types/page-spec';

const FeaturesSection: React.FC<{ data: FeaturesData }> = ({ data }) => (
  <section className="py-20 px-4 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">{data.title}</h2>
        <p className="text-xl text-gray-600">{data.description}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {data.items.map((item) => (
          <div key={item.id} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;