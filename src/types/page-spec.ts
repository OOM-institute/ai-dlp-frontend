// TypeScript Interfaces
export interface HeroData {
  headline: string;
  subheadline: string;
  ctaText: string;
  backgroundImage: string;
  textColor: string;
  backgroundColor: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FeaturesData {
  title: string;
  description: string;
  items: FeatureItem[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export interface TestimonialsData {
  title: string;
  items: TestimonialItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQData {
  title: string;
  items: FAQItem[];
}

export interface ContactField {
  name: string;
  label: string;
  type: string;
  required: boolean;
}

export interface ContactData {
  title: string;
  description: string;
  fields: ContactField[];
  submitText: string;
  backgroundColor: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface FooterData {
  links: FooterLink[];
  socialLinks: SocialLink[];
  copyright: string;
}

export interface Section {
  id: string;
  type: string;
  order: number;
  data: HeroData | FeaturesData | TestimonialsData | FAQData | ContactData | FooterData;
}

export interface PageSpec {
  pageId: string;
  version: number;
  sections: Section[];
}