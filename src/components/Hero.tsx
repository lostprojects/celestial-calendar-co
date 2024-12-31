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
      className: "bg-[#FDE1D3] border-[#F5E6D3] text-background",
    });
  };

  useEffect(() => {
    const interval = setInterval(showNewSignup, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen px-5 flex items-center">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/lovable-uploads/d4f799ab-fbf7-48c8-a1be-2fb4d27c4664.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0, 16, 24, 0.67) 0%, rgba(0, 16, 24, 0) 100%)'
          }}
        />
      </div>
      
      <div className="container mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="flex-1 text-left max-w-[50%]">
            {/* Glass Card Background */}
            <div className="bg-primary-dark/45 backdrop-blur-md rounded-3xl p-8 shadow-xl">
              {/* Social Proof */}
              <div className="flex items-center gap-3 mb-8 animate-fade-up">
                <div className="flex -space-x-3">
                  <img 
                    src="https://randomuser.me/api/portraits/women/17.jpg" 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-1 border-[#CA644E]"
                  />
                  <img 
                    src="https://randomuser.me/api/portraits/women/49.jpg" 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-1 border-[#CA644E]"
                  />
                  <img 
                    src="https://randomuser.me/api/portraits/women/63.jpg" 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-1 border-[#CA644E]"
                  />
                </div>
                <span className="text-sm font-mono text-accent-lightorange">Join 10,000+ seekers of cosmic wisdom</span>
              </div>

              {/* Main Content */}
              <h1 className="text-[2.5rem] md:text-[3.25rem] font-serif font-medium mb-4 text-background leading-[1.1] max-w-xl animate-fade-up">
                Your Cosmic Blueprint for Success
              </h1>
              <p className="text-base text-accent-lightpalm font-mono leading-relaxed max-w-lg mb-6 animate-fade-up">
                Unlock the wisdom of the stars and make confident decisions in your career, relationships, and personal growth.
              </p>
              
              {/* Features List */}
              <div className="flex flex-col space-y-3 mb-8 animate-fade-up">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#E5D5C0]" strokeWidth={1.5} />
                  <span className="text-sm text-[#E5D5C0]">Daily decision guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#E5D5C0]" strokeWidth={1.5} />
                  <span className="text-sm text-[#E5D5C0]">Personalized life phases</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#E5D5C0]" strokeWidth={1.5} />
                  <span className="text-sm text-[#E5D5C0]">Google/Apple Calendar Sync</span>
                </div>
              </div>
              
              {/* CTA */}
              <Button 
                onClick={scrollToForm}
                className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-6 text-base rounded-lg font-mono relative overflow-hidden group animate-fade-up"
              >
                <span className="relative z-10 font-bold">Get Your Cosmic Blueprint</span>
                <div className="absolute inset-0 bg-gradient-to-t from-accent-orange/90 to-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>

          {/* Right half remains empty for the background image to show through */}
          <div className="flex-1" />
        </div>
      </div>
    </section>
  );
};