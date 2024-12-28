import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function calculateSunSign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

// This is a simplified calculation - in reality, moon sign calculation requires ephemeris data
function calculateMoonSign(month: number, day: number): string {
  // For now, we'll use a simple offset from the sun sign
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const sunSignIndex = signs.indexOf(calculateSunSign(month, day));
  const moonSignIndex = (sunSignIndex + Math.floor(day / 2.5)) % 12;
  return signs[moonSignIndex];
}

// This is a simplified calculation - in reality, ascendant calculation requires precise time and location
function calculateAscendant(hour: number, latitude: number): string {
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  // Use hour to determine rough ascendant
  const signIndex = (hour * 2) % 12;
  // Adjust based on latitude (simplified)
  const latitudeAdjustment = Math.floor(Math.abs(latitude) / 15) % 12;
  return signs[(signIndex + latitudeAdjustment) % 12];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, birthDate, birthTime, latitude, longitude } = await req.json()

    // Parse date and time
    const [year, month, day] = birthDate.split('-').map(Number)
    const [hour, minute] = birthTime.split(':').map(Number)

    console.log(`Calculating chart for: ${name} born on ${birthDate} at ${birthTime} at lat:${latitude} long:${longitude}`);

    // Calculate positions using our simplified functions
    const sunSign = calculateSunSign(month, day);
    const moonSign = calculateMoonSign(month, day);
    const ascendantSign = calculateAscendant(hour, latitude);

    const result = {
      sunSign,
      moonSign,
      ascendantSign,
    };

    console.log('Calculation result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})