import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as pdfjs from 'https://cdn.skypack.dev/pdfjs-dist@3.11.174/build/pdf.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configure pdf.js for server-side usage
const pdfjsWorker = await import('https://cdn.skypack.dev/pdfjs-dist@3.11.174/build/pdf.worker.js')
globalThis.pdfjsWorker = pdfjsWorker

// Initialize pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.skypack.dev/pdfjs-dist@3.11.174/build/pdf.worker.js'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Processing file:', file.name)

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Read the PDF file
    const arrayBuffer = await file.arrayBuffer()
    
    console.log('Loading PDF document...')
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    })
    
    const pdf = await loadingTask.promise
    const extractedData = []
    
    console.log(`Processing ${pdf.numPages} pages`)

    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Getting page ${i}...`)
      const page = await pdf.getPage(i)
      
      console.log(`Extracting text from page ${i}...`)
      const textContent = await page.getTextContent()
      let pageText = textContent.items.map((item) => item.str).join(' ')
      
      console.log(`Processing text from page ${i}:`, pageText)
      
      // Split text into lines and process each line
      const lines = pageText.split('\n')
      
      for (const line of lines) {
        const parsed = parseLine(line)
        if (parsed) {
          console.log('Parsed data:', parsed)
          extractedData.push(parsed)
        }
      }
    }

    console.log(`Total parsed entries: ${extractedData.length}`)

    if (extractedData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid data found in PDF' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('ephemeris_data')
      .upsert(extractedData, {
        onConflict: 'date,planet',
        ignoreDuplicates: true
      })

    if (error) {
      console.error('Error inserting data:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to insert data', details: error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'File processed successfully', 
        rowsProcessed: extractedData.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Processing error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function parseLine(line: string): any {
  // Enhanced parsing logic for ephemeris data
  // Example format: "01/01/2024  Sun  280.5  R"
  const matches = line.match(/(\d{2}\/\d{2}\/\d{4})\s+([A-Za-z]+)\s+(\d+\.\d+)\s*(R)?/)
  
  if (matches) {
    const [_, dateStr, planet, longitude, retrograde] = matches
    
    // Validate the planet is one of the allowed celestial bodies
    const validPlanets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    const normalizedPlanet = planet.charAt(0).toUpperCase() + planet.slice(1).toLowerCase()
    
    if (!validPlanets.includes(normalizedPlanet)) {
      console.log(`Skipping invalid planet: ${planet}`)
      return null
    }

    try {
      // Parse and validate the date
      const [month, day, year] = dateStr.split('/')
      const date = new Date(Number(year), Number(month) - 1, Number(day))
      
      if (isNaN(date.getTime())) {
        console.log(`Skipping invalid date: ${dateStr}`)
        return null
      }

      // Parse and validate the longitude
      const parsedLongitude = parseFloat(longitude)
      if (isNaN(parsedLongitude) || parsedLongitude < 0 || parsedLongitude >= 360) {
        console.log(`Skipping invalid longitude: ${longitude}`)
        return null
      }

      return {
        date: date.toISOString().split('T')[0],
        planet: normalizedPlanet,
        longitude: parsedLongitude,
        retrograde: !!retrograde,
      }
    } catch (error) {
      console.error('Error parsing line:', error)
      return null
    }
  }
  return null
}