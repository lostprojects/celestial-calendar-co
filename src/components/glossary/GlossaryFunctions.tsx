import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const GlossaryFunctions = () => {
  const functions = [
    {
      name: "calculateBirthChart",
      description: "Main function for calculating birth chart positions",
      location: "src/utils/astro-utils.ts",
      parameters: "BirthChartData object (date, time, location, timezone)",
      returns: "BirthChartResult object (sun, moon, rising positions with degrees)",
      usage: ["Birth chart calculations", "Chart result display"],
    },
    {
      name: "calculateJulianDay",
      description: "Converts date/time to Julian Day",
      location: "src/utils/astro-core.ts",
      parameters: "UTC date string, UTC time string",
      returns: "number (Julian Day)",
      usage: ["Birth chart calculations", "Ephemeris data processing"],
    },
    {
      name: "calculateLunarParallax",
      description: "Calculates lunar parallax correction",
      location: "src/utils/astro-core.ts",
      parameters: "moonDistance (number)",
      returns: "number (parallax correction in degrees)",
      usage: ["Moon position calculations"],
    },
    {
      name: "calculateGeocentricLatitude",
      description: "Converts geographic latitude to geocentric latitude",
      location: "src/utils/astro-core.ts",
      parameters: "geographic latitude (number)",
      returns: "number (geocentric latitude in radians)",
      usage: ["Birth chart calculations", "Position adjustments"],
    },
    {
      name: "calculateMoonLongitude",
      description: "Calculates Moon's ecliptic longitude",
      location: "src/utils/astro-core.ts",
      parameters: "moonPos object, obliquity (radians)",
      returns: "number (Moon longitude in radians)",
      usage: ["Moon position calculations", "Birth chart calculations"],
    },
    {
      name: "normalizeRadians",
      description: "Normalizes angle to 0-2π range",
      location: "src/utils/astro-core.ts",
      parameters: "angle (radians)",
      returns: "number (normalized angle in radians)",
      usage: ["Position calculations", "Angle normalization"],
    },
    {
      name: "getAIInterpretation",
      description: "Generates AI interpretation of birth chart",
      location: "src/components/interpretation/InterpretationSection.tsx",
      parameters: "BirthChartResult object",
      returns: "Promise<string> (interpretation text)",
      usage: ["Chart interpretation display"],
    },
    {
      name: "saveBirthChart",
      description: "Saves birth chart to database",
      location: "src/components/chart-results/SaveChartLogic.ts",
      parameters: "User object, BirthChartData, BirthChartResult",
      returns: "Promise<string> (chart ID)",
      usage: ["After chart calculation", "User data persistence"],
    },
    {
      name: "determineZodiacSign",
      description: "Determines zodiac sign from longitude",
      location: "src/utils/astro-utils.ts",
      parameters: "longitude (degrees), system ('tropical' | 'sidereal')",
      returns: "string (zodiac sign name)",
      usage: ["Birth chart calculations", "Sign determination"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Function</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Parameters</TableHead>
              <TableHead>Returns</TableHead>
              <TableHead>Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {functions.map((func) => (
              <TableRow key={func.name}>
                <TableCell className="font-mono text-sm">{func.name}</TableCell>
                <TableCell>{func.description}</TableCell>
                <TableCell className="font-mono text-xs">{func.location}</TableCell>
                <TableCell className="font-mono text-xs">{func.parameters}</TableCell>
                <TableCell className="font-mono text-xs">{func.returns}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {func.usage.map((use, index) => (
                      <li key={index} className="text-sm">{use}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};