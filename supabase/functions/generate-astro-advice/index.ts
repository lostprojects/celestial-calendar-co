import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Type definitions for better code organization
interface BirthChart {
  sunSign: string;
  sunDeg: number;
  sunMin: number;
  moonSign: string;
  moonDeg: number;
  moonMin: number;
  ascSign: string;
  ascDeg: number;
  ascMin: number;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('Configuration error: OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    // Parse and validate request body
    const { birthChart } = await req.json() as { birthChart: BirthChart };
    
    if (!birthChart || !validateBirthChart(birthChart)) {
      throw new Error('Invalid birth chart data provided');
    }

    console.log('Processing birth chart:', JSON.stringify(birthChart, null, 2));

    // Generate astrological reading
    const interpretation = await generateAstrologicalReading(birthChart, openAIApiKey);

    return new Response(
      JSON.stringify({ interpretation }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Validation helper
function validateBirthChart(chart: BirthChart): boolean {
  return Boolean(
    chart.sunSign && chart.moonSign && chart.ascSign &&
    typeof chart.sunDeg === 'number' && typeof chart.moonDeg === 'number' && typeof chart.ascDeg === 'number' &&
    typeof chart.sunMin === 'number' && typeof chart.moonMin === 'number' && typeof chart.ascMin === 'number'
  );
}

// OpenAI interaction helper
async function generateAstrologicalReading(birthChart: BirthChart, apiKey: string): Promise<string> {
  const prompt = `Create an astrological reading based on:
- Sun in ${birthChart.sunSign} at ${birthChart.sunDeg}°${birthChart.sunMin}'
- Moon in ${birthChart.moonSign} at ${birthChart.moonDeg}°${birthChart.moonMin}'
- Ascendant in ${birthChart.ascSign} at ${birthChart.ascDeg}°${birthChart.ascMin}'

Please provide insights in these areas:
1. Core Identity and Purpose (Sun Sign)
2. Emotional Nature and Inner World (Moon Sign)
3. External Personality and Approach to Life (Ascendant)
4. Key Life Themes and Potential

Keep each section around 100 words. Be practical and positive.`;

  console.log('Sending prompt to OpenAI:', prompt);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a wise and insightful astrologer providing clear, actionable guidance.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API error:', errorData);
    throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json() as OpenAIResponse;
  console.log('OpenAI response received:', JSON.stringify(data, null, 2));

  const interpretation = data.choices[0]?.message?.content;
  if (!interpretation) {
    throw new Error('No interpretation generated from OpenAI');
  }

  return interpretation;
}