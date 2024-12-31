import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { AccountDetails } from "@/components/account/AccountDetails";
import { CalendarModule } from "@/components/account/CalendarModule";
import { UpcomingReadingsModule } from "@/components/account/UpcomingReadingsModule";
import { RecentChartsModule } from "@/components/account/RecentChartsModule";
import { CommunityModule } from "@/components/account/CommunityModule";

const Account = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif">
          Welcome, {profileData.full_name || "Friend"}!
        </h1>
        <p className="text-primary/60">Here is your astrological dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <CalendarModule />
          <UpcomingReadingsModule />
        </div>
        
        <div className="space-y-6">
          <RecentChartsModule />
        </div>
        
        <div className="space-y-6">
          <CommunityModule />
        </div>
      </div>

      <div className="mt-12">
        {user && <AccountDetails userId={user.id} initialData={profileData} />}
      </div>
    </div>
  );
};

export default Account;