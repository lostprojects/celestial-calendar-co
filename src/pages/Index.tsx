import { Hero } from "@/components/Hero";
import { BirthChartSection } from "@/components/BirthChartSection";

const Index = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <BirthChartSection />
    </div>
  );
};

export default Index;