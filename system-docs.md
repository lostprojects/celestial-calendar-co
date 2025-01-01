# System Documentation

This document tracks all files in the system, their purpose, and updates to their content.

_Last Updated: March 19, 2024_

## File List

### src/pages/Glossary.tsx
- **Purpose**: Displays comprehensive documentation of app components and functions
- **Dependencies**: @/components/ui/tabs
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with tabbed interface
  - Added comprehensive documentation sections

### src/components/glossary/*
- **Purpose**: Individual glossary section components
- **Dependencies**: @/components/ui/table
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Created GlossaryFunctions.tsx
  - Created GlossaryComponents.tsx
  - Created GlossaryObjects.tsx
  - Created GlossaryResources.tsx

### src/components/glossary/GlossaryFunctions.tsx
- **Purpose**: Displays a table of all functions used in the application
- **Dependencies**: @/components/ui/table
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with function documentation

### src/components/glossary/GlossaryComponents.tsx
- **Purpose**: Displays a table of all UI components used in the application
- **Dependencies**: @/components/ui/table
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with component documentation

### src/components/glossary/GlossaryObjects.tsx
- **Purpose**: Displays a table of all reusable objects and constants
- **Dependencies**: @/components/ui/table
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with object documentation

### src/components/glossary/GlossaryResources.tsx
- **Purpose**: Displays a table of all external resources and APIs used
- **Dependencies**: @/components/ui/table
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with resource documentation

### src/App.tsx
- **Purpose**: Root component that handles routing and global app structure
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added authentication routes
  - Integrated Supabase SessionContextProvider
  - Added account management page route
  - Added route for the new Glossary page

### src/components/Footer.tsx
- **Purpose**: Footer component for the application
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added link to the new Glossary page

### src/components/chart-results/ChartResults.tsx
- **Purpose**: Handles all logic for birth chart results display and interpretation
- **Dependencies**: @/utils/astro-utils, @/hooks/use-toast, @supabase/auth-helpers-react
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Separated presentation logic into StyledChartResults.tsx
  - Maintained all existing functionality and logging
  - Restructured for better separation of concerns

### src/components/chart-results/StyledChartResults.tsx
- **Purpose**: Handles presentation layer for birth chart results
- **Dependencies**: @/utils/astro-utils, lucide-react, ../birth-signs/BirthSignCard
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation
  - Extracted presentation logic from ChartResults.tsx
  - Implemented pure presentational component

