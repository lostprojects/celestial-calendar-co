#!/bin/bash

# Create necessary directories
mkdir -p src/features/birth-chart
mkdir -p src/features/account
mkdir -p src/features/glossary
mkdir -p src/services/database
mkdir -p src/types

# Move astronomical files (keeping the one in astro/ directory as it has proper imports)
rm src/utils/astro-core.ts
rm src/utils/astro-utils.ts

# Move birth chart related components
mv src/components/birthchart-form.tsx src/features/birth-chart/
mv src/components/BirthChartSection.tsx src/features/birth-chart/
mv src/components/birth-signs src/features/birth-chart/
mv src/components/chart-results src/features/birth-chart/

# Move account related components
mv src/components/account/* src/features/account/
rmdir src/components/account

# Move glossary components
mv src/components/glossary/* src/features/glossary/
rmdir src/components/glossary

# Move database integration
mv src/integrations/supabase src/services/database
rmdir src/integrations

# Create index files for exports
touch src/features/birth-chart/index.ts
touch src/features/account/index.ts
touch src/features/glossary/index.ts
