import React from 'react';
import type { UploadedFile } from '../types';
import { SpinnerIcon, XMarkIcon, VideoCameraIcon, ExclamationCircleIcon, PhotoIcon, DocumentIcon, CheckCircleIcon } from './icons';

interface FilePreviewProps {
    file: UploadedFile;
    onRemove: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {

    const getFileIcon = () => {
        switch (file.type) {
            case 'image':
                return <PhotoIcon className="w-6 h-6 text-brand-text-secondary flex-shrink-0" />;
            case 'video':
                return <VideoCameraIcon className="w-6 h-6 text-brand-text-secondary flex-shrink-0" />;
            default:
                return <DocumentIcon className="w-6 h-6 text-brand-text-secondary flex-shrink-0" />;
        }
    };

    const getStatusIndicator = () => {
        switch (file.status) {
            case 'uploading':
                return <SpinnerIcon className="w-5 h-5 text-brand-accent animate-spin" />;
            case 'complete':
                return <CheckCircleIcon className="w-5 h-5 text-emerald-400" />;
            case 'error':
                return <ExclamationCircleIcon className="w-5 h-5 text-brand-red" />;
            default:
                return null;
        }
    };
    
    const getStatusText = () => {
        switch (file.status) {
            case 'uploading':
                return 'Processing...';
            case 'complete':
                return 'Ready';
            case 'error':
                return 'Upload failed';
            default:
                return '';
        }
    }

    return (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-brand-surface-hover border border-brand-border animate-fade-in">
            {getFileIcon()}
            <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-brand-text-primary truncate">{file.name}</p>
                <p className={`text-xs ${file.status === 'error' ? 'text-brand-red' : 'text-brand-text-secondary'}`}>
                    {getStatusText()}
                </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
                {getStatusIndicator()}
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1 rounded-full text-brand-text-secondary hover:bg-brand-surface-hover-2 hover:text-brand-text-primary transition-colors"
                    aria-label={`Remove ${file.name}`}
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};