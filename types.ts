export interface EvaluationMetric {
  score: number;
  strengths: string[];
  weaknesses: string[];
}

export interface EvaluationReport {
  overallScore: number;
  summary: string;
  relevance: EvaluationMetric;
  coherence: EvaluationMetric;
  effectiveness: EvaluationMetric;
  efficiency: EvaluationMetric;
  impact: EvaluationMetric;
}
