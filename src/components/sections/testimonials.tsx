// testimonials.tsx
import React from 'react';
import { TestimonialsData } from '@/types/page-spec';

const TestimonialsSection: React.FC<{ data: TestimonialsData }> = ({ data }) => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">{data.title}</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {data.items.map((item) => (
          <div key={item.id} className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex mb-4">
              {[...Array(item.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-lg text-gray-700 mb-6 italic">{item.quote}</p>
            <div>
              <p className="font-semibold text-gray-900">{item.author}</p>
              <p className="text-gray-600">{item.role} at {item.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;