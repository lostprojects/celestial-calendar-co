import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { User, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="h-16 fixed top-0 left-0 right-0 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container h-full mx-auto px-4">
        <div className="flex h-full justify-between items-center">
          <Link to="/" className="text-xl font-serif">
            AstroChart
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/account">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Account
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
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
};