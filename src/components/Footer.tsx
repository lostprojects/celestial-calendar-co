export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto py-6 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-primary-dark/60">
        © {currentYear} Celestial Calendar Co. All rights reserved.
      </div>
    </footer>
  );
};