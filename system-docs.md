# System Documentation

This document tracks all files in the system, their purpose, and updates to their content.

_Last Updated: March 19, 2024_

## File List

### src/pages/Auth.tsx
- **Purpose**: Handles user authentication using Supabase Auth UI
- **Dependencies**: @supabase/auth-ui-react, @supabase/auth-ui-shared
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial implementation of authentication page
  - Integration with Supabase Auth UI
  - Automatic redirect when user is authenticated

### src/pages/Account.tsx
- **Purpose**: User account management page
- **Dependencies**: @supabase/auth-helpers-react
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Initial implementation of account management
  - Profile update functionality
  - Sign out capability

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

### src/integrations/supabase/types.ts
- **Purpose**: TypeScript types for Supabase database schema
- **Last Updated**: March 19, 2024
- **Recent Changes**:
  - Types for birth_charts table
  - Added profiles table types

### Database Schema
#### birth_charts table
- **Purpose**: Stores user birth chart information
- **Last Updated**: March 19, 2024

#### profiles table
- **Purpose**: Stores user profile information
- **Last Updated**: March 19, 2024
- **Columns**:
  - id (uuid, references auth.users)
  - username (text, unique)
  - avatar_url (text)
  - created_at (timestamp)