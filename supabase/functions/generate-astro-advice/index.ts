import { serve } from "std/server";
import { openai } from "@/lib/openai";

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

  const response = await openai.chat.completions.create({
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
    interpretation: response.choices[0].message.content
  };
};

serve(async (req) => {
  const { birthChart, format } = await req.json();
  const interpretation = await generateInterpretation(birthChart, format);
  return new Response(JSON.stringify(interpretation), {
    headers: { "Content-Type": "application/json" },
  });
});
