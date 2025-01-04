import React from "react";
import { Star, Heart, Gem, Leaf, Sparkles, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

const ICON_MAP: Record<string, LucideIcon> = {
  star: Star,
  heart: Heart,
  gem: Gem,
  leaf: Leaf,
  sparkles: Sparkles
};

interface InterpretationSectionProps {
  interpretation: {
    content: string;
    sections: {
      title: string;
      content: string;
      icon?: string;
    }[];
  };
  isBlurred?: boolean;
}

export function InterpretationSection({ interpretation, isBlurred = false }: InterpretationSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="mt-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background-sand/50 to-transparent opacity-50 rounded-3xl" />
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white/80 backdrop-blur-md shadow-xl relative">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-px flex-1 bg-accent-orange/20" />
            <h3 className="text-3xl font-serif font-bold text-primary-dark">
              Your Personal Reading
            </h3>
            <div className="h-px flex-1 bg-accent-orange/20" />
          </div>
          
          <div className="prose prose-slate max-w-none space-y-12 relative">
            {interpretation.sections.map((section, index) => {
              const IconComponent = section.icon ? ICON_MAP[section.icon] : Star;
              
              return (
                <div key={index} className="space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    <IconComponent className={`w-8 h-8 ${
                      index % 2 === 0 ? 'text-accent-orange' : 'text-accent-lightpalm'
                    }`} />
                    <h4 className="text-2xl font-serif font-semibold text-primary-dark/90 text-center">
                      {section.title}
                    </h4>
                  </div>
                  <p className="text-primary-dark/80 leading-relaxed text-sm font-mono max-w-2xl mx-auto">
                    {section.content}
                  </p>
                </div>
              );
            })}
          </div>

          {isBlurred && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white/95 backdrop-blur-[2px] rounded-3xl" 
                   style={{
                     maskImage: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5) 15%, rgba(0, 0, 0, 1) 30%)',
                     WebkitMaskImage: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5) 15%, rgba(0, 0, 0, 1) 30%)'
                   }}
              />
              <div className="relative z-20 text-center max-w-lg p-6 mt-[-12rem]">
                <h4 className="text-2xl font-serif font-bold text-primary-dark mb-4">
                  Unlock Your Complete Cosmic Journey
                </h4>
                <p className="text-primary-dark/80 mb-6 font-mono">
                  Your stars hold profound wisdom waiting to be discovered. Sign up now to receive your full personalized reading and begin your transformative astrological journey.
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-accent-orange hover:bg-accent-orange/90 text-white px-8 py-6 text-lg rounded-lg font-mono relative overflow-hidden group"
                >
                  <span className="relative z-10 font-bold">
                    Begin Your Cosmic Journey
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-orange/90 to-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
