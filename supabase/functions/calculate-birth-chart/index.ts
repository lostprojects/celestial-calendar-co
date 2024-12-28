import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { julian, solar, moonposition } from 'https://esm.sh/astronomia@4.1.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function calculateJulianDay(utcDate: string, utcTime: string): number {
  const [year, month, day] = utcDate.split("-").map(Number);
  const [hour, minute] = utcTime.split(":").map(Number);
  return julian.CalendarGregorianToJD(year, month, day + hour / 24 + minute / 1440);
}

function calculateSiderealTime(julianDay: number, longitude: number): number {
  const T = (julianDay - 2451545.0) / 36525.0;
  const GMST = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 
               T * T * (0.000387933 - T / 38710000.0);
  return (GMST + longitude) % 360;
}

function calculateAscendant(siderealTime: number, latitude: number): number {
  const radians = (degrees: number) => degrees * (Math.PI / 180);
  const degrees = (radians: number) => radians * (180 / Math.PI);
  const obliquity = radians(23.439281);
  const latRad = radians(latitude);
  const lstRad = radians(siderealTime);

  return (degrees(Math.atan2(
    -Math.cos(lstRad),
    Math.sin(lstRad) * Math.cos(obliquity) - Math.tan(latRad) * Math.sin(obliquity)
  )) + 360) % 360;
}

function getZodiacSign(longitude: number): string {
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  return zodiacSigns[Math.floor((longitude % 360) / 30)];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { name, birthDate, birthTime, latitude, longitude } = await req.json()

    // Check for existing calculation
    const { data: existingChart, error: fetchError } = await supabaseClient
      .from('birth_charts')
      .select('*')
      .eq('name', name)
      .eq('birth_date', birthDate)
      .eq('birth_time', birthTime)
      .eq('latitude', latitude)
      .eq('longitude', longitude)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    if (existingChart) {
      console.log('Found cached birth chart:', existingChart)
      return new Response(
        JSON.stringify({
          sunSign: existingChart.sun_sign,
          moonSign: existingChart.moon_sign,
          ascendantSign: existingChart.ascendant_sign,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Calculate new birth chart
    const julianDay = calculateJulianDay(birthDate, birthTime);
    const sunLongitude = solar.apparentLongitude(julianDay);
    const moonLongitude = moonposition.position(julianDay).lon;
    const siderealTime = calculateSiderealTime(julianDay, longitude);
    const ascendantDegree = calculateAscendant(siderealTime, latitude);

    const result = {
      sunSign: getZodiacSign(sunLongitude),
      moonSign: getZodiacSign(moonLongitude),
      ascendantSign: getZodiacSign(ascendantDegree),
    }

    // Cache the result
    const { error: insertError } = await supabaseClient
      .from('birth_charts')
      .insert({
        name,
        birth_date: birthDate,
        birth_time: birthTime,
        latitude,
        longitude,
        sun_sign: result.sunSign,
        moon_sign: result.moonSign,
        ascendant_sign: result.ascendantSign,
      })

    if (insertError) {
      console.error('Error caching birth chart:', insertError)
    }

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