import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LocationSearch } from "./LocationSearch";
import { BirthChartDisplay } from "./BirthChartDisplay";
import moment from "moment-timezone";

interface BirthChartResult {
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
}

export const BirthChartForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    timeZone: moment.tz.guess(), // Get user's local timezone as default
  });
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [birthChart, setBirthChart] = useState<BirthChartResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      toast({
        title: "Error",
        description: "Please select a valid location from the suggestions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-birth-chart', {
        body: {
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          timeZone: formData.timeZone,
        },
      });

      if (error) throw error;

      setBirthChart(data);
      toast({
        title: "Success",
        description: "Your birth chart has been calculated!",
      });
    } catch (error) {
      console.error('Birth chart calculation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to calculate birth chart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="birth-chart-form w-full max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-dark">Full Name</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-dark">Birth Date</label>
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            className="w-full"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-dark">Birth Time (24-hour)</label>
          <Input
            type="time"
            value={formData.birthTime}
            onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
            className="w-full"
            required
          />
        </div>
        
        <LocationSearch
          birthPlace={formData.birthPlace}
          onBirthPlaceChange={(value) => setFormData({ ...formData, birthPlace: value })}
          onLocationSelect={(location) => setSelectedLocation(location)}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-dark">Time Zone</label>
          <select
            value={formData.timeZone}
            onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
            required
          >
            {moment.tz.names().map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Calculating..." : "Calculate My Birth Chart"}
        </Button>
      </form>

      {birthChart && <BirthChartDisplay results={birthChart} />}
    </div>
  );
};