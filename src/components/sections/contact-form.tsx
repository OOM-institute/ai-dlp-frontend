// contact-form.tsx
import React, { useState } from 'react';
import { ContactData } from '@/types/page-spec';

const ContactSection: React.FC<{ data: ContactData }> = ({ data }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for data.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-20 px-4" style={{ backgroundColor: data.backgroundColor }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">{data.title}</h2>
          <p className="text-xl text-gray-600">{data.description}</p>
        </div>
        <div className="space-y-6 bg-white p-8 rounded-lg shadow-md">
          {data.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            {data.submitText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;