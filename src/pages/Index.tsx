import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BirthChartSection } from "@/components/BirthChartSection";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <BirthChartSection />
      <Toaster />
    </div>
  );
};

export default Index;