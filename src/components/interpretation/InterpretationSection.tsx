import React from "react";
import { Star, Heart, Gem, Leaf } from "lucide-react";

interface InterpretationSectionProps {
  interpretation: string;
}

export function InterpretationSection({ interpretation }: InterpretationSectionProps) {
  return (
    <section className="mt-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background-sand/50 to-transparent opacity-50 rounded-3xl" />
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white/80 backdrop-blur-md shadow-xl border border-accent-orange/10">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-px flex-1 bg-accent-orange/20" />
            <h3 className="text-3xl font-serif font-bold text-primary-dark">
              Your Personal Reading
            </h3>
            <div className="h-px flex-1 bg-accent-orange/20" />
          </div>
          <div className="prose prose-slate max-w-none space-y-8">
            {interpretation.split('\n\n').map((section, index) => {
              const icons = [
                <Star key="star" className="w-6 h-6 text-accent-orange" />,
                <Heart key="heart" className="w-6 h-6 text-accent-lightpalm" />,
                <Gem key="gem" className="w-6 h-6 text-accent-palm" />,
                <Leaf key="leaf" className="w-6 h-6 text-accent-lightorange" />
              ];
              const titles = [
                "Your Cosmic Essence",
                "Emotional Landscape",
                "Life Path & Purpose",
                "Personal Growth"
              ];
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {icons[index]}
                    <h4 className="text-xl font-serif font-semibold text-primary-dark/90">
                      {titles[index]}
                    </h4>
                  </div>
                  <p className="text-primary-dark/80 leading-relaxed text-base font-mono">
                    {section}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}