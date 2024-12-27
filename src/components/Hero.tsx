import { Button } from "@/components/ui/button";

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
          <div className="flex-1 text-left space-y-6">
            {/* Logo */}
            <div className="mb-8">
              <h3 className="font-serif text-2xl tracking-wider text-primary">
                Celestial
              </h3>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 text-primary/80 font-mono text-sm mb-8">
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
              <span>Joined by 10,000+ ambitious women</span>
            </div>

            {/* Main Content */}
            <h1 className="text-5xl md:text-6xl font-serif font-medium mb-4 text-primary-dark leading-[1.1]">
              Align Your Life with Cosmic Intelligence
            </h1>
            <p className="text-lg text-primary-dark/80 font-mono leading-relaxed mb-8 max-w-lg">
              Join thousands of successful women using astrology to make better decisions, 
              find their perfect timing, and unlock their full potential.
            </p>
            
            <Button 
              onClick={scrollToForm}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-lg font-mono"
            >
              Get Your Personalized Roadmap
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="flex-1 relative">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" 
                alt="Successful woman using laptop" 
                className="w-full h-[600px] rounded-2xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-accent-sage/20 to-transparent mix-blend-overlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};