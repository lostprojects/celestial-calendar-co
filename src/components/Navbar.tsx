import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-primary/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-serif text-2xl text-primary">Astro</div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-primary-dark/80 hover:text-primary transition-colors">Features</a>
          <a href="#about" className="text-primary-dark/80 hover:text-primary transition-colors">About</a>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Sign In
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
};