import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";

const Auth = () => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="birth-chart-form max-w-md mx-auto">
        <h2 className="text-2xl font-serif mb-6 text-center">Welcome Back</h2>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                background: "#403E43",
                color: "white",
                borderRadius: "0.5rem",
              },
              anchor: {
                color: "#403E43",
              },
              input: {
                borderRadius: "0.5rem",
              },
            },
          }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Auth;