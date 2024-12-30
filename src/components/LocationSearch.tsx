import { useState } from "react";
import { Input } from "@/components/ui/input";
import opencage from 'opencage-api-client';
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LocationSearchProps {
  onLocationSelect: (location: { place: string; lat: number; lng: number }) => void;
}

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ place_name: string; lat: number; lng: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const debouncedSearch = useDebounce(async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Get the OpenCage API key from Supabase secrets
      const { data: secretData, error: secretError } = await supabase.functions.invoke('get-config', {
        body: { key: 'OPENCAGE_API_KEY' }
      });

      if (secretError || !secretData?.value) {
        throw new Error('Failed to retrieve OpenCage API key');
      }

      const result = await opencage.geocode({
        q: searchTerm,
        key: secretData.value,
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
        title: "Location Search Error",
        description: "Unable to fetch location suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion: { place_name: string; lat: number; lng: number }) => {
    onLocationSelect({
      place: suggestion.place_name,
      lat: suggestion.lat,
      lng: suggestion.lng
    });
    setSearchTerm(suggestion.place_name);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-primary-dark">Birth Place</label>
      <Input
        type="text"
        value={searchTerm}
        onChange={handlePlaceChange}
        className={`w-full ${isLoading ? 'opacity-50' : ''}`}
        placeholder="City, Country"
        required
        autoComplete="off"
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-3 top-9">
          <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent" />
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white/95 backdrop-blur-sm border border-primary/10 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-accent-sage/20 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};