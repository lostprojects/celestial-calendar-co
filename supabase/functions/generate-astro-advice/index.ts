import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openai = new OpenAIApi(new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY')
}));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { birthChart } = await req.json();
    
    if (!birthChart) {
      throw new Error('Birth chart data is required');
    }

    console.log('Received birth chart data:', birthChart);

    const prompt = `Based on this birth chart data:
Sun Sign: ${birthChart.sunSign} at ${birthChart.sunDeg}°${birthChart.sunMin}'
Moon Sign: ${birthChart.moonSign} at ${birthChart.moonDeg}°${birthChart.moonMin}'
Rising Sign: ${birthChart.risingSign} at ${birthChart.risingDeg}°${birthChart.risingMin}'

Generate a personalized astrological reading divided into these sections:
1. Your Cosmic Essence (focusing on Sun Sign)
2. Emotional Landscape (focusing on Moon Sign)
3. Life Path & Purpose (focusing on Rising Sign)
4. Personal Growth
5. Future Potential

For each section, write a detailed paragraph (about 100 words) that provides meaningful insights.
Do not use any markdown formatting or special characters.
Separate sections with double newlines.
Focus on practical advice and growth opportunities.`;

    console.log('Sending prompt to OpenAI:', prompt);

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an insightful astrologer who provides meaningful, practical interpretations of birth charts. Your readings are clear, positive, and actionable."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    console.log('Received response from OpenAI');

    if (!response.data.choices[0]?.message?.content) {
      throw new Error('No interpretation generated');
    }

    const interpretation = response.data.choices[0].message.content;
    
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
    console.error('Error in generate-astro-advice function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
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