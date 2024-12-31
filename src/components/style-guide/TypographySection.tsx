import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export const TypographySection = () => {
  const [openSections, setOpenSections] = useState({
    headings: true,
    subheadings: true,
    bodyText: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <section className="mb-12">
      <h5 className="text-xl font-mono font-bold mb-6">Typography</h5>
      
      <div className="space-y-6">
        <Collapsible open={openSections.headings}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('headings')}
            className="w-full text-left flex items-center gap-2 group"
          >
            <h6 className="text-base font-mono font-semibold mb-4 hover:text-primary/80">
              Headings
            </h6>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 text-primary/60 group-hover:text-primary/80 ${
                openSections.headings ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif">Heading 1 - Playfair Display</h1>
              <p className="text-sm font-mono text-primary/60">h1 (text-4xl, 36px)</p>
            </div>
            <div>
              <h2 className="text-3xl font-serif">Heading 2 - Playfair Display</h2>
              <p className="text-sm font-mono text-primary/60">h2 (text-3xl, 30px)</p>
            </div>
            <div>
              <h3 className="text-2xl font-serif">Heading 3 - Playfair Display</h3>
              <p className="text-sm font-mono text-primary/60">h3 (text-2xl, 24px)</p>
            </div>
            <div>
              <h4 className="text-xl font-serif">Heading 4 - Playfair Display</h4>
              <p className="text-sm font-mono text-primary/60">h4 (text-xl, 20px)</p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.subheadings}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('subheadings')}
            className="w-full text-left flex items-center gap-2 group"
          >
            <h6 className="text-base font-mono font-semibold mb-4 hover:text-primary/80">
              Subheadings
            </h6>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 text-primary/60 group-hover:text-primary/80 ${
                openSections.subheadings ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6">
            <div>
              <h5 className="text-xl font-mono font-bold">h5.mono (Subheading Large)</h5>
              <p className="text-sm font-mono text-primary/60">h5.mono (text-xl, 20px, font-bold)</p>
            </div>
            <div>
              <h6 className="text-base font-mono font-semibold">h6.mono (Subheading Regular)</h6>
              <p className="text-sm font-mono text-primary/60">h6.mono (text-base, 16px, font-semibold)</p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.bodyText}>
          <CollapsibleTrigger 
            onClick={() => toggleSection('bodyText')}
            className="w-full text-left flex items-center gap-2 group"
          >
            <h6 className="text-base font-mono font-semibold mb-4 hover:text-primary/80">
              Body Text
            </h6>
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 text-primary/60 group-hover:text-primary/80 ${
                openSections.bodyText ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6">
            <div>
              <p className="text-lg font-mono">Large Body Text - IBM Plex Mono</p>
              <p className="text-sm font-mono text-primary/60">p.large (text-lg, 18px)</p>
            </div>
            <div>
              <p className="text-base font-mono">Body Text - IBM Plex Mono</p>
              <p className="text-sm font-mono text-primary/60">p.body (text-base, 16px)</p>
            </div>
            <div>
              <p className="text-sm font-mono">Small Text - IBM Plex Mono</p>
              <p className="text-sm font-mono text-primary/60">p.small (text-sm, 14px)</p>
            </div>
            <div>
              <p className="text-xs font-mono">Extra Small Text - IBM Plex Mono</p>
              <p className="text-sm font-mono text-primary/60">p.xs (text-xs, 12px)</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};