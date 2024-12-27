import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

export const BirthChartForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  });
  
  const { toast } = useToast();
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries as ["places"],
  });

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setFormData(prev => ({
          ...prev,
          birthPlace: place.formatted_address
        }));
      }
    }
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Birth Chart Request Received",
      description: "We'll calculate your personal astrology chart shortly.",
    });
  };

  if (loadError) {
    console.error("Places API failed to load");
    return <div>Error loading places API</div>;
  }

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
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary-dark">Birth Place</label>
        {isLoaded ? (
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={handlePlaceSelect}
          >
            <Input
              type="text"
              value={formData.birthPlace}
              onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
              className="w-full"
              placeholder="Start typing a city..."
            />
          </Autocomplete>
        ) : (
          <Input
            type="text"
            value={formData.birthPlace}
            className="w-full"
            placeholder="Loading places..."
            disabled
          />
        )}
      </div>
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
        Calculate My Birth Chart
      </Button>
    </form>
  );
};