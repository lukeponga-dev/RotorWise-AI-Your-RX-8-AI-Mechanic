
export interface PossibleCause {
  cause: string;
  likelihood: 'High' | 'Medium' | 'Low';
  explanation: string;
}

export interface RecommendedAction {
  action: string;
  difficulty: 'DIY' | 'Intermediate' | 'Professional';
}

export interface DiagnosticReport {
  problemSummary: string;
  observationsFromMedia?: string;
  possibleCauses: PossibleCause[];
  diagnosticSteps: string[];
  recommendedActions: RecommendedAction[];
  requiredPartsAndTools?: string[];
  safetyWarning: string;
}

export interface UploadedFile {
  id: string; // Unique identifier for each file
  base64?: string; // Optional because it's added after processing
  mimeType: string;
  previewUrl: string; // Object URL for client-side preview
  name: string;
  status: 'uploading' | 'complete' | 'error';
  type: 'image' | 'video' | 'other';
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  userInput: string;
  vin: string;
  files: { name: string; mimeType: string }[];
  report: DiagnosticReport;
}

export type ErrorState = {
  title: string;
  message: string;
} | null;
