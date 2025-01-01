import React from "react";
import { Star, Heart, Gem, Leaf, Sparkles } from "lucide-react";
import { useUser } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface InterpretationSectionProps {
  interpretation: string;
}

export function InterpretationSection({ interpretation }: InterpretationSectionProps) {
  const user = useUser();
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
          
          <div className={`prose prose-slate max-w-none space-y-12 ${!user ? 'blur-sm' : ''}`}>
            {interpretation.split('\n\n').map((section, index) => {
              const icons = [
                <Star key="star" className="w-8 h-8 text-accent-orange" />,
                <Heart key="heart" className="w-8 h-8 text-accent-lightpalm" />,
                <Gem key="gem" className="w-8 h-8 text-accent-palm" />,
                <Leaf key="leaf" className="w-8 h-8 text-accent-lightorange" />,
                <Sparkles key="sparkles" className="w-8 h-8 text-accent-orange" />
              ];
              const titles = [
                "Your Cosmic Essence",
                "Emotional Landscape",
                "Life Path & Purpose",
                "Personal Growth",
                "Future Potential"
              ];
              
              return (
                <div key={index} className="space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    {icons[index]}
                    <h4 className="text-2xl font-serif font-semibold text-primary-dark/90 text-center">
                      {titles[index]}
                    </h4>
                  </div>
                  <p className="text-primary-dark/80 leading-relaxed text-sm font-mono max-w-2xl mx-auto">
                    {section.replace(/^###\s*/g, '')}
                  </p>
                </div>
              );
            })}
          </div>

          {!user && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent backdrop-blur-[1px] rounded-3xl" />
              <div className="relative z-20 text-center max-w-lg p-6 mt-[-4rem]">
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