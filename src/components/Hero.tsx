import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Lightbulb, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Hero = () => {
  const { toast } = useToast();
  
  const scrollToForm = () => {
    const form = document.querySelector('#birth-chart-section');
    form?.scrollIntoView({ behavior: 'smooth' });
  };

  const showNewSignup = () => {
    toast({
      title: "Someone just joined!",
      description: "Sarah from New York started their celestial journey",
      className: "bg-[#FDE1D3] border-[#F5E6D3] text-[#403E43]",
    });
  };

  useEffect(() => {
    const interval = setInterval(showNewSignup, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-[#FEC6A1] via-[#FDE1D3] to-[#F5E6D3]">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="flex-1 text-left space-y-6">
            {/* Social Proof */}
            <div className="flex items-center gap-3 mb-8 animate-fade-up">
              <div className="flex -space-x-3">
                <img 
                  src="https://randomuser.me/api/portraits/women/17.jpg" 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-[#D4DCCD]"
                />
                <img 
                  src="https://randomuser.me/api/portraits/women/49.jpg" 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-[#D4DCCD]"
                />
                <img 
                  src="https://randomuser.me/api/portraits/women/63.jpg" 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-[#D4DCCD]"
                />
              </div>
              <span className="text-primary font-mono text-sm">Join 10,000+ seekers of cosmic wisdom</span>
            </div>

            {/* Main Content */}
            <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4 text-primary-dark leading-[1.1] max-w-xl animate-fade-up">
              Your Personal Cosmic Blueprint for Success
            </h1>
            <p className="text-lg text-primary-dark/80 font-mono leading-relaxed max-w-lg mb-8 animate-fade-up">
              Unlock the power of celestial intelligence to make confident decisions in your career, relationships, and personal growth.
            </p>
            
            {/* Features List */}
            <div className="flex flex-col space-y-4 mb-8 animate-fade-up">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#403E43]" />
                <span className="text-sm">Google/Apple Calendar Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#403E43]" />
                <span className="text-sm">Daily decision guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#403E43]" />
                <span className="text-sm">Personalized life phases</span>
              </div>
            </div>
            
            {/* CTA */}
            <Button 
              onClick={scrollToForm}
              className="bg-[#FEC6A1] hover:bg-[#FEC6A1]/90 text-primary-dark px-8 py-6 text-lg rounded-lg font-mono relative overflow-hidden group animate-fade-up"
            >
              <span className="relative z-10">Get Your Cosmic Blueprint</span>
              <div className="absolute inset-0 bg-gradient-to-t from-[#FDE1D3] to-[#FEC6A1] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="flex-1 relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="/lovable-uploads/a63fd645-18a2-49ec-aaa7-2177e393c156.png"
                alt="Woman gazing at stars" 
                className="w-full h-[600px] rounded-2xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-[#FEC6A1]/30 to-transparent mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};