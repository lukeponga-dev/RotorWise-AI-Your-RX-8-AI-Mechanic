import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './icons';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
    currentKey: string | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
    const [apiKeyInput, setApiKeyInput] = useState('');

    useEffect(() => {
        setApiKeyInput(currentKey || '');
    }, [currentKey, isOpen]);

    if (!isOpen) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(apiKeyInput.trim());
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-brand-surface w-full max-w-md rounded-xl border border-brand-border p-6 space-y-4"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">API Key Settings</h2>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-brand-surface-hover">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-sm text-brand-text-secondary">
                    Your Google AI API key is required to run diagnostics. It's saved securely in your browser's local storage and never sent anywhere else.
                </p>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="api-key-input" className="block text-sm font-medium text-brand-text-secondary mb-1">
                            Gemini API Key
                        </label>
                        <input
                            id="api-key-input"
                            type="password"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            placeholder="Enter your API key"
                            className="w-full bg-brand-surface-hover rounded-lg h-11 px-4 text-sm text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md text-sm font-semibold bg-brand-surface-hover hover:bg-brand-surface-hover-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md text-sm font-semibold bg-brand-accent hover:bg-brand-accent-hover text-white disabled:bg-brand-accent/50"
                            disabled={!apiKeyInput.trim()}
                        >
                            Save Key
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};