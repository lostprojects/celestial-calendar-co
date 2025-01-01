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
      parameters: "BirthChartData object (date, time, location)",
      returns: "BirthChartResult object (sun, moon, rising positions)",
      usage: ["BirthChartForm component", "Chart calculation"],
    },
    {
      name: "calculateJulianDay",
      description: "Converts date/time to Julian Day",
      location: "src/utils/astro-core.ts",
      parameters: "UTC date string, UTC time string",
      returns: "number (Julian Day)",
      usage: ["Birth chart calculations"],
    },
    {
      name: "calculateLunarParallax",
      description: "Calculates lunar parallax correction",
      location: "src/utils/astro-core.ts",
      parameters: "moonDistance (number)",
      returns: "number (parallax correction)",
      usage: ["Moon position calculations"],
    },
    {
      name: "calculateGeocentricLatitude",
      description: "Converts geographic latitude to geocentric latitude",
      location: "src/utils/astro-core.ts",
      parameters: "geographic latitude (number)",
      returns: "number (geocentric latitude in radians)",
      usage: ["Birth chart calculations"],
    },
    {
      name: "calculateMoonLongitude",
      description: "Calculates Moon's ecliptic longitude",
      location: "src/utils/astro-core.ts",
      parameters: "moonPos object, obliquity (radians)",
      returns: "number (Moon longitude in radians)",
      usage: ["Moon position calculations"],
    },
    {
      name: "CalendarGregorianToJD",
      description: "Converts Gregorian calendar date to Julian Day",
      location: "astronomia/julian",
      parameters: "year, month, day",
      returns: "number (Julian Day)",
      usage: ["Birth chart calculations"],
    },
    {
      name: "apparentLongitude",
      description: "Calculates Sun's apparent longitude",
      location: "astronomia/solar",
      parameters: "Julian Ephemeris Day",
      returns: "number (apparent longitude in radians)",
      usage: ["Sun position calculations"],
    },
    {
      name: "position",
      description: "Calculates Moon's position",
      location: "astronomia/moonposition",
      parameters: "Julian Ephemeris Day",
      returns: "object (Moon's position data)",
      usage: ["Moon position calculations"],
    },
    {
      name: "apparent",
      description: "Calculates apparent sidereal time",
      location: "astronomia/sidereal",
      parameters: "Julian Ephemeris Day",
      returns: "number (sidereal time in hours)",
      usage: ["Rising sign calculations"],
    },
    {
      name: "generateCssVariables",
      description: "Generates CSS variables from theme configuration",
      location: "src/theme/theme.ts",
      parameters: "theme: ThemeConfig",
      returns: "string (CSS variable declarations)",
      usage: ["Theme configuration", "Global CSS styling"],
    },
    {
      name: "generateTailwindConfig",
      description: "Generates Tailwind configuration from theme object",
      location: "src/theme/theme.ts",
      parameters: "theme: ThemeConfig",
      returns: "object (Tailwind configuration object)",
      usage: ["Tailwind configuration", "Theme integration"],
    },
    {
      name: "getAIInterpretation",
      description: "Generates AI interpretation of birth chart",
      location: "src/components/chart-results/ChartResults.tsx",
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
      usage: ["After chart calculation"],
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
