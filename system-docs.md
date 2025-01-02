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

### src/logging/astro/time-logging.ts
- **Purpose**: Logs time-related calculations and conversions
- **Dependencies**: moment-timezone
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with comprehensive time logging functions

### src/logging/astro/position-logging.ts
- **Purpose**: Logs celestial position calculations
- **Dependencies**: None
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with sun and moon position logging

### src/logging/astro/zodiac-logging.ts
- **Purpose**: Logs zodiac sign calculations and final positions
- **Dependencies**: None
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with zodiac position logging

### src/logging/astro/coordinate-logging.ts
- **Purpose**: Logs geographical and astronomical coordinate calculations
- **Dependencies**: None
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with coordinate calculation logging

### src/logging/utils/log-formatter.ts
- **Purpose**: Provides utility functions for formatting log output
- **Dependencies**: None
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with formatting utilities

### src/logging/utils/types.ts
- **Purpose**: TypeScript interfaces for logging data structures
- **Dependencies**: None
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with logging type definitions
