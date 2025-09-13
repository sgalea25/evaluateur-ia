import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const GEMINI_MODEL = 'gemini-1.5-flash';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!process.env.API_KEY) {
    return new Response(JSON.stringify({ error: 'API_KEY environment variable not set.' }), { status: 500 });
  }

  try {
    const { projectDescription } = await request.json();
    if (!projectDescription) {
        return new Response(JSON.stringify({ error: 'Project description is required.' }), { status: 400 });
    }

    const genAI = new GoogleGenAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `Evaluez la description de projet suivante...`; // NOTE: Assurez-vous de mettre votre prompt complet ici

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const report = JSON.parse(response.text());

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in /api/evaluate:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return new Response(JSON.stringify({ error: `AI model evaluation failed: ${errorMessage}` }), { status: 500 });
  }
}