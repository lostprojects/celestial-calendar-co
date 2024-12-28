import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const BirthChartForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
  });
  const { toast } = useToast();

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
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary-dark">Birth Place</label>
        <Input
          type="text"
          value={formData.birthPlace}
          onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
          className="w-full"
          placeholder="City, Country"
        />
      </div>
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
        Calculate My Birth Chart
      </Button>
    </form>
  );
};