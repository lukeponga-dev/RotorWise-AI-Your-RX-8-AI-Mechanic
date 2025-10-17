import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import type { UploadedFile } from '../types';
import { PaperclipIcon, SendIcon } from './icons';
import { FilePreview } from './FilePreview';

interface DiagnosticFormProps {
    initialUserInput: string;
    initialVin: string;
    onSubmit: (userInput: string, vin: string) => void;
    isLoading: boolean;
    files: UploadedFile[];
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (id: string) => void;
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({
    initialUserInput,
    initialVin,
    onSubmit,
    isLoading,
    files,
    onFileChange,
    onRemoveFile,
}) => {
    const [userInput, setUserInput] = useState(initialUserInput);
    const [vin, setVin] = useState(initialVin);
    const [vinError, setVinError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasUploadingFiles = files.some(f => f.status === 'uploading');

    useEffect(() => {
        setUserInput(initialUserInput);
    }, [initialUserInput]);

    useEffect(() => {
        setVin(initialVin);
    }, [initialVin]);

    // Auto-resize textarea
    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [userInput]);

    const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setVin(value);

        // An empty VIN is valid as it's optional
        if (value === '') {
            setVinError(null);
            return;
        }

        // Check for invalid characters first
        if (!/^[A-Z0-9]*$/.test(value)) {
            setVinError('VIN can only contain letters and numbers.');
            return;
        }

        // Check for length
        if (value.length !== 17) {
            setVinError('VIN must be exactly 17 characters long.');
            return;
        }
        
        // If all checks pass
        setVinError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !userInput.trim() || hasUploadingFiles || !!vinError) return;
        onSubmit(userInput, vin);
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="space-y-3">
                {files.length > 0 && (
                    <div className="space-y-2">
                        {files.map((file) => (
                            <FilePreview 
                                key={file.id} 
                                file={file} 
                                onRemove={() => onRemoveFile(file.id)} 
                            />
                        ))}
                    </div>
                )}
                <div className="flex flex-col md:flex-row items-start gap-3">
                    {/* Inputs container */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full md:flex-grow">
                        <textarea
                            id="problem-input"
                            ref={textareaRef}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Describe the problem with your vehicle..."
                            rows={1}
                            className="w-full bg-brand-surface-hover rounded-xl min-h-11 max-h-48 px-4 py-2.5 text-sm text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all resize-none md:col-span-2 disabled:opacity-50"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            disabled={isLoading}
                        />
                        <div>
                            <input
                                type="text"
                                value={vin}
                                onChange={handleVinChange}
                                placeholder="VIN (Optional)"
                                className={`w-full bg-brand-surface-hover rounded-xl h-11 px-4 text-sm text-brand-text-primary focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${vinError ? 'ring-2 ring-brand-red' : 'focus:ring-brand-accent'}`}
                                maxLength={17}
                                aria-invalid={!!vinError}
                                aria-describedby={vinError ? "vin-error" : undefined}
                                disabled={isLoading}
                            />
                            {vinError && <p id="vin-error" className="text-xs text-brand-red mt-1 px-1">{vinError}</p>}
                        </div>
                    </div>
                    
                    {/* Buttons container */}
                    <div className="flex items-center gap-2 w-full justify-end md:w-auto md:self-start">
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={onFileChange}
                            ref={fileInputRef}
                            className="hidden"
                            disabled={isLoading || files.length >= 5}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading || files.length >= 5}
                            className="p-3 h-11 rounded-xl bg-brand-surface-hover hover:bg-brand-surface-hover-2 disabled:opacity-50 transition-colors"
                            aria-label="Attach files"
                        >
                            <PaperclipIcon className="w-5 h-5" />
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !userInput.trim() || hasUploadingFiles || !!vinError}
                            className="p-3 h-11 rounded-xl bg-brand-accent hover:bg-brand-accent-hover disabled:bg-brand-accent/50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Submit diagnosis"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};