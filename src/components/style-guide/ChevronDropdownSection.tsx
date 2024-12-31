import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";

export const ChevronDropdownSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <h6 className="text-base font-mono font-semibold mb-4">chevron.dropdown <span className="text-sm font-mono text-primary/60">(@/components/ui/collapsible-header)</span></h6>
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-accent-lightpalm hover:text-accent-lightpalm/80 transition-colors"
          >
            <span className="text-base md:text-lg font-mono font-bold tracking-tight">Collapsible Header</span>
            <ChevronDown className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="pl-4 py-2 text-primary-dark/80">
              This is placeholder content that appears when the chevron is clicked.
            </div>
          )}
          <p className="text-sm font-mono text-primary/60">
            &lt;CollapsibleHeader className="flex items-center gap-2 text-accent-lightpalm hover:text-accent-lightpalm/80 transition-colors"&gt;
          </p>
        </div>
      </div>
    </div>
  );
};