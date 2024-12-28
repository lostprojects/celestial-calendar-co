import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BirthChartInputProps {
  formData: {
    birthDate: string;
    birthTime: string;
    timeZone: string;
    latitude: string;
    longitude: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BirthChartInput: React.FC<BirthChartInputProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input
          id="birthDate"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthTime">Birth Time (24-hour format)</Label>
        <Input
          id="birthTime"
          type="time"
          name="birthTime"
          value={formData.birthTime}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeZone">Time Zone (e.g., America/New_York)</Label>
        <Input
          id="timeZone"
          type="text"
          name="timeZone"
          value={formData.timeZone}
          onChange={handleChange}
          placeholder="America/New_York"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          type="text"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          placeholder="40.7128"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          id="longitude"
          type="text"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          placeholder="-74.0060"
          required
        />
      </div>
    </div>
  );
};