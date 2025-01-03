import { useEffect, useState } from "react";
import { Sun, Moon, ArrowUp } from "lucide-react";
import { supabase } from "integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { useToast } from "hooks/use-toast";
import { format, parseISO } from "date-fns";

interface BirthChartData {
  sun_sign: string | null;
  moon_sign: string | null;
  ascendant_sign: string | null;
  birth_date: string;
  birth_time: string;
  birth_place: string | null;
}

export const BirthChartSummaryModule = () => {
  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBirthChart = async () => {
      if (!user) {
        console.log("No user found");
        return;
      }

      try {
        console.log("Fetching birth charts for user:", user.id);
        const { data: birthCharts, error: birthChartsError } = await supabase
          .from('birth_charts')
          .select('sun_sign, moon_sign, ascendant_sign, birth_date, birth_time, birth_place')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (birthChartsError) throw birthChartsError;
        
        console.log("Birth charts found:", birthCharts);

        if (birthCharts && birthCharts.length > 0) {
          setChartData(birthCharts[0]);
          console.log("Most recent birth chart:", birthCharts[0]);
        }
      } catch (error) {
        console.error('Error fetching birth chart:', error);
        toast({
          title: "Error",
          description: "Could not load your birth chart data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBirthChart();
  }, [user, toast]);

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
        <h3 className="text-lg font-serif text-accent-lightpalm font-bold mb-4">Loading your birth chart...</h3>
      </div>
    );
  }

  const formatBirthDateTime = () => {
    if (!chartData?.birth_date || !chartData?.birth_time) return null;
    
    // Parse the date and time separately to avoid timezone issues
    const date = format(parseISO(chartData.birth_date), "MMMM d, yyyy");
    const time = chartData.birth_time.slice(0, 5); // Get HH:mm format
    
    // Get only the first part of the location (before the first comma)
    const location = chartData.birth_place ? chartData.birth_place.split(',')[0].trim() : '';
    
    return `${date} at ${time} in ${location}`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
      <h3 className="text-lg font-serif text-accent-lightpalm font-bold mb-1">Your Birth Chart</h3>
      {chartData && (
        <p className="text-sm text-primary/60 font-mono mb-4">
          Born: {formatBirthDateTime()}
        </p>
      )}
      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
          <div className="flex h-8 w-8 items-center justify-center bg-accent-orange/10 rounded-full">
            <Sun className="h-5 w-5 text-accent-orange" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary/60 font-mono">Sun Sign</p>
            <p className="text-base font-serif text-primary-dark">{chartData?.sun_sign || 'Unknown'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
          <div className="flex h-8 w-8 items-center justify-center bg-accent-palm/10 rounded-full">
            <Moon className="h-5 w-5 text-accent-palm" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary/60 font-mono">Moon Sign</p>
            <p className="text-base font-serif text-primary-dark">{chartData?.moon_sign || 'Unknown'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
          <div className="flex h-8 w-8 items-center justify-center bg-accent-lightpalm/10 rounded-full">
            <ArrowUp className="h-5 w-5 text-accent-lightpalm" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary/60 font-mono">Rising Sign</p>
            <p className="text-base font-serif text-primary-dark">{chartData?.ascendant_sign || 'Unknown'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
