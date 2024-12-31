import { useEffect, useState } from "react";
import { Sun, Moon, ArrowUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BirthChartData {
  sun_sign: string | null;
  moon_sign: string | null;
  ascendant_sign: string | null;
}

export const BirthChartSummaryModule = () => {
  const [chartData, setChartData] = useState<BirthChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const user = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBirthChart = async () => {
      if (!user) {
        console.log("No user found");
        setDebugInfo({ error: "No user found" });
        return;
      }

      try {
        console.log("Fetching birth charts for user:", user.id);
        const { data: birthCharts, error: birthChartsError } = await supabase
          .from('birth_charts')
          .select('sun_sign, moon_sign, ascendant_sign')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (birthChartsError) throw birthChartsError;
        
        console.log("Birth charts found:", birthCharts);
        setDebugInfo({ birthCharts });

        if (birthCharts && birthCharts.length > 0) {
          setChartData(birthCharts[0]);
          console.log("Most recent birth chart:", birthCharts[0]);
        }
      } catch (error) {
        console.error('Error fetching birth chart:', error);
        setDebugInfo({ error });
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
        <h3 className="text-lg font-serif text-primary-dark mb-4">Loading your birth chart...</h3>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
        <h3 className="text-lg font-serif text-primary-dark mb-4">Your Birth Chart</h3>
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

      {debugInfo && (
        <div className="mt-6 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#403E43]/10">
          <h3 className="text-lg font-serif text-primary-dark mb-4">Debug Information</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>{user?.id || 'No user'}</TableCell>
              </TableRow>
              {debugInfo.birthCharts && (
                <TableRow>
                  <TableCell>Birth Charts Found</TableCell>
                  <TableCell>{debugInfo.birthCharts.length}</TableCell>
                </TableRow>
              )}
              {debugInfo.error && (
                <TableRow>
                  <TableCell>Error</TableCell>
                  <TableCell>{JSON.stringify(debugInfo.error)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};