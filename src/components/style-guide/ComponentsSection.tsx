import React, { useState } from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { CollapsibleHeader } from '@/components/ui/collapsible-header';

export const ComponentsSection = () => {
  const [openSections, setOpenSections] = useState({
    buttons: true,
    collapsible: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Example state for demonstrating CollapsibleHeader
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="mb-12">
      <h5 className="text-xl font-mono font-bold mb-4">Components</h5>
      <div className="space-y-8">
        <Collapsible open={openSections.buttons}>
          <CollapsibleHeader
            title="Buttons"
            isOpen={openSections.buttons}
            onClick={() => toggleSection('buttons')}
          />
          <CollapsibleContent>
            <div className="space-y-4">
              <h6 className="text-sm font-mono">Default Button</h6>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Click Me</button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.collapsible}>
          <CollapsibleHeader
            title="Collapsible Headers"
            isOpen={openSections.collapsible}
            onClick={() => toggleSection('collapsible')}
          />
          <CollapsibleContent className="space-y-6">
            <div className="space-y-4">
              <h6 className="text-sm font-mono">Default CollapsibleHeader</h6>
              <div className="border rounded-md p-4">
                <CollapsibleHeader
                  title="Example Header"
                  isOpen={demoOpen}
                  onClick={() => setDemoOpen(!demoOpen)}
                />
                {demoOpen && (
                  <div className="pt-4">
                    <p className="text-sm">This is the collapsible content that appears when the header is clicked.</p>
                  </div>
                )}
              </div>
              <div className="bg-slate-100 p-4 rounded-md">
                <p className="text-sm font-mono mb-2">Usage:</p>
                <pre className="text-sm overflow-x-auto">
                  {`<CollapsibleHeader
  title="Example Header"
  isOpen={isOpen}
  onClick={() => setIsOpen(!isOpen)}
/>`}
                </pre>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};
