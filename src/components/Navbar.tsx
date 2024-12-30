const Navbar = () => {
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
          <span className="text-primary-dark/80">Features</span>
          <span className="text-primary-dark/80">About</span>
          <button className="border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-all duration-300">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;