import React from 'react';
import { HistoryIcon, RotorIcon } from './icons';

interface HeaderProps {
    onToggleHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory }) => {
    return (
        <header className="flex-shrink-0 flex items-center justify-between p-4 md:p-6 border-b border-brand-border">
            <div className="flex items-center gap-3">
                <RotorIcon className="w-8 h-8 text-brand-accent" />
                <h1 className="text-xl font-bold text-brand-text-primary">RotorWise AI</h1>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleHistory}
                    className="lg:hidden p-2 rounded-md hover:bg-brand-surface-hover focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    aria-label="Toggle history panel"
                >
                    <HistoryIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};