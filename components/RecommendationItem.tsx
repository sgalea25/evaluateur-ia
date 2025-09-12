
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface RecommendationItemProps {
  text: string;
  type: 'strength' | 'weakness';
}

export const RecommendationItem: React.FC<RecommendationItemProps> = ({ text, type }) => {
  const isStrength = type === 'strength';
  
  return (
    <li className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        {isStrength ? (
          <CheckCircleIcon className="w-5 h-5 text-green-400" />
        ) : (
          <XCircleIcon className="w-5 h-5 text-red-400" />
        )}
      </div>
      <p className="text-slate-300 text-sm">{text}</p>
    </li>
  );
};
