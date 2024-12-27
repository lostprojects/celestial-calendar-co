import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Toaster />
    </div>
  );
};

export default Index;