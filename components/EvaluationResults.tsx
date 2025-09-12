import React from 'react';
import type { EvaluationReport, EvaluationMetric } from '../types';
import { ScoreCard } from './ScoreCard';
import { RecommendationItem } from './RecommendationItem';
import { RelevanceIcon, CoherenceIcon, EffectivenessIcon, EfficiencyIcon, ImpactIcon } from './icons';

interface EvaluationResultsProps {
  report: EvaluationReport;
  title: string;
  onReset: () => void;
}

const MetricDetailCard: React.FC<{ title: string; metric: EvaluationMetric; icon: React.ReactNode }> = ({ title, metric, icon }) => (
  <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/80 shadow-lg">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="text-xl font-bold text-slate-100">{title}</h3>
    </div>
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-teal-400 mb-2">Strengths</h4>
        <ul className="space-y-2">
          {metric.strengths.map((item, index) => (
            <RecommendationItem key={index} text={item} type="strength" />
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-rose-400 mb-2">Weaknesses</h4>
        <ul className="space-y-2">
          {metric.weaknesses.map((item, index) => (
            <RecommendationItem key={index} text={item} type="weakness" />
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export const EvaluationResults: React.FC<EvaluationResultsProps> = ({ report, title, onReset }) => {
  const { overallScore, summary, relevance, coherence, effectiveness, efficiency, impact } = report;

  const metrics = [
    { id: 'relevance', title: 'Relevance', metric: relevance, icon: <RelevanceIcon className="w-8 h-8 text-cyan-400" /> },
    { id: 'coherence', title: 'Coherence', metric: coherence, icon: <CoherenceIcon className="w-8 h-8 text-cyan-400" /> },
    { id: 'effectiveness', title: 'Effectiveness', metric: effectiveness, icon: <EffectivenessIcon className="w-8 h-8 text-cyan-400" /> },
    { id: 'efficiency', title: 'Efficiency', metric: efficiency, icon: <EfficiencyIcon className="w-8 h-8 text-cyan-400" /> },
    { id: 'impact', title: 'Impact', metric: impact, icon: <ImpactIcon className="w-8 h-8 text-cyan-400" /> },
  ];

  return (
    <div className="w-full animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100">Evaluation for: <span className="text-cyan-400 break-words">{title}</span></h2>
        <p className="mt-4 max-w-3xl mx-auto text-slate-400">{summary}</p>
      </div>
      
      <div className="mb-8 flex justify-center">
        <ScoreCard score={overallScore} title="Overall Score" size="large" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {metrics.map(({ id, title, metric, icon }) => (
            <ScoreCard key={id} score={metric.score} title={title} icon={icon} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {metrics.map(({ id, title, metric, icon }) => (
          <MetricDetailCard key={id} title={title} metric={metric} icon={icon} />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
        >
          Evaluate Another Project
        </button>
      </div>
    </div>
  );
};
