import React, { useState, useRef, useEffect } from 'react';
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
    onRemoveFile
}) => {
    const [userInput, setUserInput] = useState(initialUserInput);
    const [vin, setVin] = useState(initialVin);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasUploadingFiles = files.some(f => f.status === 'uploading');

    useEffect(() => {
        setUserInput(initialUserInput);
    }, [initialUserInput]);

    useEffect(() => {
        setVin(initialVin);
    }, [initialVin]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !userInput.trim() || hasUploadingFiles) return;
        onSubmit(userInput, vin);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {files.length > 0 && (
                <div className="flex flex-wrap gap-3 p-1">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:flex-grow">
                    <input
                        type="text"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                        placeholder="VIN (Optional)"
                        className="w-full bg-brand-surface-hover rounded-xl h-11 px-4 text-sm text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
                    />
                    <textarea
                        id="problem-input"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Describe the problem with your vehicle..."
                        rows={1}
                        className="w-full bg-brand-surface-hover rounded-xl h-11 px-4 py-2.5 text-sm text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all resize-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        disabled={isLoading}
                    />
                </div>
                
                {/* Buttons container */}
                <div className="flex items-center gap-2 self-end md:self-start">
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
                        disabled={isLoading || !userInput.trim() || hasUploadingFiles}
                        className="p-3 h-11 rounded-xl bg-brand-accent hover:bg-brand-accent-hover disabled:bg-brand-accent/50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Submit diagnosis"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </form>
    );
};