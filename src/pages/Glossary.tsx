import React from 'react';
import { GlossaryFunctions } from '@/components/glossary/GlossaryFunctions';
import { GlossaryComponents } from '@/components/glossary/GlossaryComponents';
import { GlossaryObjects } from '@/components/glossary/GlossaryObjects';
import { GlossaryResources } from '@/components/glossary/GlossaryResources';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Glossary = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-serif font-bold text-primary-dark mb-8">
        Application Glossary
      </h1>
      
      <Tabs defaultValue="functions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="functions">
          <GlossaryFunctions />
        </TabsContent>
        
        <TabsContent value="components">
          <GlossaryComponents />
        </TabsContent>
        
        <TabsContent value="objects">
          <GlossaryObjects />
        </TabsContent>
        
        <TabsContent value="resources">
          <GlossaryResources />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Glossary;