import React, { useState } from 'react';

interface ProjectInputFormProps {
  onEvaluate: (title: string, description: string) => void;
}

const exampleProject = `This project aims to provide access to clean and safe drinking water for 10,000 people across 25 rural communities in the Upper West Region of Ghana. We will construct 30 new boreholes equipped with hand pumps, rehabilitate 15 existing but non-functional water points, and establish community-based Water and Sanitation Management Committees (WSMCs) for each water point. The project will also include comprehensive hygiene promotion and sanitation education campaigns. The total budget is $250,000 over a period of 2 years. Key partners include the Ghana Water Company, local district assemblies, and the community members themselves.`;

export const ProjectInputForm: React.FC<ProjectInputFormProps> = ({ onEvaluate }) => {
  const [title, setTitle] = useState<string>('Clean Water Initiative for Rural Villages in Northern Ghana');
  const [description, setDescription] = useState<string>(exampleProject);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onEvaluate(title, `Project Title: ${title}\n\nProject Description:\n${description}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl shadow-slate-950/50 border border-slate-700 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-2 text-slate-100">Evaluate a Development Project</h2>
      <p className="text-slate-400 mb-6 text-center">Paste your project proposal, logframe, or description below to get an AI-powered evaluation based on OECD-DAC criteria.</p>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title (e.g., Girls' Education in Senegal)"
          className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 text-slate-100 placeholder-slate-500"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste your detailed project description here..."
          className="w-full h-64 px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300 text-slate-100 placeholder-slate-500 resize-y"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 self-center"
        >
          Evaluate Project
        </button>
      </form>
    </div>
  );
};
