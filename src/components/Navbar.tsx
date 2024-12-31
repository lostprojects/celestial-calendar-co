import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@supabase/auth-helpers-react";
import { User } from "lucide-react";

export const Navbar = () => {
  const user = useUser();

  return (
    <nav className="h-16 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-full mx-auto px-4">
        <div className="flex h-full justify-between items-center">
          <Link to="/" className="text-xl font-serif">
            AstroChart
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/account">
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}