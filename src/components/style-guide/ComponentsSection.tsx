import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ChevronDropdownSection } from './ChevronDropdownSection';

export const ComponentsSection = () => {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      title: "Success Toast",
      description: "Your action was completed successfully.",
      className: "bg-white border-green-500 text-primary-dark",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error Toast",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
      className: "bg-white border-red-500 text-primary-dark",
    });
  };

  const showInfoToast = () => {
    toast({
      title: "Info Toast",
      description: "Here's some helpful information.",
      className: "bg-white border-[#CA644E] text-primary-dark",
    });
  };

  return (
    <section className="mb-12">
      <h5 className="text-xl font-mono font-bold mb-4">Components</h5>
      
      {/* Chevron Dropdown */}
      <ChevronDropdownSection />

      {/* Buttons */}
      <div className="mb-8">
        <h6 className="text-base font-mono font-semibold mb-4">button.variants <span className="text-sm font-mono text-primary/60">(@/components/ui/button)</span></h6>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">button.small</Button>
            <p className="text-sm font-mono text-primary/60">&lt;Button className="bg-primary-dark hover:bg-primary-dark/90 text-white"&gt;</p>
          </div>
          <div className="space-y-2">
            <Button className="bg-primary-dark hover:bg-primary-dark/90 text-white px-8 py-6 text-lg">button.main</Button>
            <p className="text-sm font-mono text-primary/60">&lt;Button className="bg-primary-dark hover:bg-primary-dark/90 text-white px-8 py-6 text-lg"&gt;</p>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="border-primary-dark text-primary-dark hover:bg-primary-dark/10">button.outline</Button>
            <p className="text-sm font-mono text-primary/60">&lt;Button variant="outline" className="border-primary-dark text-primary-dark hover:bg-primary-dark/10"&gt;</p>
          </div>
          <div className="space-y-2">
            <Button variant="ghost" className="text-[#E0815D] hover:bg-[#E0815D]/10 hover:text-[#E0815D]/90">button.ghost</Button>
            <p className="text-sm font-mono text-primary/60">&lt;Button variant="ghost" className="text-[#E0815D] hover:bg-[#E0815D]/10 hover:text-[#E0815D]/90"&gt;</p>
          </div>
          {/* Hero Button */}
          <div className="space-y-2">
            <Button 
              className="bg-[#CA644E] hover:bg-[#B1583B] text-white px-8 py-6 text-base rounded-lg font-mono relative overflow-hidden group"
            >
              <span className="relative z-10 font-bold">button.hero</span>
              <div className="absolute inset-0 bg-gradient-to-t from-[#E0815D]/90 to-[#E0815D] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            <p className="text-sm font-mono text-primary/60">
              &lt;Button className="bg-[#CA644E] hover:bg-[#B1583B] text-white px-8 py-6 text-base rounded-lg font-mono relative overflow-hidden group"&gt;
            </p>
          </div>
        </div>
      </div>

      {/* Toast Section */}
      <div className="mb-8">
        <h6 className="text-base font-mono font-semibold mb-4">toast.variants <span className="text-sm font-mono text-primary/60">(@/components/ui/toast)</span></h6>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Button onClick={showSuccessToast} variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
              toast.success
            </Button>
            <p className="text-sm font-mono text-primary/60">Success Toast with green border</p>
          </div>
          <div className="space-y-2">
            <Button onClick={showErrorToast} variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
              toast.error
            </Button>
            <p className="text-sm font-mono text-primary/60">Error Toast with red border</p>
          </div>
          <div className="space-y-2">
            <Button onClick={showInfoToast} variant="outline" className="border-[#CA644E] text-[#CA644E] hover:bg-[#CA644E]/10">
              toast.info
            </Button>
            <p className="text-sm font-mono text-primary/60">Info Toast with primary accent border</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-mono text-primary/60">
            Usage example:
            {`
              const { toast } = useToast();
              toast({
                title: "Title",
                description: "Description",
                className: "bg-white border-[color] text-primary-dark"
              });
            `}
          </p>
        </div>
      </div>

      {/* Glass Card */}
      <div className="mb-8">
        <h6 className="text-base font-mono font-semibold mb-4">card.variants <span className="text-sm font-mono text-primary/60">(@/components/ui/card)</span></h6>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-serif mb-2">card.glass</h3>
              <p>Our custom glass card style.</p>
            </div>
            <p className="text-sm font-mono text-primary/60">Custom glass card with bg-white/80 backdrop-blur-md rounded-xl</p>
          </div>
        </div>
      </div>

      {/* Form Elements */}
      <div className="mb-8">
        <h6 className="text-base font-mono font-semibold mb-4">form.elements</h6>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="input.default" className="bg-white" />
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
        <h6 className="text-base font-mono font-semibold mb-4">display.elements</h6>
        <div className="flex flex-wrap gap-8">
          <div className="space-y-2">
            <Avatar>
              <AvatarImage src="https://randomuser.me/api/portraits/women/17.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-sm font-mono text-primary/60">avatar.default from @/components/ui/avatar</p>
          </div>
          <div className="space-y-2">
            <Badge className="bg-[#E0815D] hover:bg-[#E0815D]/90">badge.primary</Badge>
            <p className="text-sm font-mono text-primary/60">badge.primary from @/components/ui/badge</p>
          </div>
          <div className="space-y-2">
            <Badge className="bg-accent-palm hover:bg-accent-palm/90 text-white">badge.secondary</Badge>
            <p className="text-sm font-mono text-primary/60">badge.secondary</p>
          </div>
          <div className="space-y-2">
            <Badge variant="outline">badge.outline</Badge>
            <p className="text-sm font-mono text-primary/60">badge.outline</p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <div className="mb-8">
        <h6 className="text-base font-mono font-semibold mb-4">animation.variants</h6>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg animate-float">
            animation.float
            <p className="text-sm font-mono text-primary/60">animate-float</p>
          </div>
          <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg animate-fade-up">
            animation.fadeUp
            <p className="text-sm font-mono text-primary/60">animate-fade-up</p>
          </div>
          <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg animate-pulse-subtle">
            animation.pulse
            <p className="text-sm font-mono text-primary/60">animate-pulse-subtle</p>
          </div>
        </div>
      </div>
    </section>
  );
};
