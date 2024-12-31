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
    <section className="relative min-h-screen px-5 flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/lovable-uploads/d4f799ab-fbf7-48c8-a1be-2fb4d27c4664.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="container mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="flex-1 text-left max-w-[50%]">
            {/* Glass Card Background */}
            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl">
              {/* Social Proof */}
              <div className="flex items-center gap-3 mb-8 animate-fade-up">
                <div className="flex -space-x-3">
                  <img 
                    src="https://randomuser.me/api/portraits/women/17.jpg" 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-2 border-[#CA644E]"
                  />
                  <img 
                    src="https://randomuser.me/api/portraits/women/49.jpg" 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-2 border-[#CA644E]"
                  />
                  <img 
                    src="https://randomuser.me/api/portraits/women/63.jpg" 
                    alt="User" 
                    className="w-8 h-8 rounded-full border-2 border-[#CA644E]"
                  />
                </div>
                <span className="text-sm font-mono">Join 10,000+ seekers of cosmic wisdom</span>
              </div>

              {/* Main Content */}
              <h1 className="text-[2.5rem] md:text-[3.25rem] font-serif font-medium mb-4 text-primary-dark leading-[1.1] max-w-xl animate-fade-up">
                Your Personal Cosmic Blueprint for Success
              </h1>
              <p className="text-base text-primary-dark/80 font-mono leading-relaxed max-w-lg mb-8 animate-fade-up">
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
                className="bg-[#CA644E] hover:bg-[#B1583B] text-white px-8 py-6 text-lg rounded-lg font-mono relative overflow-hidden group animate-fade-up"
              >
                <span className="relative z-10">Get Your Cosmic Blueprint</span>
                <div className="absolute inset-0 bg-gradient-to-t from-[#B1583B]/90 to-[#B1583B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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