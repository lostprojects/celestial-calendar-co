import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { PDFDocument } from 'https://cdn.skypack.dev/pdf-lib'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Read the PDF file
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    
    const pages = pdfDoc.getPages()
    const extractedData = []
    
    for (const page of pages) {
      const text = await page.getText()
      // Split text into lines and process each line
      const lines = text.split('\n')
      
      for (const line of lines) {
        // Basic parsing logic - this should be enhanced based on actual PDF structure
        const parsed = parseLine(line)
        if (parsed) {
          extractedData.push(parsed)
        }
      }
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
  // This is a placeholder parsing function
  // It should be enhanced based on the actual structure of your PDF files
  const matches = line.match(/(\d{2}\/\d{2}\/\d{4})\s+([A-Za-z]+)\s+(\d+\.\d+)\s*(R)?/)
  if (matches) {
    const [_, dateStr, planet, longitude, retrograde] = matches
    return {
      date: new Date(dateStr).toISOString().split('T')[0],
      planet: planet.toUpperCase(),
      longitude: parseFloat(longitude),
      retrograde: !!retrograde,
    }
  }
  return null
}