
import React from 'react';

interface UserMessageProps {
    entry: {
        userInput: string;
        vin?: string;
        files?: { name: string }[];
    }
}

export const UserMessage: React.FC<UserMessageProps> = ({ entry }) => {
    return (
        <div className="flex justify-end animate-fade-in">
            <div className="max-w-2xl w-full">
                <div className="flex items-start gap-3 justify-end">
                    <div className="bg-brand-accent/20 p-4 rounded-lg rounded-br-none">
                        <p className="font-semibold text-brand-text-primary whitespace-pre-wrap">{entry.userInput}</p>
                        {entry.vin && <p className="text-sm text-brand-text-secondary mt-2">VIN: {entry.vin}</p>}
                        {entry.files && entry.files.length > 0 && (
                             <p className="text-sm text-brand-text-secondary mt-2">
                                Files attached: {entry.files.map(f => f.name).join(', ')}
                             </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
