// components/section-edit-modal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Section } from '@/types/page-spec';

interface SectionEditModalProps {
  section: Section;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sectionId: string, newData: any) => void;
}

export function SectionEditModal({ 
  section, 
  isOpen, 
  onClose, 
  onSave 
}: SectionEditModalProps) {
  const [editedData, setEditedData] = useState<any>(section.data);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEditedData(section.data);
      setJsonText(JSON.stringify(section.data, null, 2));
    }
  }, [isOpen, section.data]);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const dataToSave = jsonMode ? JSON.parse(jsonText) : editedData;
      onSave(section.id, dataToSave);
      onClose();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format';
      alert(`Invalid JSON format. Please check your input.\n\nError: ${errorMessage}`);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderField = (key: string, value: any) => {
    if (typeof value === 'string') {
      // Check if it's likely a long text (heading, description, etc.)
      if (value.length > 50 || key.toLowerCase().includes('description')) {
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        );
      }
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div className="pl-4 border-l-2 border-gray-700 space-y-3">
          {Object.entries(value).map(([subKey, subValue]) => (
            <div key={subKey}>
              <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                {subKey.replace(/_/g, ' ')}
              </label>
              {renderField(`${key}.${subKey}`, subValue)}
            </div>
          ))}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="p-3 bg-gray-900 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Item {index + 1}</span>
                <button
                  onClick={() => {
                    const newArray = [...value];
                    newArray.splice(index, 1);
                    handleFieldChange(key, newArray);
                  }}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Remove
                </button>
              </div>
              {typeof item === 'string' ? (
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newArray = [...value];
                    newArray[index] = e.target.value;
                    handleFieldChange(key, newArray);
                  }}
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-700 text-white rounded-lg"
                />
              ) : (
                Object.entries(item).map(([itemKey, itemValue]) => (
                  <div key={itemKey} className="mb-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1 capitalize">
                      {itemKey.replace(/_/g, ' ')}
                    </label>
                    {typeof itemValue === 'string' ? (
                      <input
                        type="text"
                        value={itemValue}
                        onChange={(e) => {
                          const newArray = [...value];
                          newArray[index] = { ...newArray[index], [itemKey]: e.target.value };
                          handleFieldChange(key, newArray);
                        }}
                        className="w-full px-2 py-1.5 text-sm bg-gray-950 border border-gray-700 text-white rounded"
                      />
                    ) : (
                      <textarea
                        value={String(itemValue)}
                        onChange={(e) => {
                          const newArray = [...value];
                          newArray[index] = { ...newArray[index], [itemKey]: e.target.value };
                          handleFieldChange(key, newArray);
                        }}
                        className="w-full px-2 py-1.5 text-sm bg-gray-950 border border-gray-700 text-white rounded"
                        rows={2}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
          <button
            onClick={() => {
              const newItem = typeof value[0] === 'string' ? '' : { ...value[0] };
              handleFieldChange(key, [...value, newItem]);
            }}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            + Add Item
          </button>
        </div>
      );
    }

    return (
      <input
        type="text"
        value={String(value)}
        onChange={(e) => handleFieldChange(key, e.target.value)}
        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg"
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Section</h2>
            <p className="text-sm text-gray-400 mt-1">
              {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="px-6 py-3 bg-gray-900 border-b border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={() => setJsonMode(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !jsonMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Form Editor
            </button>
            <button
              onClick={() => {
                setJsonMode(true);
                setJsonText(JSON.stringify(editedData, null, 2));
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                jsonMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              JSON Editor
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {jsonMode ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Edit JSON (Advanced)
              </label>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full h-96 px-3 py-2 font-mono text-sm bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(editedData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  {renderField(key, value)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}