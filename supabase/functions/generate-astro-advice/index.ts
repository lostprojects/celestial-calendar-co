import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { openai } from "./openai.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateInterpretation = async (birthChart: any, format: any) => {
  const prompt = `Based on this birth chart data:
Sun Sign: ${birthChart.sunSign}
Moon Sign: ${birthChart.moonSign}
Rising Sign: ${birthChart.risingSign}

Generate a personalized astrological reading divided into these sections:
1. Your Cosmic Essence
2. Emotional Landscape
3. Life Path & Purpose
4. Personal Growth
5. Future Potential

For each section, write a detailed paragraph (about 100 words) that provides meaningful insights. 
Do not use any markdown formatting or special characters.
Separate sections with double newlines.
Focus on practical advice and positive growth opportunities.`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
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

  return {
    interpretation: response.data.choices[0].message?.content
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { birthChart, format } = await req.json();
    const interpretation = await generateInterpretation(birthChart, format);
    
    return new Response(JSON.stringify(interpretation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating interpretation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});