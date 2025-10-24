// footer.tsx
import React from 'react';
import { FooterData } from '@/types/page-spec';

const FooterSection: React.FC<{ data: FooterData }> = ({ data }) => (
  <footer className="bg-gray-900 text-white py-12 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex gap-6">
          {data.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="hover:text-blue-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex gap-6">
          {data.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="hover:text-blue-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.platform}
            </a>
          ))}
        </div>
      </div>
      <div className="text-center mt-8 text-gray-400 border-t border-gray-700 pt-8">
        {data.copyright}
      </div>
    </div>
  </footer>
);

export default FooterSection;