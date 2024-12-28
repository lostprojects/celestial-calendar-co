import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { KerykeionAstrology } from 'https://esm.sh/kerykeion@3.3.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BirthChartInput {
  name: string;
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
}

interface BirthChartResult {
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: BirthChartInput = await req.json();
    console.log('Received input:', input);

    // Validate input
    if (!input.name || !input.birthDate || !input.birthTime || 
        typeof input.latitude !== 'number' || typeof input.longitude !== 'number') {
      throw new Error('Invalid input parameters');
    }

    // Parse date and time
    const [year, month, day] = input.birthDate.split('-').map(Number);
    const [hour, minute] = input.birthTime.split(':').map(Number);

    console.log('Parsed date/time:', { year, month, day, hour, minute });

    // Create birth chart using Kerykeion
    const chart = new KerykeionAstrology({
      name: input.name,
      year,
      month,
      day,
      hour,
      minute,
      latitude: input.latitude,
      longitude: input.longitude,
    });

    console.log('Chart calculated:', chart);

    const result: BirthChartResult = {
      sunSign: chart.sun.sign,
      moonSign: chart.moon.sign,
      ascendantSign: chart.ascendant.sign,
    };

    console.log('Final result:', result);

    // Store result in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: insertError } = await supabaseClient
      .from('birth_charts')
      .insert({
        name: input.name,
        birth_date: input.birthDate,
        birth_time: input.birthTime,
        latitude: input.latitude,
        longitude: input.longitude,
        sun_sign: result.sunSign,
        moon_sign: result.moonSign,
        ascendant_sign: result.ascendantSign,
      });

    if (insertError) {
      console.error('Error storing birth chart:', insertError);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});