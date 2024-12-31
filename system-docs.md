# System Documentation

This document tracks all files in the system, their purpose, and updates to their content.

_Last Updated: March 19, 2024_

## File List

### src/utils/astro-utils.ts
- **Purpose**: Handles all astronomical calculations for birth chart positions
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial file creation with purpose documentation

### src/components/birthchart-form.tsx
- **Purpose**: Main React component for birth chart form and database logic
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added AI interpretation integration
  - Connected to generate-astro-advice Edge Function
  - Enhanced error handling for API calls

### src/components/chart-results.tsx
- **Purpose**: Display component for birth chart calculation results
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added AI interpretation display section
  - Enhanced typography for interpretation text

### supabase/functions/generate-astro-advice/index.ts
- **Purpose**: Edge Function for generating AI-powered astrological interpretations
- **Dependencies**: OpenAI API
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial implementation of AI interpretation generation
  - Integration with OpenAI GPT-4o-mini model
  - Added error handling and CORS support

### src/main.tsx
- **Purpose**: Entry point of the application, renders the root App component
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial setup with React root rendering

### src/App.tsx
- **Purpose**: Root component that handles routing and global app structure
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial setup with basic routing

### src/components/BirthChartForm.tsx
- **Purpose**: Form component for collecting birth chart data (name, date, time, location)
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Handles form submission to Supabase
  - Integrates with LocationSearch for place selection
  - Basic form validation

### src/components/BirthChartSection.tsx
- **Purpose**: Container component for the birth chart calculator section
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Layout and styling for the birth chart section
  - Contains BirthChartForm component

### src/components/Hero.tsx
- **Purpose**: Landing page hero section with main call-to-action
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Responsive design implementation
  - Social proof section
  - Features list
  - CTA button linking to form

### src/components/LocationSearch.tsx
- **Purpose**: Location search component using OpenCage API
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Integration with OpenCage geocoding
  - Autocomplete suggestions
  - Coordinates extraction

### src/components/Navbar.tsx
- **Purpose**: Navigation bar component
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Basic navigation structure
  - Logo integration
  - Responsive design

### src/integrations/supabase/client.ts
- **Purpose**: Supabase client configuration
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial Supabase client setup

### src/integrations/supabase/types.ts
- **Purpose**: TypeScript types for Supabase database schema
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Types for birth_charts table

### src/lib/utils.ts
- **Purpose**: Utility functions for className merging
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Added className utility functions

### src/pages/Index.tsx
- **Purpose**: Main landing page component
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Layout structure with Hero and BirthChartSection

### Database Schema
#### birth_charts table
- **Purpose**: Stores user birth chart information
- **Last Updated**: March 19, 2024
- **Columns**:
  - id (uuid)
  - created_at (timestamp)
  - name (text)
  - birth_date (date)
  - birth_time (time)
  - latitude (numeric)
  - longitude (numeric)
  - sun_sign (text, nullable)
  - moon_sign (text, nullable)
  - ascendant_sign (text, nullable)

### Configuration Files
- tailwind.config.ts
- vite.config.ts
- tsconfig.json
- tsconfig.node.json