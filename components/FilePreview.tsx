import React from 'react';
import type { UploadedFile } from '../types';
import { SpinnerIcon, XMarkIcon, VideoCameraIcon, ExclamationCircleIcon, PhotoIcon, DocumentIcon } from './icons';

interface FilePreviewProps {
    file: UploadedFile;
    onRemove: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {

    const renderPreview = () => {
        switch (file.type) {
            case 'image':
                return (
                    <>
                        <img src={file.previewUrl} alt={file.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black/50 p-0.5 rounded">
                            <PhotoIcon className="w-3 h-3 text-white" />
                        </div>
                    </>
                );
            case 'video':
                return (
                    <>
                        <video src={file.previewUrl} preload="metadata" className="w-full h-full object-cover" muted playsInline />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <VideoCameraIcon className="w-6 h-6 text-white" />
                        </div>
                    </>
                );
            case 'other':
                return (
                    <div className="w-full h-full flex items-center justify-center bg-brand-surface-hover-2">
                        <DocumentIcon className="w-8 h-8 text-brand-text-secondary" />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderOverlay = () => {
        switch (file.status) {
            case 'uploading':
                return (
                    <div className="absolute inset-0 bg-brand-surface/70 flex items-center justify-center">
                        <SpinnerIcon className="w-6 h-6 text-brand-text-primary animate-spin" />
                    </div>
                );
            case 'error':
                return (
                    <div className="absolute inset-0 bg-brand-red/70 flex flex-col items-center justify-center text-center p-1">
                        <ExclamationCircleIcon className="w-6 h-6 text-white" />
                        <span className="text-xs text-white font-semibold mt-1">Error</span>
                    </div>
                );
            case 'complete':
            default:
                return null;
        }
    };

    return (
        <div className="relative group w-20 h-20 rounded-lg bg-brand-surface-hover overflow-hidden border border-brand-border">
            {renderPreview()}
            {renderOverlay()}
            
            <button
                type="button"
                onClick={onRemove}
                className="absolute -top-1.5 -right-1.5 bg-brand-surface-hover-2 border border-brand-border rounded-full p-0.5 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-red/50 transition-all duration-200"
                aria-label={`Remove ${file.name}`}
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
};
