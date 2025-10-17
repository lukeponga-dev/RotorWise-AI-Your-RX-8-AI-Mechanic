import React, { useState, useEffect, useRef } from 'react';
import { RotorIcon, SpeakerWaveIcon, PauseIcon, PlayIcon } from './icons';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorDisplay } from './ErrorDisplay';
import type { ErrorState, DiagnosticReport } from '../types';

interface AIMessageProps {
    children?: React.ReactNode;
    isLoading?: boolean;
    message?: string;
    hasError?: boolean;
    errorDetails?: ErrorState;
    report?: DiagnosticReport;
}

const reportToText = (reportData: DiagnosticReport): string => {
    const parts: string[] = [];
    parts.push(`Problem Summary: ${reportData.problemSummary}`);
    if (reportData.observationsFromMedia) {
        parts.push(`Observations from Media: ${reportData.observationsFromMedia}`);
    }
    parts.push("Possible Causes:");
    reportData.possibleCauses.forEach(c => {
        parts.push(`${c.likelihood} likelihood: ${c.cause}. ${c.explanation}`);
    });
    parts.push("Diagnostic Steps:");
    reportData.diagnosticSteps.forEach((step, i) => {
        parts.push(`Step ${i + 1}: ${step}`);
    });
    parts.push("Recommended Actions:");
    reportData.recommendedActions.forEach(a => {
        parts.push(`${a.action}, which is a ${a.difficulty} task.`);
    });
    if (reportData.requiredPartsAndTools && reportData.requiredPartsAndTools.length > 0) {
        parts.push(`Required Parts and Tools: ${reportData.requiredPartsAndTools.join(', ')}.`);
    }
    parts.push(`Safety Warning: ${reportData.safetyWarning}`);
    return parts.join('\n\n');
};

export const AIMessage: React.FC<AIMessageProps> = ({ children, isLoading, message, hasError, errorDetails, report }) => {
    const [speechState, setSpeechState] = useState<'idle' | 'playing' | 'paused'>('idle');
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    useEffect(() => {
        // Stop speech when the component unmounts or the report changes
        return () => {
            if (isSpeechSupported) {
                window.speechSynthesis.cancel();
            }
        };
    }, [report, isSpeechSupported]);
    
    const handleToggleSpeech = () => {
        if (!report || !isSpeechSupported) return;

        if (speechState === 'playing') {
            window.speechSynthesis.pause();
        } else if (speechState === 'paused') {
            window.speechSynthesis.resume();
        } else { // 'idle'
            window.speechSynthesis.cancel(); // Cancel any previous utterance
            
            const textToSpeak = reportToText(report);
            const newUtterance = new SpeechSynthesisUtterance(textToSpeak);
            
            newUtterance.onstart = () => setSpeechState('playing');
            newUtterance.onpause = () => setSpeechState('paused');
            newUtterance.onresume = () => setSpeechState('playing');
            newUtterance.onend = () => {
                setSpeechState('idle');
                utteranceRef.current = null;
            };
            newUtterance.onerror = (e) => {
                console.error("Speech synthesis error", e);
                setSpeechState('idle');
                utteranceRef.current = null;
            };

            utteranceRef.current = newUtterance;
            window.speechSynthesis.speak(newUtterance);
        }
    };

    let content = children;
    if (isLoading && message) {
        content = <LoadingIndicator message={message} />;
    } else if (hasError && errorDetails) {
        content = <ErrorDisplay details={errorDetails} />;
    }

    if (!content) {
        return null;
    }

    const renderSpeechIcon = () => {
        switch(speechState) {
            case 'playing': return <PauseIcon className="w-5 h-5" />;
            case 'paused': return <PlayIcon className="w-5 h-5" />;
            case 'idle':
            default:
                return <SpeakerWaveIcon className="w-5 h-5" />;
        }
    };
    
    return (
        <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center flex-shrink-0 mt-1">
                <RotorIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-grow max-w-2xl w-full">
                <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-brand-text-primary">RotorWise AI</div>
                    {isSpeechSupported && report && !isLoading && !hasError && (
                        <button 
                            onClick={handleToggleSpeech} 
                            className="p-2 rounded-md text-brand-text-secondary hover:bg-brand-surface-hover-2 hover:text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-accent"
                            aria-label={speechState === 'playing' ? 'Pause reading' : speechState === 'paused' ? 'Resume reading' : 'Read aloud'}
                        >
                            {renderSpeechIcon()}
                        </button>
                    )}
                </div>
                <div className={`p-4 rounded-lg rounded-tl-none ${hasError ? 'bg-red-500/10 border border-red-500/30' : 'bg-brand-surface-hover'}`}>
                    {content}
                </div>
            </div>
        </div>
    );
};
