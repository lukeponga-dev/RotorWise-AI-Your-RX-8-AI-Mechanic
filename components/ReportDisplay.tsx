import React from 'react';
import type { DiagnosticReport, PossibleCause, RecommendedAction } from '../types';
import { ChevronRightIcon, WarningIcon } from './icons';

const getLikelihoodClass = (likelihood: PossibleCause['likelihood']) => {
    switch (likelihood) {
        case 'High': return 'bg-red-500/20 text-red-400';
        case 'Medium': return 'bg-amber-500/20 text-amber-400';
        case 'Low': return 'bg-emerald-500/20 text-emerald-400';
        default: return 'bg-brand-surface-hover text-brand-text-secondary';
    }
}

const getDifficultyClass = (difficulty: RecommendedAction['difficulty']) => {
    switch (difficulty) {
        case 'DIY': return 'bg-emerald-500/20 text-emerald-400';
        case 'Intermediate': return 'bg-amber-500/20 text-amber-400';
        case 'Professional': return 'bg-red-500/20 text-red-400';
        default: return 'bg-brand-surface-hover text-brand-text-secondary';
    }
}

interface ReportDisplayProps {
  report: DiagnosticReport;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  return (
    <div className="space-y-6 animate-fade-in">
        {/* Summary */}
        <div className="bg-brand-surface-hover p-4 rounded-lg">
            <h2 className="text-lg font-bold text-brand-text-primary">Problem Summary</h2>
            <p className="mt-2 text-brand-text-secondary">{report.problemSummary}</p>
        </div>

        {/* Media Observations */}
        {report.observationsFromMedia && (
            <div className="bg-brand-surface-hover p-4 rounded-lg">
                <h2 className="text-lg font-bold text-brand-text-primary">Observations from Media</h2>
                <p className="mt-2 text-brand-text-secondary">{report.observationsFromMedia}</p>
            </div>
        )}

        {/* Possible Causes */}
        <div>
            <h2 className="text-lg font-bold text-brand-text-primary mb-3">Possible Causes</h2>
            <div className="space-y-3">
                {report.possibleCauses.map((cause, index) => (
                    <div key={index} className="bg-brand-surface-hover p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{cause.cause}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLikelihoodClass(cause.likelihood)}`}>
                                {cause.likelihood} Likelihood
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-brand-text-secondary">{cause.explanation}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Diagnostic Steps */}
        <div>
            <h2 className="text-lg font-bold text-brand-text-primary mb-3">Diagnostic Steps</h2>
            <ol className="list-decimal list-inside bg-brand-surface-hover p-4 rounded-lg space-y-2 text-brand-text-secondary">
                {report.diagnosticSteps.map((step, index) => <li key={index}>{step}</li>)}
            </ol>
        </div>

        {/* Recommended Actions */}
        <div>
            <h2 className="text-lg font-bold text-brand-text-primary mb-3">Recommended Actions</h2>
            <div className="space-y-3">
                {report.recommendedActions.map((action, index) => (
                    <div key={index} className="bg-brand-surface-hover p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{action.action}</h3>
                             <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyClass(action.difficulty)}`}>
                                {action.difficulty}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Required Parts and Tools */}
        {report.requiredPartsAndTools && report.requiredPartsAndTools.length > 0 && (
            <div>
                <h2 className="text-lg font-bold text-brand-text-primary mb-3">Required Parts & Tools</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-brand-text-secondary">
                    {report.requiredPartsAndTools.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 p-2 bg-brand-surface-hover rounded-md">
                            <ChevronRightIcon className="w-4 h-4 text-brand-accent"/>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        
        {/* Safety Warning */}
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <WarningIcon className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" />
            <div>
                <h3 className="font-bold text-brand-red">Safety Warning</h3>
                <p className="mt-1 text-red-300 text-sm">{report.safetyWarning}</p>
            </div>
        </div>
    </div>
  );
};