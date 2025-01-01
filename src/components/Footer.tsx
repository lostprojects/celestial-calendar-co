import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full py-6 bg-background border-t">
      <div className="container flex flex-col items-center gap-2">
        <nav className="flex gap-4 text-sm text-primary/60">
          <Link to="/glossary" className="hover:text-primary transition-colors">
            Glossary
          </Link>
          <Link to="/style-guide" className="hover:text-primary transition-colors">
            Style Guide
          </Link>
        </nav>
        <p className="text-xs text-primary/60">
          © 2024 All rights reserved.
        </p>
      </div>
    </footer>
  );
};