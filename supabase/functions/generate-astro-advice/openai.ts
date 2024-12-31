import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

const configuration = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

export const openai = new OpenAIApi(configuration);