import type { EvaluationReport } from '../types';

export const evaluateProject = async (projectDescription: string): Promise<EvaluationReport> => {
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectDescription }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'An unknown server error occurred.' }));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const report: EvaluationReport = await response.json();
    return report;

  } catch (error) {
    console.error("Error calling evaluation API:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error('Failed to communicate with the evaluation service.');
  }
};
