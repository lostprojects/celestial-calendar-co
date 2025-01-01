import React from 'react';
import { ColorSection } from '@/components/style-guide/ColorSection';
import { TypographySection } from '@/components/style-guide/TypographySection';
import { ComponentsSection } from '@/components/style-guide/ComponentsSection';
import { ThemeSection } from '@/components/style-guide/ThemeSection';

const StyleGuide = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <ThemeSection />
      <ColorSection />
      <TypographySection />
      <ComponentsSection />
    </div>
  );
};

export default StyleGuide;