import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit configuration
const RATE_LIMIT = {
  requests: 5,    // Maximum requests
  window: 3600,   // Time window in seconds (1 hour)
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user ID from auth header if available
    const authHeader = req.headers.get('Authorization');
    const userId = authHeader ? authHeader.replace('Bearer ', '') : null;

    // Rate limiting only applies to authenticated users making additional requests
    if (userId) {
      const kv = await Deno.openKv();
      const key = ['rate_limit', userId];
      const now = Math.floor(Date.now() / 1000);
      
      // Get current usage
      const result = await kv.get(key);
      const usage = result.value as { count: number; resetAt: number } || { count: 0, resetAt: now + RATE_LIMIT.window };
      
      // Reset if window expired
      if (now > usage.resetAt) {
        usage.count = 0;
        usage.resetAt = now + RATE_LIMIT.window;
      }
      
      // Check if rate limit exceeded
      if (usage.count >= RATE_LIMIT.requests) {
        const waitTime = usage.resetAt - now;
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            waitTime,
            resetAt: new Date(usage.resetAt * 1000).toISOString()
          }),
          { 
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': RATE_LIMIT.requests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': usage.resetAt.toString()
            }
          }
        );
      }
      
      // Increment usage for authenticated users
      usage.count++;
      await kv.set(key, usage);
    }
    
    // Verify OpenAI API key exists
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    // Parse and validate request body
    const { birthChart } = await req.json();
    console.log('Received birth chart data:', birthChart);
    
    if (!birthChart) {
      throw new Error('Birth chart data is required');
    }

    // Construct the prompt
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

    console.log('Sending prompt to OpenAI:', prompt);

    // Make OpenAI API request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a wise and insightful western astrologer providing clear, actionable guidance based on traditional western astrological principles and birth chart analysis.'
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

    const data = await response.json();
    console.log('Received response from OpenAI:', data);

    const interpretation = data.choices[0]?.message?.content;
    if (!interpretation) {
      throw new Error('No interpretation generated');
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
    console.error('Edge function error:', error);
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
