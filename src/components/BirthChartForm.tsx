import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import opencage from 'opencage-api-client';
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";

const OPENCAGE_KEY_STORAGE = 'opencage_api_key';

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
  });
  const [suggestions, setSuggestions] = useState<Array<{ place_name: string; lat: number; lng: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [birthChart, setBirthChart] = useState<BirthChartResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem(OPENCAGE_KEY_STORAGE);
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      const key = prompt("Please enter your OpenCage API key (this will be stored in your browser):");
      if (key) {
        localStorage.setItem(OPENCAGE_KEY_STORAGE, key);
        setApiKey(key);
      }
    }
  }, []);
  
  const debouncedSearch = useDebounce(async (searchTerm: string) => {
    if (searchTerm.length < 3 || !apiKey) {
      setSuggestions([]);
      return;
    }

    try {
      const result = await opencage.geocode({
        q: searchTerm,
        key: apiKey,
        limit: 5,
      });

      if (result.results) {
        setSuggestions(result.results.map(r => ({
          place_name: r.formatted,
          lat: r.geometry.lat,
          lng: r.geometry.lng
        })));
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch location suggestions",
        variant: "destructive",
      });
    }
  }, 300);

  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, birthPlace: value });
    setSelectedLocation(null);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion: { place_name: string; lat: number; lng: number }) => {
    setFormData({ ...formData, birthPlace: suggestion.place_name });
    setSelectedLocation({ lat: suggestion.lat, lng: suggestion.lng });
    setShowSuggestions(false);
  };

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
        description: "Failed to calculate birth chart. Please try again.",
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
          <label className="text-sm font-medium text-primary-dark">Birth Time</label>
          <Input
            type="time"
            value={formData.birthTime}
            onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
            className="w-full"
            required
          />
        </div>
        
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-primary-dark">Birth Place</label>
          <Input
            type="text"
            value={formData.birthPlace}
            onChange={handlePlaceChange}
            className="w-full"
            placeholder="City, Country"
            required
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.place_name}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Calculating..." : "Calculate My Birth Chart"}
        </Button>
      </form>

      {birthChart && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Birth Chart Results</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Sun Sign:</span> {birthChart.sunSign}</p>
            <p><span className="font-medium">Moon Sign:</span> {birthChart.moonSign}</p>
            <p><span className="font-medium">Ascendant Sign:</span> {birthChart.ascendantSign}</p>
          </div>
        </div>
      )}
    </div>
  );
};