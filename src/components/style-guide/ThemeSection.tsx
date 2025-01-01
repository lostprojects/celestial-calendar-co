import React, { useState } from 'react';
import { defaultTheme, ThemeConfig } from '@/theme/theme';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ThemeSection = () => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  const updateColor = (category: string, shade: string, value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [category]: {
          ...prev.colors[category],
          [shade]: value
        }
      }
    }));
  };

  return (
    <section className="mb-12">
      <h5 className="text-xl font-mono font-bold mb-4">Theme Configuration</h5>
      
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="animations">Animations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          {Object.entries(theme.colors).map(([category, shades]) => (
            <div key={category} className="space-y-2">
              <h6 className="text-lg font-mono">{category}</h6>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(shades).map(([shade, value]) => (
                  <div key={`${category}-${shade}`} className="space-y-2">
                    <div 
                      className="h-20 rounded-lg border"
                      style={{ backgroundColor: value }}
                    />
                    <div className="space-y-1">
                      <Label>{shade}</Label>
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => updateColor(category, shade, e.target.value)}
                        className="w-full"
                      />
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => updateColor(category, shade, e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4">
          {Object.entries(theme.fonts).map(([name, font]) => (
            <div key={name} className="space-y-2">
              <h6 className="text-lg font-mono">{name}</h6>
              <p style={{ fontFamily: `var(--font-${name})` }} className="text-xl">
                The quick brown fox jumps over the lazy dog
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Font Family</Label>
                  <Input value={font.family} readOnly className="font-mono text-sm" />
                </div>
                <div>
                  <Label>Weights</Label>
                  <div className="flex gap-2">
                    {font.weights.map(weight => (
                      <div 
                        key={weight}
                        style={{ 
                          fontFamily: `var(--font-${name})`,
                          fontWeight: weight 
                        }}
                        className="px-2 py-1 bg-background-sand rounded"
                      >
                        {weight}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="spacing" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(theme.spacing).map(([size, value]) => (
              <div key={size} className="space-y-2">
                <Label>{size}</Label>
                <div 
                  className="bg-accent-lightorange/20 rounded"
                  style={{ height: value }}
                />
                <Input value={value} readOnly className="font-mono text-sm" />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="animations" className="space-y-4">
          {Object.entries(theme.animations).map(([name, animation]) => (
            <div key={name} className="space-y-2">
              <h6 className="text-lg font-mono">{name}</h6>
              <div className={`animate-${name} inline-block p-4 bg-accent-lightorange/20 rounded`}>
                Animation Preview
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Input value={animation.duration} readOnly className="font-mono text-sm" />
                </div>
                <div>
                  <Label>Keyframes</Label>
                  <pre className="text-sm bg-background-sand p-2 rounded overflow-x-auto">
                    {JSON.stringify(animation.keyframes, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </section>
  );
};