import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Sparkles, Zap, BookOpen, ArrowRight, RotateCcw, X, Clipboard, History, Trash2, Loader2, MessageSquare, Send } from 'lucide-react';
import { solveWithVision, generateSimilarProblems } from '../services/geminiService';
import { saveQuickSolveHistory, getQuickSolveHistory, deleteQuickSolveHistoryItem, QuickSolveHistoryItem } from '../services/quicksolveHistoryService';
import { submitCameraFeedback } from '../services/feedbackService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface QuickSolveProps {
  checkTokenLimit: () => boolean;
  incrementTokenUsage: () => void;
  onNavigateToDashboard: () => void;
}

type ExplanationMode = 'nerd' | 'bro';

const QuickSolve: React.FC<QuickSolveProps> = ({ checkTokenLimit, incrementTokenUsage, onNavigateToDashboard }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [solution, setSolution] = useState<string>('');
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('nerd');
  const [showSimilarQuestions, setShowSimilarQuestions] = useState(false);
  const [similarQuestions, setSimilarQuestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<QuickSolveHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'wrong_answer' | 'unclear' | 'bug' | 'suggestion' | 'other'>('other');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setSelectedImage(imageDataUrl);
        stopCamera();
        handleSolve(imageDataUrl);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const reader = new FileReader();
            reader.onload = (event) => {
              setSelectedImage(event.target?.result as string);
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      alert('No image found in clipboard');
    } catch (err) {
      console.error('Clipboard error:', err);
      alert('Unable to access clipboard. Try uploading a file instead.');
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && !selectedImage) {
        e.preventDefault();
        handlePasteFromClipboard();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

  const handleSolve = async (imageData?: string) => {
    const imgToSolve = imageData || selectedImage;
    if (!imgToSolve) return;
    if (!checkTokenLimit()) return;

    setIsAnalyzing(true);
    setSolution('');
    setShowSimilarQuestions(false);

    try {
      const result = await solveWithVision(imgToSolve, explanationMode);

      if (!result || result.trim().length === 0) {
        throw new Error("Empty response from AI");
      }

      setSolution(result);
      incrementTokenUsage();

      // Save to history
      if (imgToSolve && result) {
        try {
          await saveQuickSolveHistory(imgToSolve, result, explanationMode);
        } catch (err) {
          console.error('Failed to save to history:', err);
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      setSolution(`## Unable to Analyze\n\nI couldn't solve this problem. Please try:\n\n- Taking a clearer photo with good lighting\n- Making sure the entire problem is visible\n- Holding your device steady when capturing\n\n**Technical details:** ${errorMsg}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSimilarQuestions = async () => {
    if (!solution || !checkTokenLimit()) return;

    setShowSimilarQuestions(true);
    setSimilarQuestions([]);

    try {
      const result = await generateSimilarProblems(solution, 5);
      const questions = result.split('\n').filter(line => line.trim().match(/^\d+\./));
      setSimilarQuestions(questions);
      incrementTokenUsage();
    } catch (error) {
      console.error('Generate questions error:', error);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setSolution('');
    setShowSimilarQuestions(false);
    setSimilarQuestions([]);
    stopCamera();
    startCamera();
  };

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const items = await getQuickSolveHistory(20);
      setHistory(items);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const openHistory = useCallback(() => {
    setShowHistory(true);
    loadHistory();
  }, [loadHistory]);

  const closeHistory = useCallback(() => {
    setShowHistory(false);
  }, []);

  const viewHistoryItem = useCallback((item: QuickSolveHistoryItem) => {
    setSelectedImage(item.image_data);
    setSolution(item.solution);
    setExplanationMode(item.explanation_mode);
    setShowHistory(false);
    stopCamera();
  }, []);

  const deleteHistoryItem = useCallback(async (id: string) => {
    try {
      await deleteQuickSolveHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  }, []);

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      alert('Please enter your feedback');
      return;
    }

    setFeedbackSubmitting(true);
    try {
      await submitCameraFeedback(selectedImage, solution, feedbackType, feedbackText);
      alert('Thank you for your feedback! We will review it and improve the system.');
      setShowFeedback(false);
      setFeedbackText('');
      setFeedbackType('other');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" style={{ top: 'env(safe-area-inset-top)' }}></div>

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50" style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg md:text-xl">Quick Solve</h1>
              <p className="text-slate-400 text-xs">Get answers instantly</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openHistory}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
            >
              <History className="w-6 h-6" />
            </button>
            <button
              onClick={onNavigateToDashboard}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
            >
              <BookOpen className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col" style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>

          {!selectedImage && (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="relative rounded-2xl overflow-hidden bg-black flex-1 min-h-[60vh] md:min-h-[400px]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-center gap-8 py-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full transition-all flex items-center justify-center active:scale-95 shadow-lg border-2 border-slate-600"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-white rounded-full transition-all active:scale-95 flex items-center justify-center shadow-2xl border-4 border-slate-300 hover:border-slate-400"
                >
                  <div className="w-16 h-16 bg-white rounded-full border-2 border-slate-900"></div>
                </button>
                <div className="w-12 h-12"></div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedImage && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800">
                <img src={selectedImage} alt="Problem" className="w-full h-auto" />
                <button
                  onClick={reset}
                  className="absolute top-3 right-3 p-3 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-sm text-white rounded-xl transition-all active:scale-95 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!solution && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <span className="text-slate-300 text-sm font-medium">Explanation Style</span>
                    <div className="flex bg-slate-900 rounded-lg p-1 gap-1">
                      <button
                        onClick={() => setExplanationMode('nerd')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          explanationMode === 'nerd'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Nerd Mode
                      </button>
                      <button
                        onClick={() => setExplanationMode('bro')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          explanationMode === 'bro'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Bro Mode
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSolve}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-700 text-white px-6 py-5 rounded-xl font-bold text-lg shadow-2xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        Solve It
                      </>
                    )}
                  </button>
                </div>
              )}

              {solution && (
                <div className="space-y-4">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        Solution
                      </h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        explanationMode === 'bro'
                          ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700'
                          : 'bg-blue-900/50 text-blue-300 border border-blue-700'
                      }`}>
                        {explanationMode === 'bro' ? 'Bro Mode' : 'Nerd Mode'}
                      </span>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none overflow-x-hidden break-words">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        className="text-slate-300"
                        components={{
                          p: ({node, ...props}) => <p className="mb-4 text-slate-300 leading-relaxed break-words" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-lg font-bold text-white mb-2 mt-4 break-words" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-base font-bold text-white mb-2 mt-4 break-words" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-sm font-bold text-white mb-2 mt-3 break-words" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1 text-slate-300 break-words" {...props} />,
                          strong: ({node, ...props}) => <span className="font-bold text-white break-words" {...props} />,
                          code: ({node, inline, ...props}) => inline
                            ? <code className="bg-slate-900 px-1.5 py-0.5 rounded text-xs break-all" {...props} />
                            : <code className="block bg-slate-900 p-3 rounded-lg text-xs overflow-x-auto" {...props} />,
                          pre: ({node, ...props}) => <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto mb-4 max-w-full" {...props} />,
                          table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className="min-w-full" {...props} /></div>,
                        }}
                      >
                        {solution}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateSimilarQuestions}
                    disabled={showSimilarQuestions}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-700 disabled:to-slate-700 text-white px-6 py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="w-5 h-5" />
                    {showSimilarQuestions ? 'Practice Questions Generated' : 'Generate 5 Similar Questions'}
                  </button>

                  {showSimilarQuestions && similarQuestions.length > 0 && (
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-3">
                      <h4 className="text-white font-bold text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                        Practice Questions
                      </h4>
                      <div className="space-y-2">
                        {similarQuestions.map((q, i) => (
                          <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                            <p className="text-slate-300 text-sm">{q}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-slate-400 text-xs text-center">Try solving these on your own to master the concept!</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowFeedback(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Report Issue or Suggest Improvement
                    </button>
                    <button
                      onClick={reset}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Solve Another Problem
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center">
          <div className="bg-slate-800 rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl h-[85vh] md:h-[600px] flex flex-col shadow-2xl border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" />
                  Solution History
                </h2>
                <p className="text-xs text-slate-400 mt-1">Your recent quick solves</p>
              </div>
              <button
                onClick={closeHistory}
                className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {historyLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <History className="w-16 h-16 mb-4 opacity-20" />
                  <p className="font-medium">No history yet</p>
                  <p className="text-sm">Solve problems to build your history</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-900 transition-all"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.image_data}
                          alt="Problem"
                          className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <p className="text-xs text-slate-400">
                                {new Date(item.created_at).toLocaleDateString()} at{' '}
                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <span className={`text-xs font-bold px-2 py-1 rounded-full inline-block mt-1 ${
                                item.explanation_mode === 'bro'
                                  ? 'bg-indigo-900/50 text-indigo-300'
                                  : 'bg-blue-900/50 text-blue-300'
                              }`}>
                                {item.explanation_mode === 'bro' ? 'Bro Mode' : 'Nerd Mode'}
                              </span>
                            </div>
                            <button
                              onClick={() => deleteHistoryItem(item.id)}
                              className="p-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => viewHistoryItem(item)}
                            className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all"
                          >
                            View Solution
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center">
          <div className="bg-slate-800 rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-slate-700">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Report Issue or Suggest Improvement
                </h2>
                <p className="text-xs text-slate-400 mt-1">Help us improve the AI solver</p>
              </div>
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setFeedbackText('');
                  setFeedbackType('other');
                }}
                className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">Issue Type</label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value as any)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="wrong_answer">Wrong Answer</option>
                  <option value="unclear">Unclear Explanation</option>
                  <option value="bug">Technical Bug</option>
                  <option value="suggestion">Feature Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Describe the issue or suggestion
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Please provide details about what went wrong or what could be improved..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-32"
                />
              </div>

              <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-xl">
                <p className="text-xs text-slate-300">
                  Your feedback helps us improve the AI solver for everyone. We review all submissions and use them to enhance accuracy and usability.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700">
              <button
                onClick={handleSubmitFeedback}
                disabled={feedbackSubmitting || !feedbackText.trim()}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {feedbackSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickSolve;
