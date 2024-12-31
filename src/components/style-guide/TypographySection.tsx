import React, { useState } from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { CollapsibleHeader } from '@/components/ui/collapsible-header';

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
      <h5 className="text-xl font-mono font-bold mb-4">Typography</h5>
      <div className="space-y-8">
        <Collapsible open={openSections.headings}>
          <CollapsibleHeader
            title="Headings"
            isOpen={openSections.headings}
            onClick={() => toggleSection('headings')}
          />
          <CollapsibleContent className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">Heading 1</h1>
              <p className="text-sm text-accent-palm font-mono">text-4xl md:text-5xl lg:text-6xl font-serif</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4">Heading 2</h2>
              <p className="text-sm text-accent-palm font-mono">text-3xl md:text-4xl lg:text-5xl font-serif</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-4">Heading 3</h3>
              <p className="text-sm text-accent-palm font-mono">text-2xl md:text-3xl lg:text-4xl font-serif</p>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl lg:text-3xl font-serif mb-4">Heading 4</h4>
              <p className="text-sm text-accent-palm font-mono">text-xl md:text-2xl lg:text-3xl font-serif</p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.subheadings}>
          <CollapsibleHeader
            title="Subheadings"
            isOpen={openSections.subheadings}
            onClick={() => toggleSection('subheadings')}
          />
          <CollapsibleContent className="space-y-6">
            <div>
              <h5 className="text-lg md:text-xl font-mono font-bold tracking-tight mb-4">Heading 5</h5>
              <p className="text-sm text-accent-palm font-mono">text-lg md:text-xl font-mono font-bold tracking-tight</p>
            </div>
            <div>
              <h6 className="text-base md:text-lg font-mono font-bold tracking-tight mb-4">Heading 6</h6>
              <p className="text-sm text-accent-palm font-mono">text-base md:text-lg font-mono font-bold tracking-tight</p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.bodyText}>
          <CollapsibleHeader
            title="Body Text"
            isOpen={openSections.bodyText}
            onClick={() => toggleSection('bodyText')}
          />
          <CollapsibleContent className="space-y-6">
            <div>
              <p className="text-base mb-4">
                Regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-sm text-accent-palm font-mono">text-base</p>
            </div>
            <div>
              <p className="text-sm mb-4">
                Small text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-sm text-accent-palm font-mono">text-sm</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};