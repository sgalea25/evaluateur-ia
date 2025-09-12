
import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  canRetry?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, canRetry = false }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500/50 rounded-2xl shadow-lg text-center">
      <AlertTriangleIcon className="w-12 h-12 text-red-400 mb-4" />
      <h2 className="text-xl font-semibold text-red-300 mb-2">An Error Occurred</h2>
      <p className="text-red-300/80 mb-6">{message}</p>
      {canRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500/80 text-white font-bold rounded-lg shadow-md hover:bg-red-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-400"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
