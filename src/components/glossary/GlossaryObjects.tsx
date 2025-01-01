import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const GlossaryObjects = () => {
  const objects = [
    {
      name: "ZODIAC_SIGNS",
      type: "Array<string>",
      location: "src/utils/astro-core.ts",
      description: "Array of zodiac sign names in order",
      usage: ["Birth chart calculations", "Sign determinations"],
    },
    {
      name: "BirthChartData",
      type: "Interface",
      location: "src/utils/astro-utils.ts",
      description: "Type definition for birth chart input data",
      usage: ["Form data structure", "API requests"],
    },
    {
      name: "BirthChartResult",
      type: "Interface",
      location: "src/utils/astro-utils.ts",
      description: "Type definition for calculated chart results",
      usage: ["Chart calculations", "Display components"],
    },
    {
      name: "ThemeConfig",
      type: "Interface",
      location: "src/theme/theme.ts",
      description: "Type definition for the app's theme configuration",
      usage: [
        "Theme generation",
        "CSS variable generation",
        "Tailwind configuration",
        "Style guide customization"
      ],
    },
    {
      name: "defaultTheme",
      type: "ThemeConfig",
      location: "src/theme/theme.ts",
      description: "Default theme configuration object with colors, fonts, spacing, and animations",
      usage: [
        "Base theme configuration",
        "Style guide defaults",
        "CSS variable generation",
        "Tailwind configuration"
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Object</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {objects.map((obj) => (
              <TableRow key={obj.name}>
                <TableCell className="font-mono text-sm">{obj.name}</TableCell>
                <TableCell className="font-mono text-sm">{obj.type}</TableCell>
                <TableCell className="font-mono text-xs">{obj.location}</TableCell>
                <TableCell>{obj.description}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {obj.usage.map((use, index) => (
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