
import React, { useState, useEffect } from 'react';
import { RotorIcon } from './icons';

interface LoadingIndicatorProps {
  message: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <RotorIcon className="w-20 h-20 animate-spin" />
      <p className="mt-6 text-xl font-semibold text-brand-text-primary">
        {message}<span className="w-4 inline-block text-left">{dots}</span>
      </p>
      <p className="mt-2 text-brand-text-secondary">This may take a moment.</p>
    </div>
  );
};