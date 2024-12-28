import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import opencage from 'opencage-api-client';
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";

const OPENCAGE_KEY_STORAGE = 'opencage_api_key';

interface LocationSearchProps {
  onLocationSelect: (location: { place: string; lat: number; lng: number }) => void;
}

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ place_name: string; lat: number; lng: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
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
  );
};