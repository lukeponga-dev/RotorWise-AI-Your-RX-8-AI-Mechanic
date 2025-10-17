// Fix: Use GenerateContentParameters instead of deprecated GenerateContentRequest.
import { GoogleGenAI, Type, GenerateContentParameters } from "@google/genai";
import type { DiagnosticReport } from '../types';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        problemSummary: { 
            type: Type.STRING,
            description: "A concise summary of the diagnosed problem."
        },
        observationsFromMedia: { 
            type: Type.STRING,
            description: "If media (images/videos) was provided, describe what was observed from it. Otherwise, state that no media was provided."
        },
        possibleCauses: {
            type: Type.ARRAY,
            description: "A list of possible causes for the problem, ranked from most to least likely.",
            items: {
                type: Type.OBJECT,
                properties: {
                    cause: { 
                        type: Type.STRING,
                        description: "A description of the possible cause."
                    },
                    likelihood: { 
                        type: Type.STRING, 
                        enum: ['High', 'Medium', 'Low'],
                        description: "The likelihood of this being the cause."
                    },
                    explanation: { 
                        type: Type.STRING,
                        description: "An explanation of why this is a possible cause."
                    },
                },
                required: ['cause', 'likelihood', 'explanation'],
            },
        },
        diagnosticSteps: {
            type: Type.ARRAY,
            description: "A step-by-step guide to diagnose the problem further.",
            items: { type: Type.STRING },
        },
        recommendedActions: {
            type: Type.ARRAY,
            description: "A list of recommended actions to fix the problem.",
            items: {
                type: Type.OBJECT,
                properties: {
                    action: { 
                        type: Type.STRING,
                        description: "The recommended action to take."
                    },
                    difficulty: { 
                        type: Type.STRING, 
                        enum: ['DIY', 'Intermediate', 'Professional'],
                        description: "The difficulty level of the action (Do-It-Yourself, Intermediate, or requires a Professional)."
                    },
                },
                required: ['action', 'difficulty'],
            },
        },
        requiredPartsAndTools: {
            type: Type.ARRAY,
            description: "A list of parts and tools that might be required for the repair.",
            items: { type: Type.STRING },
        },
        safetyWarning: { 
            type: Type.STRING,
            description: "An important safety warning regarding the diagnosis and repair process."
        },
    },
    required: [
        'problemSummary',
        'possibleCauses',
        'diagnosticSteps',
        'recommendedActions',
        'safetyWarning',
    ],
};


export const getDiagnostics = async (
    userInput: string,
    vin: string,
    files: { base64: string, mimeType: string }[],
    apiKey: string
): Promise<DiagnosticReport> => {
    
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are "RotorWise AI", an expert automotive diagnostic assistant for all types of vehicles. Your goal is to provide a comprehensive, accurate, and safe diagnostic report based on user-provided information.
    
    Follow these instructions carefully:
    1.  Analyze the user's description of the problem, any provided VIN, and any uploaded media (images/videos).
    2.  If media is provided, mention what you observe in the 'observationsFromMedia' field.
    3.  Generate a diagnostic report in the specified JSON format.
    4.  The 'problemSummary' should be a brief, one-sentence summary.
    5.  'possibleCauses' should be ordered from most likely to least likely.
    6.  'diagnosticSteps' should be clear, sequential, and easy for a non-expert to follow.
    7.  'recommendedActions' should provide actionable solutions.
    8.  'requiredPartsAndTools' is optional, but include it if specific items are needed.
    9.  The 'safetyWarning' is CRITICAL. Always include a strong, clear safety warning, advising the user to consult a professional if they are unsure, and to prioritize safety above all else (e.g., disconnecting the battery, using jack stands, wearing protective gear).
    10. If the VIN is provided, use it to make the diagnosis more specific to the vehicle's make, model, and year.
    11. Your tone should be helpful, professional, and reassuring.
    `;

    const textParts = [];
    textParts.push(`Problem Description: "${userInput}"`);
    if (vin) {
        textParts.push(`VIN: ${vin}`);
    }
    if (files.length === 0) {
        textParts.push("No media files were provided.");
    }

    const prompt = textParts.join('\n');
    
    const imageParts = files.map(file => ({
        inlineData: {
            data: file.base64,
            mimeType: file.mimeType,
        },
    }));

    // Fix: Use GenerateContentParameters instead of deprecated GenerateContentRequest.
    const contents: GenerateContentParameters['contents'] = {
        parts: [{ text: prompt }, ...imageParts]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: contents,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema,
            }
        });

        const jsonText = response.text;
        const report = JSON.parse(jsonText) as DiagnosticReport;
        return report;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (message.includes('api key not valid')) {
                throw new Error('INVALID_API_KEY');
            }
            if (message.includes('rate limit')) {
                throw new Error('RATE_LIMITED');
            }
            if (error.name === 'TypeError' && message.includes('failed to fetch')) {
                throw new Error('NETWORK_ERROR');
            }
            // Re-throw other specific errors to be handled by the UI
            throw error;
        }
        // For non-Error objects caught
        throw new Error("UNKNOWN_ERROR");
    }
};