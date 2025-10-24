/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LandingPageRenderer } from '@/components/landing-page-renderer';
import { SectionEditModal } from '@/components/section-edit-modal';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface FormData {
  industry: string;
  offer: string;
  targetAudience: string;
  brandTone: string;
  websiteUrl: string;
}

interface Section {
  id: string;
  type: string;
  order: number;
  data: any;
}

interface PageSpec {
  pageId: string;
  version: number;
  sections: Section[];
  metadata?: {
    industry: string;
    offer: string;
    targetAudience: string;
    brandTone: string;
    websiteUrl?: string;
  };
}

interface PageSummary {
  pageId: string;
  version: number;
  sectionCount: number;
  createdAt?: string;
  updatedAt?: string;
}

// Success Toast Component
function SuccessToast({ 
  isVisible, 
  message,
  onClose 
}: { 
  isVisible: boolean; 
  message: string;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

// AI Regenerate Modal Component
function AIRegenerateModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  sectionType,
  loading 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (prompt: string) => void;
  sectionType: string;
  loading: boolean;
}) {
  const [userPrompt, setUserPrompt] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(userPrompt);
    setUserPrompt('');
  };

  const handleClose = () => {
    setUserPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200 border border-gray-700">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center border border-purple-700">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              Regenerate with AI
            </h3>
            <p className="text-sm text-gray-400">
              AI will regenerate the <span className="font-medium text-gray-200">{sectionType}</span> section with fresh content.
            </p>
          </div>
        </div>

        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 mb-4">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-300 mb-1">Current content will be replaced</p>
              <p className="text-xs text-amber-400/80">Any customizations you have made to this section will be lost.</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="e.g., Make it more professional, add statistics, focus on benefits..."
            rows={3}
            className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide specific instructions to guide the AI regeneration
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-gray-200 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Regenerating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LandingPageBuilder() {
  const [formData, setFormData] = useState<FormData>({
    industry: '',
    offer: '',
    targetAudience: '',
    brandTone: 'professional',
    websiteUrl: '',
  });

  const [pageSpec, setPageSpec] = useState<PageSpec | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
  const [regeneratingSectionId, setRegeneratingSectionId] = useState<string | null>(null);
  const [regeneratingSection, setRegeneratingSection] = useState<Section | null>(null);
  
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // New state for page loading
  const [existingPages, setExistingPages] = useState<PageSummary[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [showPageLoader, setShowPageLoader] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  // Fetch existing pages on component mount
  useEffect(() => {
    fetchExistingPages();
  }, []);

  const fetchExistingPages = async () => {
    setLoadingPages(true);
    try {
      const response = await api.get('/pages');
      setExistingPages(response.data);
    } catch (err) {
      console.error('Failed to fetch pages:', err);
    } finally {
      setLoadingPages(false);
    }
  };

  const handleLoadPage = async () => {
    if (!selectedPageId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/pages/${selectedPageId}`);
      setPageSpec(response.data);
      setEditing(false);
      setShowPageLoader(false);
      
      // Fill the form with the page's original context
      if (response.data.user_context) {
        setFormData({
          industry: response.data.user_context.industry || '',
          offer: response.data.user_context.offer || '',
          targetAudience: response.data.user_context.target_audience || '',
          brandTone: response.data.user_context.brand_tone || 'professional',
          websiteUrl: response.data.user_context.website_url || '',
        });
      }
      
      setSuccessMessage('Page loaded successfully!');
      setShowSuccessToast(true);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? err.response?.data?.detail || err.message 
        : 'Failed to load page';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGeneratePage = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!formData.industry || !formData.offer || !formData.targetAudience) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/pages/generate', {
        industry: formData.industry,
        offer: formData.offer,
        target_audience: formData.targetAudience,
        brand_tone: formData.brandTone,
        website_url: formData.websiteUrl || undefined,
      });

      setPageSpec(response.data);
      setEditing(false);
      
      // Refresh pages list
      fetchExistingPages();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? err.response?.data?.detail || err.message 
        : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionsReorder = async (updatedSections: Section[]) => {
    if (!pageSpec) return;

    try {
      await api.post(`/pages/${pageSpec.pageId}/reorder-sections`, {
        sections: updatedSections,
      });

      setPageSpec({
        ...pageSpec,
        sections: updatedSections,
      });
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? err.response?.data?.detail || err.message 
        : 'Failed to reorder sections';
      setError(message);
    }
  };

  const handleSectionEdit = (sectionId: string) => {
    const section = pageSpec?.sections.find(s => s.id === sectionId);
    if (section) {
      setEditingSection(section);
    }
  };

  const handleSectionUpdate = async (sectionId: string, newData: any) => {
    if (!pageSpec) return;

    setLoading(true);
    setError(null);

    try {
      await api.post(`/pages/${pageSpec.pageId}/edit-section`, {
        section_id: sectionId,
        data: newData,
      });

      const updatedPage = await api.get(`/pages/${pageSpec.pageId}`);
      setPageSpec(updatedPage.data);
      
      setEditingSection(null);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? err.response?.data?.detail || err.message 
        : 'Failed to update section';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionRegenerate = (sectionId: string) => {
    if (!pageSpec) return;

    const section = pageSpec.sections.find(s => s.id === sectionId);
    if (!section) return;

    setRegeneratingSectionId(sectionId);
    setRegeneratingSection(section);
    setRegenerateModalOpen(true);
  };

  const handleConfirmRegenerate = async (userPrompt: string) => {
    if (!pageSpec || !regeneratingSectionId || !regeneratingSection) return;

    setLoading(true);
    setError(null);

    try {
      await api.post(`/pages/${pageSpec.pageId}/regenerate-section`, {
        section_id: regeneratingSectionId,
        data: {
          context: {
            userPrompt: userPrompt || '',
            currentType: regeneratingSection.type,
          }
        },
      });

      const updatedPage = await api.get(`/pages/${pageSpec.pageId}`);
      setPageSpec(updatedPage.data);
      
      setRegenerateModalOpen(false);
      setRegeneratingSectionId(null);
      setRegeneratingSection(null);
      
      setSuccessMessage('Section regenerated successfully!');
      setShowSuccessToast(true);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) 
        ? err.response?.data?.detail || err.message 
        : 'Failed to regenerate section';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionDelete = (sectionId: string) => {
    if (!pageSpec) return;

    const updatedSections = pageSpec.sections
      .filter(s => s.id !== sectionId)
      .map((section, index) => ({
        ...section,
        order: index,
      }));

    handleSectionsReorder(updatedSections);
  };

  // const handlePublish = async () => {
  //   if (!pageSpec) return;

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await api.post(`/pages/${pageSpec.pageId}/publish`);
  //     setSuccessMessage(`Page published successfully!`);
  //     setShowSuccessToast(true);
  //   } catch (err: unknown) {
  //     const message = axios.isAxiosError(err) 
  //       ? err.response?.data?.detail || err.message 
  //       : 'Failed to publish';
  //     setError(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleNewPage = () => {
    setPageSpec(null);
    setEditing(false);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Fixed Sidebar */}
      <aside className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Landing Page Builder</h1>
            <p className="text-sm text-gray-400 mt-1">Create your page with AI</p>
          </div>

          <div className="space-y-4">
            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Industry *
              </label>
              <input
                type="text"
                name="industry"
                placeholder="e.g., SaaS, E-commerce"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Offer */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Your Offer/Product *
              </label>
              <textarea
                name="offer"
                placeholder="Describe what you're offering"
                value={formData.offer}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Target Audience *
              </label>
              <input
                type="text"
                name="targetAudience"
                placeholder="e.g., Startup founders"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Brand Tone */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Brand Tone *
              </label>
              <select
                name="brandTone"
                value={formData.brandTone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="playful">Playful</option>
                <option value="minimalist">Minimalist</option>
                <option value="bold">Bold & Energetic</option>
              </select>
            </div>

            {/* Website URL (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Your Website (Optional)
              </label>
              <input
                type="url"
                name="websiteUrl"
                placeholder="https://example.com"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">We will crawl this to match your brand</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGeneratePage}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Generating...' : 'Generate Page'}
            </button>

            {/* Publish Button */}
            {/* {pageSpec && (
              <button
                onClick={handlePublish}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                {loading ? 'Publishing...' : 'Publish Page'}
              </button>
            )} */}

            {/* New Page Button */}
            {pageSpec && (
              <button
                onClick={handleNewPage}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                Create New Page
              </button>
            )}
          </div>

          {/* Load Existing Page Section */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={() => setShowPageLoader(!showPageLoader)}
              className="w-full flex items-center justify-between text-sm font-semibold text-white mb-3 hover:text-blue-400 transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Load Existing Page
              </span>
              <svg 
                className={`w-4 h-4 transition-transform ${showPageLoader ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showPageLoader && (
              <div className="space-y-3 animate-in slide-in-from-top duration-200">
                {loadingPages ? (
                  <div className="flex items-center justify-center py-4">
                    <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : existingPages.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No saved pages yet</p>
                  </div>
                ) : (
                  <>
                    <select
                      value={selectedPageId}
                      onChange={(e) => setSelectedPageId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a page...</option>
                      {existingPages.map((page) => (
                        <option key={page.pageId} value={page.pageId}>
                          {page.pageId} (v{page.version}) - {page.sectionCount} sections
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleLoadPage}
                      disabled={!selectedPageId || loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Load Page
                        </>
                      )}
                    </button>

                    <button
                      onClick={fetchExistingPages}
                      disabled={loadingPages}
                      className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-gray-300 font-medium px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh List
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Page Info */}
          {pageSpec && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="font-semibold text-white mb-3 text-sm">Page Info</h3>
              <div className="space-y-2 text-xs">
                <p>
                  <span className="font-medium text-gray-400">ID:</span>{' '}
                  <code className="bg-gray-900 text-gray-300 px-2 py-1 rounded">{pageSpec.pageId}</code>
                </p>
                <p>
                  <span className="font-medium text-gray-400">Version:</span> <span className="text-gray-300">{pageSpec.version}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-400">Sections:</span> <span className="text-gray-300">{pageSpec.sections.length}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">
              {pageSpec ? 'Live Preview' : 'Preview'}
            </h2>
            {pageSpec && (
              <button
                onClick={() => setEditing(!editing)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  editing
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                {editing ? '✓ Editing Mode' : '✎ Edit Mode'}
              </button>
            )}
          </div>
        </div>

        {/* Section Edit Modal */}
        {editingSection && (
          <SectionEditModal
            section={editingSection}
            isOpen={!!editingSection}
            onClose={() => setEditingSection(null)}
            onSave={handleSectionUpdate}
          />
        )}

        {/* AI Regenerate Modal */}
        {regeneratingSection && (
          <AIRegenerateModal
            isOpen={regenerateModalOpen}
            onClose={() => {
              setRegenerateModalOpen(false);
              setRegeneratingSectionId(null);
              setRegeneratingSection(null);
            }}
            onConfirm={handleConfirmRegenerate}
            sectionType={regeneratingSection.type}
            loading={loading}
          />
        )}

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto bg-gray-950">
          {pageSpec ? (
            <div className="h-full">
              <LandingPageRenderer
                pageSpec={pageSpec}
                isEditable={editing}
                onSectionsReorder={handleSectionsReorder}
                onSectionEdit={handleSectionEdit}
                onSectionDelete={handleSectionDelete}
                onSectionRegenerate={handleSectionRegenerate}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Page Yet</h3>
                <p className="text-gray-400">Fill in the form and click Generate Page to get started</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}