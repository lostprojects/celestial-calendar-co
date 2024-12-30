import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-primary/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/7e072194-4028-41bf-b0e7-3b1372099ff2.png" 
            alt="Celestial Logo" 
            className="h-8"
          />
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-primary-dark/80 hover:text-primary transition-colors">Features</a>
          <a href="#about" className="text-primary-dark/80 hover:text-primary transition-colors">About</a>
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};