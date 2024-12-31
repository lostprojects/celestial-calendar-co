import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const ComponentsSection = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-serif mb-4">Components</h2>
      
      {/* Buttons */}
      <div className="mb-8">
        <h3 className="text-xl font-serif mb-4">Buttons <span className="text-sm font-mono text-primary/60">(@/components/ui/button)</span></h3>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">Small Button</Button>
            <p className="text-sm font-mono text-primary/60">&lt;Button className="bg-primary-dark hover:bg-primary-dark/90 text-white"&gt;</p>
          </div>
          <div className="space-y-2">
            <Button className="bg-primary-dark hover:bg-primary-dark/90 text-white px-8 py-6 text-lg">Main Button</Button>
            <p className="text-sm font-mono text-primary/60">&lt;Button className="bg-primary-dark hover:bg-primary-dark/90 text-white px-8 py-6 text-lg"&gt;</p>
          </div>
          <div className="space-y-2">
            <Button variant="secondary" className="text-white">Secondary Button</Button>
            <p className="text-sm font-mono text-primary/60">&lt;Button variant="secondary" className="text-white"&gt;</p>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="text-white">Outline Button</Button>
            <p className="text-sm font-mono text-primary/60">&lt;Button variant="outline" className="text-white"&gt;</p>
          </div>
          <div className="space-y-2">
            <Button variant="ghost" className="text-[#E0815D] hover:bg-[#E0815D]/10 hover:text-[#E0815D]/90">Ghost Button</Button>
            <p className="text-sm font-mono text-primary/60">&lt;Button variant="ghost" className="text-[#E0815D] hover:bg-[#E0815D]/10 hover:text-[#E0815D]/90"&gt;</p>
          </div>
          {/* Hero Button */}
          <div className="space-y-2">
            <Button 
              className="bg-[#CA644E] hover:bg-[#B1583B] text-white px-8 py-6 text-base rounded-lg font-mono relative overflow-hidden group"
            >
              <span className="relative z-10">Hero Button</span>
              <div className="absolute inset-0 bg-gradient-to-t from-[#E0815D]/90 to-[#E0815D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            <p className="text-sm font-mono text-primary/60 max-w-md">
              &lt;Button className="bg-[#CA644E] hover:bg-[#B1583B] text-white px-8 py-6 text-base rounded-lg font-mono relative overflow-hidden group"&gt;
            </p>
          </div>
        </div>
      </div>

      {/* Glass Card */}
      <div className="mb-8">
        <h3 className="text-xl font-serif mb-4">Cards <span className="text-sm font-mono text-primary/60">(@/components/ui/card)</span></h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-serif mb-2">Glass Card</h3>
              <p>Our custom glass card style.</p>
            </div>
            <p className="text-sm font-mono text-primary/60">Custom glass card with bg-white/80 backdrop-blur-md rounded-xl</p>
          </div>
        </div>
      </div>

      {/* Form Elements */}
      <div className="mb-8">
        <h3 className="text-xl font-serif mb-4">Form Elements</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Default Input" className="bg-white" />
              <p className="text-sm font-mono text-primary/60">&lt;Input className="bg-white"&gt; from @/components/ui/input</p>
            </div>
            <div className="space-y-2">
              <Calendar mode="single" />
              <p className="text-sm font-mono text-primary/60">&lt;Calendar mode="single"&gt; from @/components/ui/calendar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Avatars & Badges */}
      <div className="mb-8">
        <h3 className="text-xl font-serif mb-4">Avatars & Badges</h3>
        <div className="flex flex-wrap gap-8">
          <div className="space-y-2">
            <Avatar>
              <AvatarImage src="https://randomuser.me/api/portraits/women/17.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-sm font-mono text-primary/60">&lt;Avatar&gt; from @/components/ui/avatar</p>
          </div>
          <div className="space-y-2">
            <Badge className="bg-[#E0815D] hover:bg-[#E0815D]/90">New</Badge>
            <p className="text-sm font-mono text-primary/60">&lt;Badge&gt; from @/components/ui/badge</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Premium</Badge>
            <p className="text-sm font-mono text-primary/60">&lt;Badge variant="secondary"&gt;</p>
          </div>
          <div className="space-y-2">
            <Badge variant="outline">Basic</Badge>
            <p className="text-sm font-mono text-primary/60">&lt;Badge variant="outline"&gt;</p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <div className="mb-8">
        <h3 className="text-xl font-serif mb-4">Animations</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg animate-float">
            Float Animation
            <p className="text-sm font-mono text-primary/60">animate-float</p>
          </div>
          <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg animate-fade-up">
            Fade Up Animation
            <p className="text-sm font-mono text-primary/60">animate-fade-up</p>
          </div>
          <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg animate-pulse-subtle">
            Pulse Animation
            <p className="text-sm font-mono text-primary/60">animate-pulse-subtle</p>
          </div>
        </div>
      </div>
    </section>
  );
};
