import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import opencage from 'opencage-api-client';
import { useDebounce } from "@/hooks/use-debounce";

const OPENCAGE_KEY_STORAGE = 'opencage_api_key';

export const BirthChartForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  });
  const [suggestions, setSuggestions] = useState<Array<{ place_name: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem(OPENCAGE_KEY_STORAGE);
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      // Prompt user to enter API key if not found
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
          place_name: r.formatted
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
    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFormData({ ...formData, birthPlace: suggestion });
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Birth Chart Request Received",
      description: "We'll calculate your personal astrology chart shortly.",
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
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary-dark">Birth Date</label>
        <Input
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary-dark">Birth Time</label>
        <Input
          type="time"
          value={formData.birthTime}
          onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
          className="w-full"
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
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion.place_name)}
              >
                {suggestion.place_name}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
        Calculate My Birth Chart
      </Button>
    </form>
  );
};