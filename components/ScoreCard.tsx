
import React from 'react';

interface ScoreCardProps {
  score: number;
  title: string;
  icon?: React.ReactNode;
  size?: 'normal' | 'large';
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, title, icon, size = 'normal' }) => {
  const isLarge = size === 'large';
  const radius = isLarge ? 70 : 40;
  const stroke = isLarge ? 12 : 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-green-400';
    if (s >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getTrackColor = (s: number) => {
    if (s >= 90) return 'stroke-green-400';
    if (s >= 50) return 'stroke-yellow-400';
    return 'stroke-red-400';
  };

  const scoreColor = getScoreColor(score);
  const trackColor = getTrackColor(score);

  return (
    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 shadow-lg flex flex-col items-center justify-center text-center h-full">
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            className="text-slate-700"
            stroke="currentColor"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className={`${trackColor} transition-all duration-1000 ease-out`}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${scoreColor}`}>
          <span className={`font-bold ${isLarge ? 'text-4xl' : 'text-2xl'}`}>{score}</span>
          {!isLarge && <span className="text-xs text-slate-400">/ 100</span>}
        </div>
      </div>
      <div className={`mt-3 flex items-center gap-2 ${isLarge ? 'text-lg' : 'text-base'}`}>
        {icon}
        <h3 className="font-semibold text-slate-200">{title}</h3>
      </div>
    </div>
  );
};
