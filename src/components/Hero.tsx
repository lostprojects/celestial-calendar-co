import { Button } from "@/components/ui/button";
import { Star, CheckCircle } from "lucide-react";

export const Hero = () => {
  const scrollToForm = () => {
    const form = document.querySelector('#birth-chart-section');
    form?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      <div className="celestial-bg" />
      
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="flex-1 text-left space-y-6 transform md:translate-y-12">
            {/* Social Proof */}
            <div className="flex flex-col space-y-4 mb-8">
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
                <span className="text-primary/80 font-mono text-sm">Joined by 10,000+ ambitious women</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-primary/80">Trusted by Fortune 500 executives</span>
              </div>
            </div>

            {/* Main Content */}
            <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4 text-primary-dark leading-[1.1] max-w-xl">
              Align Your Life with Cosmic Intelligence
            </h1>
            <div className="space-y-4 mb-8">
              <p className="text-lg text-primary-dark/80 font-mono leading-relaxed max-w-lg">
                Discover your unique cosmic blueprint and unlock your full potential with personalized astrological insights.
              </p>
              <ul className="space-y-2">
                {[
                  'Personalized career timing',
                  'Relationship compatibility insights',
                  'Daily decision guidance'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-primary-dark/80">
                    <CheckCircle className="w-4 h-4 text-accent-sage" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={scrollToForm}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-lg font-mono relative overflow-hidden group"
            >
              <span className="relative z-10">Get Your Personalized Roadmap</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-sage/20 to-accent-sand/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="flex-1 relative md:-translate-y-12">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80" 
                alt="Woman in meditation pose" 
                className="w-full h-[600px] rounded-2xl object-cover object-[75%_center]"
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-accent-sage/20 to-transparent mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};