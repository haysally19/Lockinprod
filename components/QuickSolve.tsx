import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Zap, BookOpen, ArrowRight, RotateCcw, X } from 'lucide-react';
import { solveWithVision, generateSimilarProblems } from '../services/geminiService';

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
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageDataUrl);
        stopCamera();
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

  const handleSolve = async () => {
    if (!selectedImage) return;
    if (!checkTokenLimit()) return;

    setIsAnalyzing(true);
    setSolution('');
    setShowSimilarQuestions(false);

    try {
      const result = await solveWithVision(selectedImage, explanationMode);
      setSolution(result);
      incrementTokenUsage();
    } catch (error) {
      console.error('Analysis error:', error);
      setSolution('Sorry, I could not analyze this problem. Please try again.');
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
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Quick Solve</h1>
              <p className="text-slate-400 text-xs">Get answers instantly</p>
            </div>
          </div>
          <button
            onClick={onNavigateToDashboard}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selectedImage && !isCameraActive && (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
              <div className="text-center space-y-3 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Snap & Solve</h2>
                <p className="text-slate-400 max-w-md">Take a photo of any problem or upload an image. Get instant AI-powered solutions.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={startCamera}
                  className="flex-1 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Camera className="w-6 h-6" />
                  Open Camera
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl font-bold text-lg border border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Upload className="w-6 h-6" />
                  Upload
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {isCameraActive && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {selectedImage && !isCameraActive && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800">
                <img src={selectedImage} alt="Problem" className="w-full h-auto" />
                <button
                  onClick={reset}
                  className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-sm text-white rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
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
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-2xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
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
                    <div className="prose prose-invert prose-sm max-w-none">
                      <div className="text-slate-300 whitespace-pre-wrap">{solution}</div>
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

                  <button
                    onClick={reset}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Solve Another Problem
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSolve;
