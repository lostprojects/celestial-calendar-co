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
  - Enhanced components and functions documentation
  - Added astronomia library function documentation
  - Added visual elements documentation
  - Added theming system documentation

### src/components/glossary/*
- **Purpose**: Individual glossary section components
- **Dependencies**: @/components/ui/table
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Created GlossaryFunctions.tsx
  - Created GlossaryComponents.tsx
  - Created GlossaryObjects.tsx
  - Created GlossaryResources.tsx
  - Enhanced documentation coverage
  - Added astronomia library functions
  - Added visual components documentation
  - Added theme configuration documentation
  - Added CSS variable generation documentation

### src/components/chart-results/ChartResults.tsx
- **Purpose**: Main component for displaying birth chart results and handling AI interpretation
- **Dependencies**: 
  - @supabase/auth-helpers-react
  - lucide-react
  - @/hooks/use-toast
  - SaveChartLogic.ts
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Refactored from single file to modular structure
  - Added success toast for saved charts
  - Enhanced error handling and logging
  - Split database operations into separate SaveChartLogic.ts file

### src/components/chart-results/SaveChartLogic.ts
- **Purpose**: Handles database operations for saving birth charts and interpretations
- **Dependencies**: 
  - @supabase/auth-helpers-react
  - @supabase/supabase-js
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation
  - Implemented saveBirthChart and saveInterpretation functions
  - Added detailed logging for debugging
  - Enhanced error handling

### src/components/birthchart-form.tsx
- **Purpose**: Main React component for birth chart form and database logic
- **Dependencies**: @supabase/auth-helpers-react
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added user_id to birth chart creation
  - Enhanced error handling for database operations
  - Added authentication integration

### src/components/account/BirthChartSummaryModule.tsx
- **Purpose**: Display component for user's most recent birth chart
- **Dependencies**: @supabase/auth-helpers-react, lucide-react
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Updated to fetch birth charts directly using user_id
  - Added debug information display
  - Enhanced error handling and loading states

### src/utils/astro-utils.ts
- **Purpose**: Handles all astronomical calculations for birth chart positions
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial file creation with purpose documentation

### src/components/chart-results.tsx
- **Purpose**: Display component for birth chart calculation results
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added AI interpretation display section
  - Enhanced typography for interpretation text

### src/main.tsx
- **Purpose**: Entry point of the application, renders the root App component
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial setup with React root rendering

### src/App.tsx
- **Purpose**: Root component that handles routing and global app structure
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added authentication routes
  - Integrated Supabase SessionContextProvider
  - Added account management page route

### src/components/Navbar.tsx
- **Purpose**: Navigation bar component
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added authentication-aware navigation
  - Account management link
  - Dynamic sign in/out buttons

### src/integrations/supabase/client.ts
- **Purpose**: Supabase client configuration
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial Supabase client setup

### Database Schema
#### birth_charts table
- **Purpose**: Stores user birth chart information
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added user_id column with foreign key to profiles
  - Added RLS policies for user data access

#### profiles table
- **Purpose**: Stores user profile information
- **Last Updated**: March 19, 2024
- **Columns**:
  - id (uuid, references auth.users)
  - username (text, unique)
  - avatar_url (text)
  - created_at (timestamp)


### src/theme/theme.ts
- **Purpose**: Centralized theme configuration and utilities
- **Dependencies**: None
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with theme configuration
  - Added CSS variables generation
  - Added Tailwind config generation
  - Added theme types and interfaces

### src/components/style-guide/ThemeSection.tsx
- **Purpose**: Theme configuration UI in the style guide
- **Dependencies**: @/theme/theme, @/components/ui/*
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial creation with theme preview and editing capabilities
  - Added color picker and input fields
  - Added typography preview
  - Added spacing visualization
  - Added animation preview
