import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BirthChartSection } from "@/components/BirthChartSection";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <Hero />
      <BirthChartSection />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;