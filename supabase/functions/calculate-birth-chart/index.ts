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

    // Parse date and time
    const [year, month, day] = birthDate.split('-').map(Number)
    const [hour, minute] = birthTime.split(':').map(Number)

    // Create Python script content
    const pythonScript = `
from kerykeion import KrInstance, Report

# Create birth chart
chart = KrInstance(
    name="${name}",
    year=${year},
    month=${month},
    day=${day},
    hour=${hour},
    minute=${minute},
    lat=${latitude},
    lng=${longitude}
)

# Get positions
sun_sign = chart.sun['sign']
moon_sign = chart.moon['sign']
asc_sign = chart.asc['sign']

# Print results as JSON
print(f'{{"sunSign": "{sun_sign}", "moonSign": "{moon_sign}", "ascendantSign": "{asc_sign}"}}')
`

    // Write Python script to temporary file
    const tempFile = await Deno.makeTempFile({ suffix: '.py' });
    await Deno.writeTextFile(tempFile, pythonScript);

    // Execute Python script
    const pythonProcess = new Deno.Command("python3", {
      args: [tempFile],
      stdout: "piped",
      stderr: "piped",
    });

    const { stdout, stderr } = await pythonProcess.output()
    
    // Log any errors for debugging
    const errorOutput = new TextDecoder().decode(stderr)
    if (errorOutput) {
      console.error('Python Error:', errorOutput)
    }

    const output = new TextDecoder().decode(stdout).trim()

    // Clean up
    try {
      await Deno.remove(tempFile)
    } catch (error) {
      console.error('Error removing temp file:', error)
    }

    return new Response(
      output,
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