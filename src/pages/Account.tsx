import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { AccountDetails } from "@/components/account/AccountDetails";
import { CalendarModule } from "@/components/account/CalendarModule";
import { UpcomingReadingsModule } from "@/components/account/UpcomingReadingsModule";
import { RecentChartsModule } from "@/components/account/RecentChartsModule";
import { CommunityModule } from "@/components/account/CommunityModule";
import { BirthChartSummaryModule } from "@/components/account/BirthChartSummaryModule";
import { Calendar } from "lucide-react";

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

  // Get first name from full name
  const firstName = profileData.full_name?.split(' ')[0] || 'Friend';

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
      <div className="container mx-auto px-4 pt-24 pb-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-primary-dark">
            Welcome, {firstName}!
          </h1>
          <p className="text-primary/60 font-mono">Here is your celestial dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
              <h3 className="text-lg font-serif text-primary-dark mb-4">Upcoming Transits</h3>
              <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
                <div className="flex h-8 w-8 items-center justify-center bg-accent-orange/10 rounded-full">
                  <Calendar className="h-5 w-5 text-accent-orange" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-primary/60 font-mono">Next Transit</p>
                  <p className="text-base font-serif text-primary-dark">Mars enters Aries</p>
                </div>
              </div>
            </div>
            <CalendarModule />
            <UpcomingReadingsModule />
          </div>
          
          <div className="space-y-6">
            <BirthChartSummaryModule />
            <RecentChartsModule />
          </div>
          
          <div className="space-y-6">
            <CommunityModule />
          </div>
        </div>

        <div className="mt-12 bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-[#403E43]/10">
          {user && <AccountDetails userId={user.id} initialData={profileData} />}
        </div>

      </div>
    </div>
  );
};

export default Account;