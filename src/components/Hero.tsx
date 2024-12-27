import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Users, Clock, Sparkles, TrendingUp } from "lucide-react";
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

  // Show random signup notification every 30 seconds
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
          <div className="flex-1 text-left space-y-6 transform md:translate-y-12">
            {/* Enhanced Social Proof */}
            <div className="flex flex-col space-y-4 mb-8 animate-fade-up">
              <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-primary/80">Trusted by Fortune 500 executives</span>
              </div>
              <div className="bg-accent-sage/20 p-3 rounded-lg">
                <p className="text-sm italic text-primary/90">
                  "Celestial's insights helped me make crucial career decisions at exactly the right time."
                  <span className="block mt-2 font-medium">— Emma R., CEO</span>
                </p>
              </div>
            </div>

            {/* Main Content */}
            <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4 text-primary-dark leading-[1.1] max-w-xl animate-fade-up">
              Your Personal Cosmic Blueprint for Success
            </h1>
            <div className="space-y-6 mb-8">
              <p className="text-lg text-primary-dark/80 font-mono leading-relaxed max-w-lg animate-fade-up">
                Unlock the power of celestial intelligence to make confident decisions in your career, relationships, and personal growth.
              </p>
              
              {/* Enhanced Benefits List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-accent-sage mt-1" />
                  <div>
                    <h3 className="font-medium">Career Timing</h3>
                    <p className="text-sm text-primary-dark/70">Know your optimal moments for career moves</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                  <Users className="w-5 h-5 text-accent-sage mt-1" />
                  <div>
                    <h3 className="font-medium">Relationship Insights</h3>
                    <p className="text-sm text-primary-dark/70">Understand compatibility patterns</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                  <Clock className="w-5 h-5 text-accent-sage mt-1" />
                  <div>
                    <h3 className="font-medium">Timing Mastery</h3>
                    <p className="text-sm text-primary-dark/70">Choose perfect moments for decisions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-accent-sage mt-1" />
                  <div>
                    <h3 className="font-medium">Personal Growth</h3>
                    <p className="text-sm text-primary-dark/70">Align with your highest potential</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
              <Button 
                onClick={scrollToForm}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-lg font-mono relative overflow-hidden group"
              >
                <span className="relative z-10">Get Your Cosmic Blueprint</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-sage/20 to-accent-sand/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.open('#testimonials', '_self')}
                className="border-2 border-primary/20 hover:border-primary/40 px-8 py-6 text-lg rounded-lg font-mono"
              >
                See Success Stories
              </Button>
            </div>
          </div>

          {/* Right Column - Updated Image */}
          <div className="flex-1 relative md:-translate-y-12">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1470813740244-df37b8c1edcb"
                alt="Starry night sky representing celestial guidance" 
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