// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qwpveubezldowcycifbh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3cHZldWJlemxkb3djeWNpZmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNDQ5OTUsImV4cCI6MjA1MDkyMDk5NX0.lwO1yuqPe4j_vum03nrdnf7o24tVTV7ty1npAPgyf04";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);