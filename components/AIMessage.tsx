
import React from 'react';
import { RotorIcon } from './icons';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorDisplay } from './ErrorDisplay';
import type { ErrorState } from '../types';

interface AIMessageProps {
    children?: React.ReactNode;
    isLoading?: boolean;
    message?: string;
    hasError?: boolean;
    errorDetails?: ErrorState;
}

export const AIMessage: React.FC<AIMessageProps> = ({ children, isLoading, message, hasError, errorDetails }) => {
    let content = children;
    if (isLoading && message) {
        content = <LoadingIndicator message={message} />;
    } else if (hasError && errorDetails) {
        content = <ErrorDisplay details={errorDetails} />;
    }

    if (!content) {
        return null;
    }
    
    return (
        <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0 mt-1">
                <RotorIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-grow max-w-2xl w-full">
                <div className="font-bold text-brand-text-primary mb-2">RotorWise AI</div>
                <div className={`p-4 rounded-lg rounded-tl-none ${hasError ? 'bg-brand-red/10 border border-brand-red/30' : 'bg-brand-surface-hover'}`}>
                    {content}
                </div>
            </div>
        </div>
    );
};
