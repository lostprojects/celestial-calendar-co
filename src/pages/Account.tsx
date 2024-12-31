import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountDetails } from "@/components/account/AccountDetails";

const Account = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [profileData, setProfileData] = useState({ full_name: "" });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    } else {
      const loadProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (error) {
          toast({
            title: "Error loading profile",
            description: error.message,
            variant: "destructive",
          });
        } else if (data) {
          setProfileData({ full_name: data.full_name || "" });
        }
      };

      loadProfile();
    }
  }, [user, navigate, supabase, toast]);

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

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return user && <AccountDetails userId={user.id} initialData={profileData} />;
      case "settings":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Settings</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Security</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      case "email":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Email Preferences</h3>
            <p className="text-muted-foreground">Coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SidebarProvider>
        <div className="flex min-h-[80vh] w-full gap-8">
          <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 p-6">
            {renderContent()}
            {activeTab === "security" && (
              <div className="mt-8 pt-6 border-t">
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Account;