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

### src/utils/astro-core.ts
- **Purpose**: Core astronomical calculations and utilities
- **Dependencies**: astronomia
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added ASTRONOMICAL_CONSTANTS object for better organization
  - Enhanced error handling and validation
  - Added structured logging for debugging
  - Added CelestialPosition interface
  - Added normalizeRadians utility function
  - Improved type safety with const assertions
