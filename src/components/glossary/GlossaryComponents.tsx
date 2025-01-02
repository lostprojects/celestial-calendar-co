import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const GlossaryComponents = () => {
  const components = [
    {
      name: "BirthChartForm",
      description: "Main form for birth chart data entry",
      location: "src/components/birthchart-form.tsx",
      props: "None",
      usage: ["Main page birth chart creation"],
      variations: ["Default form layout"],
    },
    {
      name: "ChartResults",
      description: "Displays birth chart calculation results",
      location: "src/components/chart-results/ChartResults.tsx",
      props: "mainWestern, mainVedic, birthData, interpretation",
      usage: ["After birth chart calculation"],
      variations: ["With/without interpretation"],
    },
    {
      name: "Hero",
      description: "Hero section with main call-to-action",
      location: "src/components/Hero.tsx",
      props: "None",
      usage: ["Homepage hero section"],
      variations: ["Default layout"],
    },
    {
      name: "BirthSignCard",
      description: "Displays individual birth sign information",
      location: "src/components/birth-signs/BirthSignCard.tsx",
      props: "sign, position, icon, iconColor, degrees, minutes, isOpen, description",
      usage: ["Within ChartResults"],
      variations: ["Sun, Moon, Rising sign variants"],
    },
    {
      name: "LocationSearch",
      description: "Autocomplete location search input",
      location: "src/components/LocationSearch.tsx",
      props: "onLocationSelect",
      usage: ["BirthChartForm"],
      variations: ["Default search input"],
    },
    {
      name: "AccountDetails",
      description: "User account information display and management",
      location: "src/components/account/AccountDetails.tsx",
      props: "user",
      usage: ["Account page"],
      variations: ["Default view"],
    },
    {
      name: "BirthChartSummaryModule",
      description: "Summary view of user's most recent birth chart",
      location: "src/components/account/BirthChartSummaryModule.tsx",
      props: "userId",
      usage: ["Account dashboard"],
      variations: ["Loading state", "Error state", "Data view"],
    },
    {
      name: "InterpretationSection",
      description: "Displays AI-generated chart interpretations",
      location: "src/components/interpretation/InterpretationSection.tsx",
      props: "chartData, interpretation",
      usage: ["Chart results page"],
      variations: ["Loading state", "With interpretation"],
    },
    {
      name: "Footer",
      description: "Application footer with navigation links",
      location: "src/components/Footer.tsx",
      props: "None",
      usage: ["All pages"],
      variations: ["Default layout"],
    },
    {
      name: "Navbar",
      description: "Main navigation bar",
      location: "src/components/Navbar.tsx",
      props: "None",
      usage: ["All pages"],
      variations: ["Authenticated", "Unauthenticated"],
    },
    {
      name: "BirthChartSection",
      description: "Container for birth chart form and results",
      location: "src/components/BirthChartSection.tsx",
      props: "None",
      usage: ["Homepage"],
      variations: ["Default layout"],
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Props</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Variations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((component) => (
              <TableRow key={component.name}>
                <TableCell className="font-mono text-sm">{component.name}</TableCell>
                <TableCell>{component.description}</TableCell>
                <TableCell className="font-mono text-xs">{component.location}</TableCell>
                <TableCell className="font-mono text-xs">{component.props}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {component.usage.map((use, index) => (
                      <li key={index} className="text-sm">{use}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {component.variations.map((variation, index) => (
                      <li key={index} className="text-sm">{variation}</li>
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