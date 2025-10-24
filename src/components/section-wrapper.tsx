// section-wrapper.tsx
import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Section } from '@/types/page-spec';

interface DraggableSectionWrapperProps {
  section: Section;
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onRegenerate?: () => void;
}

export function DraggableSectionWrapper({
  section,
  children,
  onEdit,
  onDelete,
  onRegenerate,
}: DraggableSectionWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Overlay with Controls */}
      {isHovered && !isDragging && (
        <>
          {/* Subtle border highlight */}
          <div className="absolute inset-0 border-2 border-gray-400 pointer-events-none z-10 rounded-sm" />
          
          {/* Top control bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-20 rounded-t-sm">
            <div className="flex justify-between items-start p-3 pointer-events-auto">
              {/* Section Type Badge */}
              <span className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wide shadow-lg">
                {section.type}
              </span>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Edit Button */}
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md shadow-lg text-xs font-medium transition-all hover:scale-105 flex items-center gap-1.5"
                    title="Edit section"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}

                {/* Regenerate Button */}
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md shadow-lg text-xs font-medium transition-all hover:scale-105 flex items-center gap-1.5"
                    title="Regenerate with AI"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    AI Regenerate
                  </button>
                )}

                {/* Delete Button */}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md shadow-lg text-xs font-medium transition-all hover:scale-105 flex items-center gap-1.5"
                    title="Delete section"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Drag Handle - Centered */}
          <div className="absolute left-1/2 top-16 transform -translate-x-1/2 pointer-events-auto z-20">
            <div
              {...attributes}
              {...listeners}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-all hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zM9 11h2v2H9v-2zm4 0h2v2h-2v-2zM9 15h2v2H9v-2zm4 0h2v2h-2v-2zM9 19h2v2H9v-2zm4 0h2v2h-2v-2z"/>
              </svg>
              <span className="text-sm font-medium">Drag to Reorder</span>
            </div>
          </div>
        </>
      )}

      {/* Dragging State Indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-400 z-10 flex items-center justify-center rounded-sm">
          <div className="bg-white px-6 py-3 rounded-lg shadow-xl">
            <span className="text-blue-600 font-semibold text-base flex items-center gap-2">
              <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Moving Section...
            </span>
          </div>
        </div>
      )}

      {/* Actual Section Content */}
      {children}
    </div>
  );
}

export default DraggableSectionWrapper;