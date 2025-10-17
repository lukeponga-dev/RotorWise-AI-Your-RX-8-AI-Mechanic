import React from 'react';
import { SettingsIcon, RotorIcon } from './icons';

interface ApiKeyPromptScreenProps {
    onOpenSettings: () => void;
}

export const ApiKeyPromptScreen: React.FC<ApiKeyPromptScreenProps> = ({ onOpenSettings }) => {
    return (
        <div className="bg-brand-bg min-h-screen text-brand-text-primary font-sans flex items-center justify-center p-4">
            <div className="bg-brand-surface border border-brand-border rounded-xl p-8 max-w-lg w-full text-center animate-fade-in">
                <RotorIcon className="w-20 h-20 text-brand-accent mx-auto" />
                <h1 className="mt-6 text-3xl font-bold text-brand-text-primary">Welcome to RotorWise AI</h1>
                <p className="mt-4 text-brand-text-secondary">
                    To get started, please add your Google AI API key in the settings. This key is stored only in your browser and is required to perform diagnostics.
                </p>
                <button
                    onClick={onOpenSettings}
                    className="mt-8 w-full max-w-xs mx-auto px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover rounded-md font-semibold transition-colors text-white flex items-center justify-center gap-2"
                >
                    <SettingsIcon className="w-5 h-5" />
                    Open Settings
                </button>
                 <p className="text-xs text-brand-text-secondary/70 mt-4 text-center">
                    For more information on API keys, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-accent">billing documentation</a>.
                </p>
            </div>
        </div>
    );
};