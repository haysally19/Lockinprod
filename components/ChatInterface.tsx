import React, { useState, useRef, useEffect } from 'react';
import { Course, ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { Send, Bot, User, Sparkles, AlertCircle, Calculator as CalcIcon, X, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Calculator from './Calculator';
import { GenerateContentResponse, Part } from "@google/genai";
import { db } from '../services/db';
import { markOnboardingTaskComplete } from '../services/onboardingService';

interface ChatInterfaceProps {
  course: Course;
  initialMessage?: string;
  onClearInitialMessage?: () => void;
  checkTokenLimit: () => boolean;
  incrementTokenUsage: () => void;
}

// Derive the ChatSession type from the service function for robust typing
type ChatSession = Awaited<ReturnType<typeof createChatSession>>;

const ChatInterface: React.FC<ChatInterfaceProps> = ({ course, initialMessage, onClearInitialMessage, checkTokenLimit, incrementTokenUsage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  const chatSessionRef = useRef<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize chat session when course changes
  useEffect(() => {
    let active = true;

    const initChat = async () => {
      try {
        setError(null);
        const session = await createChatSession(course.subject, course.name);

        // Load conversation history from database
        const history = await db.getChatHistory(course.id);

        if (active) {
            chatSessionRef.current = session;

            // If there's conversation history, restore it
            if (history.length > 0) {
              setMessages(history);
            } else {
              // Otherwise, show welcome message
              setMessages([
                  {
                  role: 'model',
                  text: `Hello! I'm your AI tutor for ${course.name}. I can help you solve problems, explain concepts, or analyze photos of your homework. How can I help?`,
                  timestamp: new Date()
                  }
              ]);
            }
        }
      } catch (err: any) {
        console.error("Failed to initialize chat:", err);
        if (active) {
            setError(err.message || "Failed to initialize AI. Please check your API configuration.");
            setMessages([]);
        }
      }
    };

    initChat();
    return () => { active = false; };
  }, [course.id, course.name, course.subject]);

  // Handle Initial Message (e.g. from Dashboard)
  useEffect(() => {
    if (initialMessage && chatSessionRef.current && !isLoading) {
      handleSend(initialMessage);
      onClearInitialMessage?.();
    }
  }, [initialMessage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
          alert("Image too large. Please select an image under 5MB.");
          return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if ((!textToSend.trim() && !attachedImage) || !chatSessionRef.current || isLoading) return;

    // CHECK LIMITS
    if (!checkTokenLimit()) return;

    // 1. Add User Message to UI
    const userMsg: ChatMessage = {
        role: 'user',
        text: textToSend + (attachedImage ? ' [Image Attached]' : ''),
        timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    // Save user message to database
    try {
      await db.saveChatMessage(course.id, userMsg);
    } catch (err) {
      console.error('Failed to save user message:', err);
    }

    const currentImage = attachedImage; // Capture current image

    // Reset inputs
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);
    setError(null);
    incrementTokenUsage(); // Deduct token

    try {
      // 2. Add Placeholder for Model Message
      const botMsgTimestamp = new Date();
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: botMsgTimestamp }]);

      // 3. Construct Message Payload
      let messagePayload: string | Part[] = textToSend;
      
      if (currentImage) {
        // Strip the data:image/png;base64, prefix
        const base64Parts = currentImage.split(',');
        const base64Data = base64Parts[1];
        const mimeType = base64Parts[0].split(';')[0].split(':')[1];
        
        // Pass multimodal input as an array of parts to the message parameter
        messagePayload = [
            { text: textToSend || "Analyze this image." },
            { inlineData: { mimeType: mimeType, data: base64Data } }
        ];
      }

      // 4. Send Message Stream
      const streamResult = await chatSessionRef.current.sendMessageStream({ message: messagePayload });

      let fullText = '';

      for await (const chunk of streamResult) {
          const c = chunk as GenerateContentResponse;
          const chunkText = c.text;
          if (chunkText) {
            fullText += chunkText;

            setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                // Update the last message if it is the model's placeholder
                if (lastIdx >= 0 && updated[lastIdx].role === 'model') {
                    updated[lastIdx] = {
                        ...updated[lastIdx],
                        text: fullText
                    };
                }
                return updated;
            });
          }
      }

      // Save model's response to database after streaming completes
      if (fullText) {
        try {
          const modelMsg: ChatMessage = {
            role: 'model',
            text: fullText,
            timestamp: botMsgTimestamp
          };
          await db.saveChatMessage(course.id, modelMsg);
          await markOnboardingTaskComplete('ai_prompt_completed');
        } catch (err) {
          console.error('Failed to save model message:', err);
        }
      }

    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = "I'm having trouble connecting right now. Please check your internet or API key and try again.";
      
      setMessages(prev => {
         const last = prev[prev.length - 1];
         // If we have an empty loading message, replace it with error
         if (last.role === 'model' && !last.text) {
             return [...prev.slice(0, -1), { role: 'model', text: errorMessage, timestamp: new Date() }];
         }
         return [...prev, { role: 'model', text: `\n\n[Error: ${errorMessage}]`, timestamp: new Date() }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (error && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-4 md:p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2">AI Unavailable</h3>
        <p className="text-sm md:text-base text-slate-500 max-w-sm mb-4">{error}</p>
        <div className="text-xs text-slate-400 bg-white p-3 rounded-lg border border-slate-200 max-w-xs">
           Tip: Ensure <code className="bg-slate-100 px-1 rounded">API_KEY</code> is set in <code className="bg-slate-100 px-1 rounded">index.html</code> script tag.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 md:bg-white relative overflow-hidden">
      <div className="flex-1 overflow-y-auto px-3 py-4 md:p-8 space-y-4 md:space-y-6 pb-40 md:pb-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'model' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                {msg.role === 'model' ? <Bot className="w-4 h-4 md:w-5 md:h-5" /> : <User className="w-4 h-4 md:w-5 md:h-5" />}
                </div>

                <div className={`max-w-[82%] md:max-w-[85%] rounded-2xl p-3 md:p-4 shadow-sm text-sm md:text-base ${
                msg.role === 'model'
                    ? 'bg-slate-50 border border-slate-100 text-slate-800'
                    : 'bg-blue-600 text-white'
                }`}>
                <div className="prose prose-sm max-w-none text-current font-sans overflow-x-auto">
                    {msg.role === 'model' ? (
                       <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false, output: 'mathml' }]]}
                          components={{
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
                              code: ({node, className, children, ...props}) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <pre className="bg-slate-800 text-slate-100 p-3 rounded-lg overflow-x-auto my-2">
                                        <code className={className} {...props}>{children}</code>
                                    </pre>
                                ) : (
                                    <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                                )
                              }
                          }}
                       >
                           {msg.text || (isLoading && idx === messages.length - 1 ? "Thinking..." : "")}
                       </ReactMarkdown>
                    ) : (
                        <div className="whitespace-pre-wrap">
                            {msg.text}
                        </div>
                    )}
                </div>
                </div>
            </div>
            ))}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="flex gap-2 md:gap-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 md:p-4">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
                    </div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Calculator */}
      {showCalculator && (
        <div className="fixed bottom-32 md:bottom-24 right-3 md:right-4 z-50 animate-in slide-in-from-bottom-5">
            <div className="relative">
                <button
                    onClick={() => setShowCalculator(false)}
                    className="absolute -top-3 -right-3 bg-slate-900 text-white p-1.5 rounded-full border border-slate-700 shadow-md z-30 active:scale-95 transition-transform"
                >
                    <X className="w-4 h-4" />
                </button>
                <Calculator />
            </div>
        </div>
      )}

      {/* Image Preview */}
      {attachedImage && (
          <div className="fixed md:absolute bottom-24 md:bottom-24 left-3 md:left-4 right-3 md:right-auto md:max-w-4xl z-10 animate-in slide-in-from-bottom-2">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-200 inline-flex items-center gap-3">
                  <img src={attachedImage} alt="Preview" className="h-12 w-12 object-cover rounded-lg" />
                  <span className="text-xs text-slate-500 font-medium">Image attached</span>
                  <button onClick={() => setAttachedImage(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                  </button>
              </div>
          </div>
      )}

      <div
        className="fixed md:relative bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 z-40 shadow-lg shadow-slate-900/5"
        style={{
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
          paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
          paddingTop: '0.75rem'
        }}
      >
        <div className="max-w-4xl mx-auto relative flex gap-2 items-end">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <button
             onClick={() => fileInputRef.current?.click()}
             className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-all shadow-sm border flex-shrink-0 ${attachedImage ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 active:scale-95'}`}
             title="Upload Image"
          >
             <Camera className="w-5 h-5" />
          </button>

          <div className="relative flex-1">
             <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask anything about ${course.name}...`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl pl-3 md:pl-4 pr-10 py-2.5 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none max-h-32 shadow-inner text-sm min-h-[44px] md:min-h-[50px]"
                rows={1}
            />
            <button
                onClick={() => setShowCalculator(!showCalculator)}
                className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-all active:scale-95 ${showCalculator ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-200'}`}
                title="Toggle Calculator"
            >
                <CalcIcon className="w-4 h-4" />
            </button>
          </div>

          <button
                onClick={() => handleSend()}
                disabled={(!input.trim() && !attachedImage) || isLoading}
                className="p-2.5 md:p-3 bg-blue-600 text-white rounded-xl md:rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex-shrink-0 active:scale-95"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
        <p className="text-center text-[10px] md:text-xs text-slate-400 mt-2">
          Gemini 3.0 Pro can think and reason. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;