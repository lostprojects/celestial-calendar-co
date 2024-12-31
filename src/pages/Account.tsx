import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountDetails } from "@/components/account/AccountDetails";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
            <h1 className="text-3xl font-serif">Preferences</h1>
            <p className="text-sm text-muted-foreground">
              Customize your AstroChart experience.
            </p>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-serif">Security Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account security and authentication preferences.
            </p>
            <div className="pt-6">
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="h-12 px-6 font-mono flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        );
      case "email":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-serif">Notification Preferences</h1>
            <p className="text-sm text-muted-foreground">
              Manage your email notifications and communication preferences.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex w-full">
        <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Account;