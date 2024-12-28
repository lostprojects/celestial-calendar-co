import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, birthDate, birthTime, latitude, longitude } = await req.json()

    // First, check if we have this calculation cached in our database
    const { data: existingChart, error: fetchError } = await supabase
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

    // If not cached, call the Python service
    const PYTHON_SERVICE_URL = Deno.env.get('PYTHON_SERVICE_URL')
    if (!PYTHON_SERVICE_URL) {
      throw new Error('PYTHON_SERVICE_URL environment variable not set')
    }

    const response = await fetch(PYTHON_SERVICE_URL + '/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        birthDate,
        birthTime,
        latitude,
        longitude,
      }),
    })

    if (!response.ok) {
      throw new Error(`Python service error: ${await response.text()}`)
    }

    const result = await response.json()

    // Cache the result in our database
    const { error: insertError } = await supabase
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