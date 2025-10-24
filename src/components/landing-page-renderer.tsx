// landing-page-renderer.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PageSpec, Section } from '@/types/page-spec';
import HeroSection from './sections/hero';
import FeaturesSection from './sections/features';
import TestimonialsSection from './sections/testimonials';
import FAQSection from './sections/faq';
import ContactSection from './sections/contact-form';
import FooterSection from './sections/footer';
import { DraggableSectionWrapper } from './section-wrapper';

interface LandingPageRendererProps {
  pageSpec: PageSpec;
  isEditable?: boolean;
  onSectionsReorder?: (sections: Section[]) => void;
  onSectionEdit?: (sectionId: string) => void;
  onSectionDelete?: (sectionId: string) => void;
  onSectionRegenerate?: (sectionId: string) => void;
}

export function LandingPageRenderer({
  pageSpec,
  isEditable = false,
  onSectionsReorder,
  onSectionEdit,
  onSectionDelete,
  onSectionRegenerate,
}: LandingPageRendererProps) {
  const sectionComponents = {
    hero: HeroSection,
    features: FeaturesSection,
    testimonials: TestimonialsSection,
    faq: FAQSection,
    contact: ContactSection,
    footer: FooterSection,
  };

  const sortedSections = [...pageSpec.sections].sort((a, b) => a.order - b.order);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag must move 8px before activating (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates, // Keyboard accessibility
    })
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
      const newIndex = sortedSections.findIndex((s) => s.id === over.id);

      // Reorder sections
      const reorderedSections = arrayMove(sortedSections, oldIndex, newIndex);
      
      // Update order property for each section
      const updatedSections = reorderedSections.map((section, index) => ({
        ...section,
        order: index,
      }));

      // Callback to parent component
      onSectionsReorder?.(updatedSections);
    }
  };

  // If not editable, render simple list
  if (!isEditable) {
    return (
      <div className="min-h-screen">
        {sortedSections.map((section) => {
          const SectionComponent = sectionComponents[section.type as keyof typeof sectionComponents];
          if (!SectionComponent) return null;
          return <SectionComponent key={section.id} data={section.data as any} />;
        })}
      </div>
    );
  }

  // Editable mode with drag-and-drop
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedSections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-screen">
          {sortedSections.map((section) => {
            const SectionComponent = sectionComponents[section.type as keyof typeof sectionComponents];
            if (!SectionComponent) return null;

            return (
              <DraggableSectionWrapper
                key={section.id}
                section={section}
                onEdit={() => onSectionEdit?.(section.id)}
                onDelete={() => onSectionDelete?.(section.id)}
                onRegenerate={() => onSectionRegenerate?.(section.id)}
              >
                <SectionComponent data={section.data as any} />
              </DraggableSectionWrapper>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}