import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BirthChartSection } from "@/components/BirthChartSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <BirthChartSection />
    </div>
  );
};

export default Index;