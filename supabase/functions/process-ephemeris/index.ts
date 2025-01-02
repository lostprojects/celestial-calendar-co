import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    
    if (!file) {
      throw new Error('No file provided')
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Read the file content
    const text = await file.text()
    const rows = text.split('\n')
    
    // Process header row to find column indices
    const headers = rows[0].split(',').map(h => h.trim().toLowerCase())
    const dateIndex = headers.findIndex(h => h.includes('date'))
    const planetIndex = headers.findIndex(h => h.includes('planet'))
    const longitudeIndex = headers.findIndex(h => 
      h.includes('longitude') || h.includes('position') || h.includes('degree')
    )
    const retrogradeIndex = headers.findIndex(h => 
      h.includes('retrograde') || h.includes('direction')
    )

    if (dateIndex === -1 || planetIndex === -1 || longitudeIndex === -1) {
      throw new Error('Required columns not found in CSV. Need date, planet, and longitude/position columns.')
    }

    const processedData = []
    const errors = []

    // Process each data row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim()
      if (!row) continue // Skip empty rows
      
      const columns = row.split(',').map(c => c.trim())
      
      try {
        // Parse and validate date
        const dateStr = columns[dateIndex]
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid date format in row ${i + 1}: ${dateStr}`)
        }

        // Normalize planet name
        const planet = columns[planetIndex].toLowerCase()
        const validPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
        if (!validPlanets.includes(planet)) {
          throw new Error(`Invalid planet in row ${i + 1}: ${planet}`)
        }

        // Parse and validate longitude
        const longitude = parseFloat(columns[longitudeIndex])
        if (isNaN(longitude) || longitude < 0 || longitude >= 360) {
          throw new Error(`Invalid longitude in row ${i + 1}: ${columns[longitudeIndex]}`)
        }

        // Check for retrograde status
        let retrograde = false
        if (retrogradeIndex !== -1) {
          const retrogradeValue = columns[retrogradeIndex].toLowerCase()
          retrograde = retrogradeValue === 'r' || 
                      retrogradeValue === 'true' || 
                      retrogradeValue === 'retrograde' ||
                      retrogradeValue === '1'
        }

        processedData.push({
          date: date.toISOString().split('T')[0],
          planet,
          longitude,
          retrograde
        })
      } catch (error) {
        errors.push(error.message)
      }
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Some rows could not be processed', 
          details: errors 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    if (processedData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid data found in CSV' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('ephemeris_data')
      .upsert(processedData, {
        onConflict: 'date,planet',
        ignoreDuplicates: true
      })

    if (error) {
      console.error('Error inserting data:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to insert data', details: error }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'File processed successfully', 
        rowsProcessed: processedData.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    )
  } catch (error) {
    console.error('Processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})