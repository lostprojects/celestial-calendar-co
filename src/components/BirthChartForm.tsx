import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LocationSearch } from "./LocationSearch";
import { runTests } from "@/utils/test-astro";

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
}

export const BirthChartForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: 0,
    longitude: 0
  });
  
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Run calculations before saving
      const testResults = runTests();
      const { signs } = testResults;

      const { error } = await supabase.from('birth_charts').insert({
        name: formData.name,
        birth_date: formData.birthDate,
        birth_time: formData.birthTime,
        latitude: formData.latitude,
        longitude: formData.longitude,
        sun_sign: signs.sun,
        moon_sign: signs.moon,
        ascendant_sign: signs.rising
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Birth chart data saved successfully.",
      });
    } catch (error) {
      console.error('Error saving birth chart:', error);
      toast({
        title: "Error",
        description: "Failed to save birth chart data",
        variant: "destructive",
      });
    }
  };

  const handleTestClick = () => {
    const results = runTests();
    console.log("Test Results:", results);
    toast({
      title: "Test Results",
      description: `Sun: ${results.signs.sun}, Moon: ${results.signs.moon}, Rising: ${results.signs.rising}`,
    });
  };

  return (
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
        <label className="text-sm font-medium text-primary-dark">Birth Time</label>
        <Input
          type="time"
          value={formData.birthTime}
          onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
          className="w-full"
          required
        />
      </div>
      
      <LocationSearch 
        onLocationSelect={({ place, lat, lng }) => 
          setFormData({ 
            ...formData, 
            birthPlace: place,
            latitude: lat,
            longitude: lng
          })
        }
      />
      
      <Button 
        type="button" 
        onClick={handleTestClick}
        className="w-full bg-secondary hover:bg-secondary/90 text-white mb-4"
      >
        Run Astrological Tests
      </Button>
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
        Save Birth Chart Data
      </Button>
    </form>
  );
};