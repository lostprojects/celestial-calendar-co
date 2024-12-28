import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { julian, solar, moonposition } from 'https://esm.sh/astronomia@4.1.1'
import moment from 'https://esm.sh/moment-timezone@0.5.43'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Astronomical constants
const OBLIQUITY = 23.4397; // Mean obliquity of the ecliptic in degrees
const J2000 = 2451545.0; // Julian Date for epoch J2000.0

interface BirthChartInput {
  name: string;
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  timeZone: string;
}

function validateInput(input: BirthChartInput): void {
  if (!input.name || typeof input.name !== 'string') {
    throw new Error('Invalid name provided');
  }

  if (!moment(input.birthDate, 'YYYY-MM-DD', true).isValid()) {
    throw new Error('Invalid birth date format. Use YYYY-MM-DD');
  }

  if (!moment(input.birthTime, 'HH:mm', true).isValid()) {
    throw new Error('Invalid birth time format. Use HH:mm (24-hour)');
  }

  if (!moment.tz.zone(input.timeZone)) {
    throw new Error('Invalid time zone. Use format like "Europe/London"');
  }

  if (typeof input.latitude !== 'number' || input.latitude < -90 || input.latitude > 90) {
    throw new Error('Invalid latitude. Must be between -90 and 90 degrees');
  }

  if (typeof input.longitude !== 'number' || input.longitude < -180 || input.longitude > 180) {
    throw new Error('Invalid longitude. Must be between -180 and 180 degrees');
  }
}

function calculateJulianDay(dateTime: moment.Moment): number {
  const year = dateTime.year();
  const month = dateTime.month() + 1; // Convert 0-based to 1-based month
  const day = dateTime.date();
  const hour = dateTime.hour();
  const minute = dateTime.minute();
  
  // Calculate Julian Day with proper fractional day
  const jd = julian.CalendarGregorianToJD(
    year,
    month,
    day + (hour + minute / 60.0) / 24.0
  );
  
  console.log(`Calculated Julian Day for ${dateTime.format()}: ${jd}`);
  return jd;
}

function normalizeAngle(angle: number): number {
  return angle - 360.0 * Math.floor(angle / 360.0);
}

function calculateSiderealTime(julianDay: number, longitude: number): number {
  // Calculate Greenwich Mean Sidereal Time
  const T = (julianDay - J2000) / 36525.0;
  let GMST = 280.46061837 + 360.98564736629 * (julianDay - J2000) +
             T * T * (0.000387933 - T / 38710000.0);
  
  // Normalize GMST to range [0, 360)
  GMST = normalizeAngle(GMST);
  
  // Calculate Local Sidereal Time
  const LST = normalizeAngle(GMST + longitude);
  
  console.log(`Calculated LST: ${LST} degrees`);
  return LST;
}

function calculateAscendant(siderealTime: number, latitude: number): number {
  const radians = (deg: number) => deg * Math.PI / 180.0;
  const degrees = (rad: number) => rad * 180.0 / Math.PI;
  
  const lstRad = radians(siderealTime);
  const latRad = radians(latitude);
  const obliquityRad = radians(OBLIQUITY);
  
  const ascRad = Math.atan2(
    -Math.cos(lstRad),
    Math.sin(lstRad) * Math.cos(obliquityRad) - Math.tan(latRad) * Math.sin(obliquityRad)
  );
  
  const ascDeg = normalizeAngle(degrees(ascRad));
  console.log(`Calculated Ascendant: ${ascDeg} degrees`);
  return ascDeg;
}

function getZodiacSign(longitude: number): string {
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  const signIndex = Math.floor(normalizeAngle(longitude) / 30);
  return zodiacSigns[signIndex];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const input: BirthChartInput = await req.json();
    validateInput(input);

    // Convert local time to UTC
    const localDateTime = moment.tz(
      `${input.birthDate} ${input.birthTime}`,
      'YYYY-MM-DD HH:mm',
      input.timeZone
    );
    
    console.log(`Local date time: ${localDateTime.format()}`);
    
    // Calculate Julian Day from UTC time
    const julianDay = calculateJulianDay(localDateTime.utc());
    
    // Calculate positions
    const sunLongitude = solar.apparentLongitude(julianDay);
    const moonLongitude = moonposition.position(julianDay).lon;
    const siderealTime = calculateSiderealTime(julianDay, input.longitude);
    const ascendantDegree = calculateAscendant(siderealTime, input.latitude);

    const result = {
      sunSign: getZodiacSign(sunLongitude),
      moonSign: getZodiacSign(moonLongitude),
      ascendantSign: getZodiacSign(ascendantDegree),
    };

    // Cache the result
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
      console.error('Error caching birth chart:', insertError);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});