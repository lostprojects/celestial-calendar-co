import React from 'react';

export const GuidelinesSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-serif mb-4">Usage Guidelines</h2>
      <div className="prose prose-slate max-w-none">
        <h3>Typography</h3>
        <ul>
          <li>Use Playfair Display for headings (font-serif)</li>
          <li>Use IBM Plex Mono for body text (font-mono)</li>
          <li>Main headings should be text-4xl (36px)</li>
          <li>Section headings should be text-2xl (24px)</li>
          <li>Body text should be text-base (16px)</li>
          <li>Small text and captions should be text-sm (14px)</li>
        </ul>
        
        <h3>Colors</h3>
        <ul>
          <li>Primary color (#403E43) for main text and important UI elements</li>
          <li>Primary Light (#F2FCE2) for subtle backgrounds and highlights</li>
          <li>Accent Sage (#D4DCCD) for secondary elements and borders</li>
          <li>Accent Sand (#F5E6D3) for call-to-action elements</li>
          <li>Background (#FCFAF7) for all page backgrounds</li>
        </ul>
        
        <h3>Components</h3>
        <ul>
          <li>Use glass card style for content modules</li>
          <li>Maintain consistent spacing with gap-4 or gap-6</li>
          <li>Use animations sparingly to enhance user experience</li>
        </ul>
      </div>
    </section>
  );
};