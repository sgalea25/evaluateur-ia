import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = 'gemini-1.5-flash';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    return response.status(405).send('Method Not Allowed');
  }

  if (!process.env.API_KEY) {
    return response.status(500).json({ error: 'API_KEY environment variable not set.' });
  }

  try {
    const { projectDescription } = request.body;
    if (!projectDescription) {
        return response.status(400).json({ error: 'Project description is required.' });
    }

    const genAI = new GoogleGenAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `Analyse cette description de projet et évalue-la selon les critères OCDE (Pertinence, Cohérence, Efficacité, Efficience, Impact). Pour chaque critère, donne un score sur 100, 2 points forts, et 2 points faibles. Fournis un score global et un résumé. Réponds uniquement en JSON structuré comme demandé. Voici le projet : --- ${projectDescription}`;

    const result = await model.generateContent(prompt);
    const resultResponse = await result.response;
    const rawText = resultResponse.text();

    // --- BLOC DE NETTOYAGE POUR EXTRAIRE LE JSON ---
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}') + 1;
    const jsonText = rawText.substring(startIndex, endIndex);
    // --- FIN DU BLOC DE NETTOYAGE ---

    const report = JSON.parse(jsonText);

    return response.status(200).json(report);

  } catch (error) {
    console.error("Error in /api/evaluate:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return response.status(500).json({ error: `AI model evaluation failed: ${errorMessage}` });
  }
}
