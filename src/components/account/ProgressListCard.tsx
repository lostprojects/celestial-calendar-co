import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Clock, Crown, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProgress {
  hasWesternChart: boolean;
  hasVedicChart: boolean;
  hasMBTI: boolean;
  isSubscribed: boolean;
}

export const ProgressListCard = () => {
  const user = useUser();
  const { toast } = useToast();
  const [progress, setProgress] = useState<UserProgress>({
    hasWesternChart: false,
    hasVedicChart: false,
    hasMBTI: false,
    isSubscribed: false,
  });

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) return;

      try {
        // Check Western birth chart
        const { data: birthCharts } = await supabase
          .from("birth_charts")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        // Check MBTI results
        const { data: mbtiResults } = await supabase
          .from("myers_briggs_results")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        // Get subscription status
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_subscribed")
          .eq("id", user.id)
          .single();

        setProgress({
          hasWesternChart: birthCharts && birthCharts.length > 0,
          hasVedicChart: false, // Coming soon
          hasMBTI: mbtiResults && mbtiResults.length > 0,
          isSubscribed: profile?.is_subscribed || false,
        });
      } catch (error) {
        toast({
          title: "Error fetching progress",
          description: "Failed to load your progress. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchUserProgress();
  }, [user, toast]);

  return (
    <Card className="bg-white/80 backdrop-blur-md shadow-lg border border-[#403E43]/10">
      <CardHeader>
        <CardTitle className="text-lg font-serif text-accent-lightpalm font-bold flex items-center gap-2">
          <ListTodo className="h-5 w-5" />
          Your Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Western Chart */}
          <div className="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-accent-lightpalm/5">
            <Checkbox
              checked={progress.hasWesternChart}
              className="mt-1"
              disabled
            />
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none flex items-center gap-2">
                Western Birth Chart
                {progress.hasWesternChart && (
                  <span className="text-xs text-accent-lightpalm">Complete!</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Discover your Western astrological profile
              </div>
            </div>
          </div>

          {/* Vedic Chart */}
          <div className="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-accent-lightpalm/5">
            <Checkbox checked={progress.hasVedicChart} className="mt-1" disabled />
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none flex items-center gap-2">
                Vedic Birth Chart
                <Clock className="h-3 w-3 text-accent-orange" />
                <span className="text-xs text-accent-orange">Coming Soon</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Explore your Vedic astrological insights
              </div>
            </div>
          </div>

          {/* MBTI */}
          <div className="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-accent-lightpalm/5">
            <Checkbox checked={progress.hasMBTI} className="mt-1" disabled />
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none flex items-center gap-2">
                Myers-Briggs Assessment
                <Brain className="h-3 w-3 text-accent-orange" />
                <span className="text-xs text-accent-orange">Coming Soon</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Understand your personality type
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-accent-lightpalm/5">
            <Checkbox checked={progress.isSubscribed} className="mt-1" disabled />
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none flex items-center gap-2">
                Premium Subscription
                <Crown className="h-3 w-3 text-accent-orange" />
              </div>
              <div className="text-xs text-muted-foreground">
                Unlock advanced features and insights
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};