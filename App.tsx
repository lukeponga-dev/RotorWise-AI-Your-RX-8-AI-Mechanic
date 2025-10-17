import React, { useState, useEffect, useRef } from 'react';
// RENAMED IMPORTS TO USE THE 'components/' FOLDER:
import { DiagnosticForm } from './components/DiagnosticForm';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ReportDisplay } from './components/ReportDisplay';
import { HistoryPanel } from './components/HistoryPanel';
import { UserMessage } from './components/UserMessage';
import { AIMessage } from './components/AIMessage';
import { ApiKeyPromptScreen } from './components/ApiKeyPromptScreen';
import { SettingsModal } from './components/SettingsModal';
// SERVICE AND TYPE IMPORTS remain the same if they are still located
// in the same relative position (e.g., './geminiService' and '../types'):
import { getDiagnostics } from '../geminiService';
import type { UploadedFile, HistoryEntry, ErrorState } from '../types';

const STORAGE_KEY = 'rotorwise_ai_history';
const API_KEY_STORAGE_KEY = 'rotorwise_ai_gemini_api_key';
type ViewState = 'welcome' | 'loading' | 'error' | 'report';

const App: React.FC = () => {
  // Form State
  const [userInput, setUserInput] = useState('');
  const [vin, setVin] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);

  // App flow state
  const [view, setView] = useState<ViewState>('welcome');
  const [error, setError] = useState<ErrorState>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // History State
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  // Refs for chat behavior
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastUserInput = useRef('');
  const lastUserVin = useRef('');

  useEffect(() => {
    // Load API key from local storage on initial render
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory: HistoryEntry[] = JSON.parse(storedHistory);
        setHistory(parsedHistory);
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);
  
  useEffect(() => {
    const setViewportHeight = () => {
      if (window.visualViewport) {
        document.documentElement.style.setProperty('--viewport-height', `${window.visualViewport.height}px`);
      }
    };

    setViewportHeight();
    window.visualViewport?.addEventListener('resize', setViewportHeight);

    return () => window.visualViewport?.removeEventListener('resize', setViewportHeight);
  }, []);

  useEffect(() => {
    try {
      if (history.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);
  
  useEffect(() => {
    // Scroll to the bottom of the chat when new content is added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [view, selectedHistoryId]);


  const handleSaveApiKey = (newApiKey: string) => {
    if (newApiKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, newApiKey);
      setApiKey(newApiKey);
      setIsSettingsModalOpen(false);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setApiKey(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles: File[] = Array.from(event.target.files);
    const availableSlots = 5 - files.length;

    if (newFiles.length > availableSlots) {
        alert(`You can only upload ${availableSlots > 0 ? `${availableSlots} more` : 'no more'} file(s). A maximum of 5 is allowed.`);
    }
    
    const filesToProcess = newFiles.slice(0, availableSlots);
    if (filesToProcess.length === 0) return;

    const placeholderFiles: UploadedFile[] = filesToProcess.map(file => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        mimeType: file.type,
        previewUrl: URL.createObjectURL(file),
        status: 'uploading',
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'other',
    }));

    setFiles(prev => [...prev, ...placeholderFiles]);

    placeholderFiles.forEach((placeholder, index) => {
        const originalFile = filesToProcess[index];
        fileToBase64(originalFile)
            .then(base64 => {
                setFiles(prev =>
                    prev.map(f =>
                        f.id === placeholder.id
                            ? { ...f, status: 'complete', base64 }
                            : f
                    )
                );
            })
            .catch(error => {
                console.error("Error processing file:", error);
                setFiles(prev =>
                    prev.map(f =>
                        f.id === placeholder.id
                            ? { ...f, status: 'error' }
                            : f
                    )
                );
            });
    });
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === id);
      if(fileToRemove) {
          URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prevFiles.filter(f => f.id !== id);
    });
  };

  const handleSubmit = async (currentInput: string, currentVin: string) => {
    if (!currentInput.trim() || !apiKey) return;
    
    lastUserInput.current = currentInput;
    lastUserVin.current = currentVin;
    
    setIsLoading(true);
    setView('loading');
    setError(null);
    setSelectedHistoryId(null); // Deselect history to show the loading state for the new query

    try {
      const completedFiles = files.filter(f => f.status === 'complete' && f.base64);
      const fileData = completedFiles.map(f => ({ base64: f.base64!, mimeType: f.mimeType }));
      const result = await getDiagnostics(currentInput, currentVin, fileData, apiKey);
      
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        userInput: currentInput,
        vin: currentVin,
        files: files.map(f => ({ name: f.name, mimeType: f.mimeType })),
        report: result,
      };
      
      setHistory(prev => [...prev, newEntry]);
      setSelectedHistoryId(newEntry.id);
      setUserInput('');
      setVin('');
      files.forEach(file => URL.revokeObjectURL(file.previewUrl));
      setFiles([]);
      setView('report');

    } catch (err) {
      let errorDetails = {
        title: 'An Unknown Error Occurred',
        message: 'Something went wrong. Please check the console for details and try again.'
      };

      if (err instanceof Error) {
        if (err.message.includes('API key not valid')) {
            errorDetails = {
              title: 'Invalid API Key',
              message: 'Your API key is invalid or missing permissions. Please correct it in the settings and try again.'
            };
        } else {
            switch (err.message) {
              case 'INVALID_API_KEY':
                errorDetails = {
                  title: 'Invalid API Key',
                  message: 'Your API key is invalid or missing permissions. Please correct it in the settings and try again.'
                };
                break;
              case 'RATE_LIMITED':
                errorDetails = {
                  title: 'Rate Limit Exceeded',
                  message: 'You have made too many requests in a short period. Please wait a moment before trying again.'
                };
                break;
              case 'NETWORK_ERROR':
                errorDetails = {
                  title: 'Network Error',
                  message: 'Could not connect to the AI service. Please check your internet connection and try again.'
                };
                break;
              default:
                errorDetails = {
                  title: 'AI Service Error',
                  message: `An unexpected error occurred while communicating with the AI service: ${err.message}`
                };
                break;
            }
        }
      }
      
      setError(errorDetails);
      setView('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleSelect = (prompt: string) => {
    setUserInput(prompt);
    setVin('');
    setFiles([]);
    setSelectedHistoryId(null);
    setView('welcome');
    setTimeout(() => {
        const input = document.getElementById('problem-input');
        if (input) input.focus();
    }, 100);
  };

  const handleNewDiagnosis = () => {
    setUserInput('');
    setVin('');
    files.forEach(file => URL.revokeObjectURL(file.previewUrl));
    setFiles([]);
    setError(null);
    setSelectedHistoryId(null);
    lastUserInput.current = '';
    lastUserVin.current = '';
    setView('welcome');
    setIsHistoryVisible(false);
  };
  
  const handleSelectHistory = (id: string) => {
    setSelectedHistoryId(id);
    setView('report');
    setIsHistoryVisible(false);
  }
  
  const handleClearHistory = () => {
    setHistory([]);
    setSelectedHistoryId(null);
    setView('welcome');
  }

  const currentHistoryEntry = history.find(entry => entry.id === selectedHistoryId);
  const loadingMessage = files.filter(f => f.status === 'complete').length > 0 ? 'Processing media and analyzing symptoms' : 'Analyzing symptoms';

  const renderChatContent = () => {
    if (view === 'report' && currentHistoryEntry) {
      return (
        <>
          <UserMessage entry={currentHistoryEntry} />
          <AIMessage report={currentHistoryEntry.report}>
            <ReportDisplay report={currentHistoryEntry.report} />
          </AIMessage>
        </>
      );
    }

    if (view === 'loading' || view === 'error') {
      const submittedEntry = {
        userInput: lastUserInput.current,
        vin: lastUserVin.current,
        files: files.map(f => ({ name: f.name, mimeType: f.mimeType })),
      };

      return (
        <>
          <UserMessage entry={submittedEntry} />
          {view === 'loading' && <AIMessage isLoading={true} message={loadingMessage} />}
          {view === 'error' && error && <AIMessage hasError={true} errorDetails={error} />}
        </>
      );
    }
    
    // Default welcome state, shown only when no history is selected
    if (!selectedHistoryId) {
        return <WelcomeScreen onExampleSelect={handleExampleSelect} />;
    }

    return null;
  };

  if (!apiKey) {
    return (
        <>
            <ApiKeyPromptScreen onOpenSettings={() => setIsSettingsModalOpen(true)} />
            <SettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                onSave={handleSaveApiKey}
                currentKey={apiKey}
            />
        </>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen text-brand-text-primary font-sans">
      <SettingsModal 
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={handleSaveApiKey}
          currentKey={apiKey}
      />
      <div className="container mx-auto max-w-screen-2xl h-[var(--viewport-height,100vh)] max-h-[var(--viewport-height,100vh)] flex flex-col">
        <Header onToggleHistory={() => setIsHistoryVisible(true)} onOpenSettings={() => setIsSettingsModalOpen(true)} />
        <div className="flex-grow flex gap-4 md:gap-6 min-h-0 relative p-4 md:p-6 md:pt-0">
          {/* Mobile History Panel Overlay */}
          <div className={`fixed lg:hidden top-0 left-0 h-full w-80 z-50 transition-transform duration-300 ease-in-out ${isHistoryVisible ? 'translate-x-0' : '-translate-x-full'}`}>
            <HistoryPanel history={history} selectedId={selectedHistoryId} onSelect={handleSelectHistory} onNew={handleNewDiagnosis} onClear={handleClearHistory} isMobile={true} onClose={() => setIsHistoryVisible(false)} />
          </div>
          {isHistoryVisible && <div className="fixed lg:hidden inset-0 bg-black/60 z-40" onClick={() => setIsHistoryVisible(false)} aria-hidden="true"></div>}

          {/* Desktop History Panel */}
          <div className="hidden lg:flex flex-col w-80 flex-shrink-0 h-full max-h-full">
             <HistoryPanel history={history} selectedId={selectedHistoryId} onSelect={handleSelectHistory} onNew={handleNewDiagnosis} onClear={handleClearHistory} />
          </div>

          <main className="flex-grow h-full flex flex-col bg-brand-surface rounded-xl border border-brand-border overflow-hidden">
             <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
                {renderChatContent()}
             </div>
             <div className="flex-shrink-0 p-3 md:p-4 bg-brand-surface/80 backdrop-blur-sm border-t border-brand-border">
                <DiagnosticForm 
                    initialUserInput={userInput}
                    initialVin={vin}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    files={files}
                    onFileChange={handleFileChange}
                    onRemoveFile={handleRemoveFile}
                />
             </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
