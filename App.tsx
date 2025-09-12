import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ProjectInputForm } from './components/UrlInputForm';
import { EvaluationResults } from './components/EvaluationResults';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import type { EvaluationReport } from './types';
import { evaluateProject } from './services/geminiService';

type AppState = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');

  const handleEvaluate = useCallback(async (title: string, description: string) => {
    if (!description || !title) {
      setError('Please provide a project title and description.');
      setAppState('error');
      return;
    }
    setAppState('loading');
    setError(null);
    setEvaluationReport(null);
    setProjectTitle(title);
    setProjectDescription(description);

    try {
      const report = await evaluateProject(description);
      setEvaluationReport(report);
      setAppState('success');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during evaluation.');
      setAppState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState('idle');
    setEvaluationReport(null);
    setError(null);
    setProjectTitle('');
    setProjectDescription('');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingSpinner text={`Analyzing "${projectTitle}"...`} />;
      case 'success':
        return evaluationReport && <EvaluationResults report={evaluationReport} title={projectTitle} onReset={handleReset} />;
      case 'error':
        return <ErrorMessage message={error || 'An error occurred.'} onRetry={() => appState === 'error' && handleEvaluate(projectTitle, projectDescription)} canRetry={!!projectDescription} />;
      case 'idle':
      default:
        return <ProjectInputForm onEvaluate={handleEvaluate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-6xl mx-auto flex-grow flex flex-col justify-center">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Powered by Google Gemini. Analysis is based on the provided text and may not reflect real-world outcomes.</p>
      </footer>
    </div>
  );
}
