import React from 'react';

export const ColorSection = () => {
  return (
    <section className="mb-12">
      <h5 className="text-xl font-mono font-bold mb-4">Colors</h5>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="h-20 bg-primary-dark rounded-lg"></div>
          <p className="text-sm font-mono">primary.dark (#001018)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-background-sand rounded-lg"></div>
          <p className="text-sm font-mono">background.sand (#F5E6D3)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-accent-palm rounded-lg"></div>
          <p className="text-sm font-mono">accent.palm (#5E5F34)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-accent-lightpalm rounded-lg"></div>
          <p className="text-sm font-mono">accent.lightpalm (#6C783C)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-accent-orange rounded-lg"></div>
          <p className="text-sm font-mono">accent.orange (#D77145)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-accent-lightorange rounded-lg"></div>
          <p className="text-sm font-mono">accent.lightorange (#E0815D)</p>
        </div>
        <div className="space-y-2">
          <div className="h-20 bg-[#FCFAF7] rounded-lg border border-primary/10"></div>
          <p className="text-sm font-mono">background.default (#FCFAF7)</p>
        </div>
      </div>
    </section>
  );
};