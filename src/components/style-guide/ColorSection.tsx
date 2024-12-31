import React from 'react';

export const ColorSection = () => {
  return (
    <section className="mb-12">
      <h5 className="text-xl font-mono font-bold mb-4">Colors</h5>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="h-20 bg-primary-light rounded-lg"></div>
          <p className="text-sm font-mono">primary.light (#F2FCE2)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-primary-dark rounded-lg"></div>
          <p className="text-sm font-mono">primary.dark (#001018)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-accent-sage rounded-lg"></div>
          <p className="text-sm font-mono">accent.sage (#D4DCCD)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-accent-sand rounded-lg"></div>
          <p className="text-sm font-mono">accent.sand (#F5E6D3)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-[#CA644E] rounded-lg"></div>
          <p className="text-sm font-mono">button.primary (#CA644E)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-[#FCFAF7] rounded-lg border border-primary/10"></div>
          <p className="text-sm font-mono">background.default (#FCFAF7)</p>
        </div>
      </div>
    </section>
  );
};