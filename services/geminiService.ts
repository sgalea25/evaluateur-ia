import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL } from '../constants';
import type { EvaluationReport } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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


export const evaluateProject = async (projectDescription: string): Promise<EvaluationReport> => {
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

    Here are the definitions of the criteria to guide your analysis:
    - **Relevance:** The extent to which the project's objectives are consistent with beneficiaries' requirements, country needs, and partner priorities. Is this the right project?
    - **Coherence:** The compatibility of the project with other interventions in the same sector or institution. How well does it fit with what others are doing?
    - **Effectiveness:** The extent to which the project is expected to achieve its objectives and results. Will the project achieve its goals?
    - **Efficiency:** The extent to which the project is likely to deliver results in an economic and timely way. Are the resources used well?
    - **Impact:** The extent to which the project is expected to generate significant positive or negative, intended or unintended, higher-level effects. What is the long-term difference it will make?

    Structure your entire response according to the provided JSON schema. Ensure your analysis is based solely on the text provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const report: EvaluationReport = JSON.parse(jsonText);
    return report;

  } catch (error) {
    console.error("Error evaluating project:", error);
    if (error instanceof Error && error.message.includes("400 Bad Request")) {
       throw new Error(`The AI model could not process the request for this project. This may be due to content policies or an issue with the description. Please try revising the text.`);
    }
    throw new Error(`Failed to get a valid evaluation from the AI model for this project.`);
  }
};
