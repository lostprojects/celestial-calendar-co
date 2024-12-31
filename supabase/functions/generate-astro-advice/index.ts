import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

// Initialize OpenAI with API key
const openai = new OpenAIApi(
  new Configuration({
    apiKey: Deno.env.get('OPENAI_API_KEY')
  })
);

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { birthChart } = await req.json();
    
    if (!birthChart) {
      throw new Error('Birth chart data is required');
    }

    // Log input for debugging
    console.log('Processing birth chart:', birthChart);

    // Create prompt
    const prompt = `Create an astrological reading based on:
- Sun in ${birthChart.sunSign} at ${birthChart.sunDeg}°${birthChart.sunMin}'
- Moon in ${birthChart.moonSign} at ${birthChart.moonDeg}°${birthChart.moonMin}'
- Rising Sign (Ascendant) in ${birthChart.risingSign} at ${birthChart.risingDeg}°${birthChart.risingMin}'

Provide insights in these sections:
1. Cosmic Essence (Sun Sign focus)
2. Emotional Nature (Moon Sign focus)
3. Life Path (Rising Sign focus)
4. Growth & Potential

Keep each section around 100 words. Be practical and positive.`;

    // Make OpenAI request
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a wise and insightful astrologer providing clear, actionable guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Extract and validate response
    const interpretation = completion.data.choices[0]?.message?.content;
    
    if (!interpretation) {
      throw new Error('Failed to generate interpretation');
    }

    // Return successful response
    return new Response(
      JSON.stringify({ interpretation }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    // Log error for debugging
    console.error('Edge function error:', error);

    // Return error response
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});