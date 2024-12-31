import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { birthChart } = await req.json();

    const systemPrompt = `You are an expert astrologer with deep knowledge of both Western and Vedic astrology. 
    Analyze birth charts and provide insightful, personalized interpretations. 
    Focus on the relationship between planets, houses, and aspects. 
    Provide practical advice while maintaining a supportive and encouraging tone.`;

    const userPrompt = `Please analyze this birth chart:
    Sun Sign: ${birthChart.sunSign} (${birthChart.sunDeg}° ${birthChart.sunMin}')
    Moon Sign: ${birthChart.moonSign} (${birthChart.moonDeg}° ${birthChart.moonMin}')
    Ascendant: ${birthChart.risingSign} (${birthChart.risingDeg}° ${birthChart.risingMin}')
    
    Provide a brief but insightful interpretation focusing on:
    1. Core personality (Sun)
    2. Emotional nature (Moon)
    3. Outward expression (Ascendant)
    4. Key strengths and potential challenges`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);
    
    const interpretation = data.choices[0].message.content;

    return new Response(JSON.stringify({ interpretation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-astro-advice function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});