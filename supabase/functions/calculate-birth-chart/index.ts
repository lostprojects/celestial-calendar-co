import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

// Simple zodiac sign calculation based on birth date
function calculateSunSign(month: number, day: number): string {
  const signs = [
    "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"
  ];
  const cutoffDays = [20, 19, 20, 20, 21, 21, 22, 23, 23, 23, 22, 21];
  
  let signIndex = month - 1;
  if (day > cutoffDays[month - 1]) {
    signIndex = (signIndex + 1) % 12;
  }
  
  return signs[signIndex];
}

// Simplified moon sign calculation (this is an approximation)
function calculateMoonSign(month: number, day: number): string {
  // Offset by 2 signs from sun sign as a simple approximation
  const signs = [
    "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"
  ];
  const baseIndex = month - 1;
  const moonIndex = (baseIndex + 2) % 12;
  return signs[moonIndex];
}

// Simple ascendant calculation based on birth hour
function calculateAscendant(hour: number): string {
  const signs = [
    "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"
  ];
  // Each sign rules approximately 2 hours of the day
  const signIndex = Math.floor(hour / 2) % 12;
  return signs[signIndex];
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

    // Calculate signs
    const sunSign = calculateSunSign(month, day);
    const moonSign = calculateMoonSign(month, day);
    const ascendantSign = calculateAscendant(hour);

    const result: BirthChartResult = {
      sunSign,
      moonSign,
      ascendantSign,
    };

    console.log('Calculated result:', result);

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