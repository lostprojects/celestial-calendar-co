import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-6 border-t">
      <div className="container mx-auto px-4 flex justify-between items-center text-sm text-primary-dark/60">
        <div>
          © {currentYear} Celestial Calendar Co. All rights reserved.
        </div>
        <Link to="/style-guide" className="hover:text-primary-dark transition-colors">
          Style Guide
        </Link>
      </div>
    </footer>
  );
};