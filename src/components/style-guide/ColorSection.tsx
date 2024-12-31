import React from 'react';

export const ColorSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-serif mb-4">Colors</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="h-20 bg-primary-light rounded-lg"></div>
          <p className="text-sm font-mono">Primary Light (#F2FCE2)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-primary-dark rounded-lg"></div>
          <p className="text-sm font-mono">Primary Dark (#001018)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-accent-sage rounded-lg"></div>
          <p className="text-sm font-mono">Accent Sage (#D4DCCD)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-accent-sand rounded-lg"></div>
          <p className="text-sm font-mono">Accent Sand (#F5E6D3)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-[#CA644E] rounded-lg"></div>
          <p className="text-sm font-mono">Button Primary (#CA644E)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-[#B1583B] rounded-lg"></div>
          <p className="text-sm font-mono">Button Hover (#B1583B)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-[#FCFAF7] rounded-lg border border-primary/10"></div>
          <p className="text-sm font-mono">Background (#FCFAF7)</p>
        </div>
      </div>
    </section>
  );
};