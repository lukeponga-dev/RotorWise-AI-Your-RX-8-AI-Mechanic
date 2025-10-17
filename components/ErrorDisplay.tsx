import React from 'react';
import { WarningIcon } from './icons';

interface ErrorDisplayProps {
  details: {
    title: string;
    message: string;
  };
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ details }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-brand-red/10 border border-brand-red/30 rounded-lg animate-fade-in">
      <WarningIcon className="w-8 h-8 text-brand-red flex-shrink-0" />
      <div>
        <h3 className="font-bold text-brand-text-primary">{details.title}</h3>
        <p className="text-red-200/90">{details.message}</p>
      </div>
    </div>
  );
};