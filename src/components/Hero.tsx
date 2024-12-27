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
    });
  };

  useEffect(() => {
    const interval = setInterval(showNewSignup, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="celestial-bg animate-pulse" />
      
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="flex-1 text-left space-y-6">
            {/* Social Proof */}
            <div className="flex items-center gap-3 mb-8 animate-fade-up">
              <div className="flex -space-x-3">
                <img 
                  src="https://randomuser.me/api/portraits/women/17.jpg" 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img 
                  src="https://randomuser.me/api/portraits/women/49.jpg" 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img 
                  src="https://randomuser.me/api/portraits/women/63.jpg" 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <span className="text-primary/80 font-mono text-sm">Join 10,000+ seekers of cosmic wisdom</span>
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
                <Calendar className="w-5 h-5 text-accent-sage" />
                <span className="text-sm">Google/Apple Calendar Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent-sage" />
                <span className="text-sm">Daily decision guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-accent-sage" />
                <span className="text-sm">Personalized life phases</span>
              </div>
            </div>
            
            {/* CTA */}
            <Button 
              onClick={scrollToForm}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-lg font-mono relative overflow-hidden group animate-fade-up"
            >
              <span className="relative z-10">Get Your Cosmic Blueprint</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-sage/20 to-accent-sand/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="flex-1 relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1213&q=80"
                alt="Starry night sky" 
                className="w-full h-[600px] rounded-2xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-accent-sage/20 to-transparent mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};