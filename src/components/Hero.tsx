import { BirthChartForm } from "./BirthChartForm";

export const Hero = () => {
  return (
    <div className="relative min-h-screen pt-16 flex items-center">
      <div className="celestial-bg animate-float" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6 text-primary-dark">
            Discover Your Celestial Path
          </h1>
          <p className="text-lg text-primary-dark/80 mb-8">
            Unlock the wisdom of the stars with personalized astrological insights tailored to your unique birth chart.
          </p>
        </div>
        
        <BirthChartForm />
      </div>
    </div>
  );
};