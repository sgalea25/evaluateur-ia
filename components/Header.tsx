import React from 'react';
import { ProjectIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-6xl mx-auto py-4 mb-8 text-center">
      <div className="flex items-center justify-center gap-4">
        <ProjectIcon className="w-10 h-10 text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
          Eval.fr
        </h1>
      </div>
       <p className="mt-2 text-lg text-slate-400">AI-Powered Development Project Evaluator</p>
    </header>
  );
};
