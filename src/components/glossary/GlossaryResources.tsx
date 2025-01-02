import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const GlossaryResources = () => {
  const resources = [
    {
      name: "OpenCage Geocoding API",
      type: "External API",
      description: "Geocoding service for location coordinates",
      usage: ["Location search in birth chart form"],
      frequency: "On every location search",
    },
    {
      name: "OpenAI API",
      type: "External API",
      description: "AI service for chart interpretations",
      usage: ["Chart interpretation generation"],
      frequency: "Once per chart calculation",
    },
    {
      name: "Supabase Database",
      type: "Database",
      description: "Storage for user data and birth charts",
      usage: ["User profiles", "Birth charts", "Interpretations"],
      frequency: "Regular CRUD operations",
    },
    {
      name: "Astronomia Library",
      type: "NPM Package",
      description: "Astronomical calculation library",
      usage: ["Birth chart calculations", "Celestial positions"],
      frequency: "During all astronomical calculations",
    },
    {
      name: "Moment Timezone",
      type: "NPM Package",
      description: "Timezone handling library",
      usage: ["Birth time conversions", "UTC calculations"],
      frequency: "During chart calculations",
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Frequency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.name}>
                <TableCell className="font-mono text-sm">{resource.name}</TableCell>
                <TableCell>{resource.type}</TableCell>
                <TableCell>{resource.description}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {resource.usage.map((use, index) => (
                      <li key={index} className="text-sm">{use}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{resource.frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};