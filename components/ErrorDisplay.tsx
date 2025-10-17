
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
    <div className="flex items-start gap-3 animate-fade-in">
      <WarningIcon className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-bold text-brand-text-primary">{details.title}</h3>
        <p className="text-red-200/90">{details.message}</p>
      </div>
    </div>
  );
};
