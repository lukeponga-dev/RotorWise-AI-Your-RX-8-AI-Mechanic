import React from 'react';
import { RotorIcon } from './icons';

interface WelcomeScreenProps {
  onExampleSelect: (prompt: string) => void;
}

const examplePrompts = [
  "My 2018 Honda Civic is making a weird rattling noise from the engine bay, especially when I accelerate.",
  "The brakes on my Ford F-150 feel spongy and I have to press the pedal almost to the floor to stop.",
  "My car won't start. The lights on the dashboard flicker when I turn the key, but the engine just clicks once.",
  "There's a sweet, syrupy smell coming from my vents and the car is starting to overheat."
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in">
        <RotorIcon className="w-24 h-24 text-brand-accent" />
        <h1 className="mt-6 text-3xl font-bold text-brand-text-primary">Welcome to RotorWise AI</h1>
        <p className="mt-2 max-w-2xl text-brand-text-secondary">
            I can help diagnose issues with your vehicle. Describe the problem using the form below to get started.
        </p>
        <div className="mt-8 w-full max-w-3xl">
            <h2 className="text-lg font-semibold text-brand-text-primary">Or, start with an example problem:</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {examplePrompts.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => onExampleSelect(prompt)}
                        className="p-4 bg-brand-surface-hover rounded-lg text-left hover:bg-brand-surface-hover-2 transition-colors duration-200"
                    >
                        <p className="text-sm text-brand-text-secondary">{prompt}</p>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};