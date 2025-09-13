import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL } from '../constants';
import type { EvaluationReport } from '../types';

// This tells Vercel to run this code efficiently
export const config = {
  runtime: 'edge',
};

const evaluationMetricSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: "Score from 0 to 100 for this criterion." },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-4 key strengths." },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-4 key weaknesses as actionable recommendations." },
    },
    required: ["score", "strengths", "weaknesses"]
};

const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.INTEGER, description: "Overall project score from 0 to 100, as an average of the five criteria scores." },
        summary: { type: Type.STRING, description: "A brief, one-paragraph executive summary of the project's evaluation." },
        relevance: { ...evaluationMetricSchema, description: "Evaluation of the project's Relevance." },
        coherence: { ...evaluationMetricSchema, description: "Evaluation of the project's Coherence." },
        effectiveness: { ...evaluationMetricSchema, description: "Evaluation of the project's Effectiveness." },
        efficiency: { ...evaluationMetricSchema, description: "Evaluation of the project's Efficiency." },
        impact: { ...evaluationMetricSchema, description: "Evaluation of the project's potential Impact." },
    },
    required: ["overallScore", "summary", "relevance", "coherence", "effectiveness", "efficiency", "impact"]
};

// The main function that handles requests
export default async function handler(request: Request): Promise<Response> {
    const headers = { 'Content-Type': 'application/json' };

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
    }

    if (!process.env.API_KEY) {
        console.error("API_KEY is not configured on the server.");
        return new Response(JSON.stringify({ error: 'Server configuration error: API key is missing.' }), { status: 500, headers });
    }

    try {
        const { projectDescription } = await request.json();
        if (!projectDescription || typeof projectDescription !== 'string') {
            return new Response(JSON.stringify({ error: 'Project description is required and must be a string.' }), { status: 400, headers });
        }

        // Initialize the AI client with the correct, modern syntax
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `
        You are an expert evaluator for international development and aid projects, specializing in the OECD-DAC criteria.
        Your task is to analyze the provided project description and evaluate it based on five core criteria: Relevance, Coherence, Effectiveness, Efficiency, and Impact.
        Analyze the following project description:
        ---
        ${projectDescription}
        ---
        Provide a comprehensive evaluation. For each of the five criteria, you must provide:
        1. A score from 0 to 100.
        2. A list of 2-4 key strengths.
        3. A list of 2-4 key weaknesses, phrased as constructive, actionable recommendations for improvement.
        Also, provide an overall score (as an average of the five criteria scores) and a brief executive summary of your findings.
        Structure your entire response according to the provided JSON schema. Ensure your analysis is based solely on the text provided.
        `;

        // This is the correct, modern API call
        const geminiResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: evaluationSchema,
                temperature: 0.2,
                // OPTIMIZATION: Tell the model to respond faster to avoid timeouts.
                thinkingConfig: { thinkingBudget: 0 }
            },
        });

        const jsonText = geminiResponse.text.trim();
        
        // Final check to ensure the response is valid JSON before parsing
        if (!jsonText.startsWith('{') && !jsonText.startsWith('[') ) {
          console.error("Received non-JSON response from AI:", jsonText);
          throw new Error("The AI model returned an invalid format.");
        }
        
        const report: EvaluationReport = JSON.parse(jsonText);

        return new Response(JSON.stringify(report), {
            status: 200,
            headers: headers,
        });

    } catch (error)
    {
        console.error("Critical error in /api/evaluate:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        // This is the message that will be shown to the user in the error UI
        return new Response(JSON.stringify({ error: `AI model evaluation failed. Details: ${errorMessage}` }), { status: 500, headers: headers });
    }
}
