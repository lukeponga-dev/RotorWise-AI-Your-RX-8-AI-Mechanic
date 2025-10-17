import React from 'react';
import type { HistoryEntry } from '../types';
import { PlusIcon, TrashIcon, XMarkIcon } from './icons';

interface HistoryPanelProps {
    history: HistoryEntry[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onNew: () => void;
    onClear: () => void;
    isMobile?: boolean;
    onClose?: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
    history,
    selectedId,
    onSelect,
    onNew,
    onClear,
    isMobile = false,
    onClose,
}) => {
    return (
        <div className="bg-brand-surface h-full flex flex-col rounded-xl border border-brand-border overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-brand-border">
                <h2 className="font-bold text-lg">History</h2>
                {isMobile && (
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-brand-surface-hover">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div className="p-2">
                <button
                    onClick={onNew}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-brand-surface-hover transition-colors"
                >
                    <PlusIcon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-semibold">New Diagnosis</span>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-1 p-2">
                {history.slice().reverse().map(entry => (
                    <button
                        key={entry.id}
                        onClick={() => onSelect(entry.id)}
                        className={`w-full p-3 text-left rounded-lg transition-colors text-sm ${
                            selectedId === entry.id
                                ? 'bg-brand-accent/20 text-brand-text-primary'
                                : 'hover:bg-brand-surface-hover text-brand-text-secondary'
                        }`}
                    >
                        <p className="font-medium truncate text-brand-text-primary">{entry.userInput}</p>
                        <p className="text-xs mt-1">{new Date(entry.timestamp).toLocaleString()}</p>
                    </button>
                ))}
            </div>
            {history.length > 0 && (
                <div className="p-2 border-t border-brand-border">
                    <button
                        onClick={onClear}
                        className="w-full flex items-center justify-center gap-2 p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Clear History
                    </button>
                </div>
            )}
        </div>
    );
};
