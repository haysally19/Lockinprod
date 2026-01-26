import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { Camera, RefreshCw, X, Zap, ChevronLeft, Image as ImageIcon, Loader2, History, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { solveWithVision } from '../services/geminiService';
import { saveCameraHistory, getCameraHistory, deleteCameraHistoryItem, CameraHistoryItem } from '../services/cameraHistoryService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const HistoryItem = memo(({ item, onView, onDelete }: {
  item: CameraHistoryItem;
  onView: (item: CameraHistoryItem) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 hover:shadow-md transition-all group">
    <div className="flex gap-3">
      <img
        src={item.image_data}
        alt="Problem"
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer"
        onClick={() => onView(item)}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-1">
          {new Date(item.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <p className="text-sm text-slate-700 line-clamp-2">
          {item.solution.substring(0, 100)}...
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onView(item)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            View
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-xs font-bold text-red-600 hover:text-red-800 px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
));

const CameraSolver: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CameraHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Start Camera
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;

        try {
          await videoRef.current.play();
        } catch (playError) {
          console.error("Play error:", playError);
        }
      }

      setStream(newStream);
      setCameraError(null);
    } catch (err) {
      console.error("Camera Error:", err);
      setCameraError("Could not access camera. Please check permissions.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [facingMode]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
      if (context) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        setImage(imgData);
        solveImage(imgData);
      }
    }
  }, []);

  const solveImage = async (imgData: string) => {
    setLoading(true);
    setSolution(null);
    try {
      const result = await solveWithVision(imgData, 'nerd');

      if (!result || result.trim().length === 0) {
        throw new Error("Empty response");
      }

      setSolution(result);
      await saveCameraHistory(imgData, result);
    } catch (error) {
      console.error("Solve error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setSolution(`## Error Processing Image\n\nI couldn't analyze this image. Please try:\n\n- Taking a clearer, well-lit photo\n- Ensuring the problem is fully visible\n- Holding the camera steady\n\n**Error details:** ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setSolution(null);
    startCamera();
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const items = await getCameraHistory(20);
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

  const viewHistoryItem = useCallback((item: CameraHistoryItem) => {
    setImage(item.image_data);
    setSolution(item.solution);
    setShowHistory(false);
  }, []);

  const deleteHistoryItem = useCallback(async (id: string) => {
    try {
      await deleteCameraHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col text-white">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-bold tracking-wider text-sm">AI SOLVER</span>
        <button onClick={toggleCamera} className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-900">
        {!image ? (
          <>
            {/* Live Camera Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              webkit-playsinline="true"
              className="absolute inset-0 w-full h-full object-cover"
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                video.play().catch(err => console.error("Video play error:", err));
              }}
            />
            
            {/* Focus Reticle Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-32 border-2 border-yellow-400/80 rounded-lg relative shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-yellow-400 -mt-1 -ml-1"></div>
                 <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-yellow-400 -mt-1 -mr-1"></div>
                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-yellow-400 -mb-1 -ml-1"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-yellow-400 -mb-1 -mr-1"></div>
                 <p className="absolute -bottom-10 w-full text-center text-xs font-bold text-yellow-400 uppercase tracking-widest drop-shadow-md">Position Problem Here</p>
              </div>
            </div>

            {/* Error State */}
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-30">
                <div className="text-center p-6">
                  <p className="text-red-400 mb-4">{cameraError}</p>
                  <button onClick={startCamera} className="px-4 py-2 bg-blue-600 rounded-lg font-bold">Try Again</button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Captured Image Preview */
          <div className="absolute inset-0 bg-black">
             <img src={image} alt="Captured" className="w-full h-full object-contain opacity-50 blur-sm" />
          </div>
        )}
        
        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Solution Panel (Slide Up) */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white text-slate-900 rounded-t-[2rem] transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) transform ${image ? 'translate-y-0' : 'translate-y-[110%]'} h-[80vh] flex flex-col shadow-2xl z-30`}>
           {/* Handle bar */}
           <div className="w-full flex justify-center pt-3 pb-1" onClick={() => { if(!loading) reset(); }}>
               <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
           </div>

           {/* Solution Content */}
           <div className="flex-1 overflow-y-auto p-6 pt-2">
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10 pt-2">
                  <div>
                      <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                        <Zap className="w-5 h-5 text-yellow-500 fill-current" />
                        AI Solution
                      </h3>
                      <p className="text-xs text-slate-500">Step-by-step breakdown</p>
                  </div>
                  <button onClick={reset} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                      <X className="w-5 h-5 text-slate-600" />
                  </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-wide">Analyzing Image...</p>
                </div>
              ) : (
                <div className="prose prose-slate prose-sm w-full max-w-none pb-20">
                     <ReactMarkdown 
                        remarkPlugins={[remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                        components={{
                            p: ({node, ...props}) => <p className="mb-4 text-slate-700 leading-relaxed" {...props} />,
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold text-slate-900 mb-2 mt-4" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-bold text-slate-900 mb-2 mt-4" {...props} />,
                            li: ({node, ...props}) => <li className="mb-1 text-slate-700" {...props} />,
                            strong: ({node, ...props}) => <span className="font-bold text-slate-900 bg-yellow-50 px-1 rounded" {...props} />
                        }}
                     >
                        {solution || ''}
                     </ReactMarkdown>
                </div>
              )}
           </div>
           
           {/* Bottom Actions */}
           {!loading && (
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
                <button onClick={reset} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 transform active:scale-95">
                    <Camera className="w-5 h-5" />
                    Scan Another Problem
                </button>
             </div>
           )}
      </div>

      {/* Controls (Shutter Button) */}
      <div className={`absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center pb-8 gap-12 transition-opacity duration-300 ${image ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Gallery Button Placeholder (Inactive) */}
        <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md group">
            <ImageIcon className="w-6 h-6 text-white/80 group-hover:text-white" />
        </button>

        {/* Shutter Button */}
        <button 
            onClick={captureImage}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:scale-90 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
            <div className="w-16 h-16 bg-white rounded-full"></div>
        </button>

         {/* History Button */}
         <button
            onClick={openHistory}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md group"
         >
            <History className="w-6 h-6 text-white/80 group-hover:text-white" />
         </button>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center">
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl h-[85vh] md:h-[600px] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  Solution History
                </h2>
                <p className="text-xs text-slate-500 mt-1">Your recent camera solves</p>
              </div>
              <button
                onClick={closeHistory}
                className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {historyLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
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
                    <HistoryItem
                      key={item.id}
                      item={item}
                      onView={viewHistoryItem}
                      onDelete={deleteHistoryItem}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Sparkles icon for the loading state if not imported
const Sparkles = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
);

export default CameraSolver;