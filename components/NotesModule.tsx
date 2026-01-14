
import React, { useState, useEffect, useCallback } from 'react';
import { Note } from '../types';
import { Plus, Trash2, FileText, Sparkles, Wand2, AlignLeft, CheckCheck, PenLine, Loader2, Save, BrainCircuit, ChevronLeft, PanelRightOpen, PanelRightClose, RefreshCw, Copy, ArrowDownToLine, ArrowRight } from 'lucide-react';
import { enhanceNote, generateStudyGuide } from '../services/geminiService';

interface NotesModuleProps {
  notes: Note[];
  onAddNote: (n: Omit<Note, 'id'>) => Promise<string>;
  onUpdateNote: (n: Note) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
  checkTokenLimit: () => boolean;
  incrementTokenUsage: () => void;
}

type AiAction = 'summarize' | 'cleanup' | 'continue' | 'study_guide';

const NotesModule: React.FC<NotesModuleProps> = ({ 
  notes, 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote, 
  checkTokenLimit, 
  incrementTokenUsage 
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes.length > 0 ? notes[0].id : null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeAiAction, setActiveAiAction] = useState<AiAction | null>(null);
  const [aiOutput, setAiOutput] = useState('');

  // Mobile State
  const [showMobileList, setShowMobileList] = useState(true);
  const [showMobileAi, setShowMobileAi] = useState(false);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  // Load note content into editor when selection changes
  useEffect(() => {
    if (selectedNote) {
      setEditorTitle(selectedNote.title);
      setEditorContent(selectedNote.content);
      setIsDirty(false);
      setIsSaving(false);
      setAiOutput('');
      setShowMobileList(false); // Auto-hide list on selection if on mobile
    } else {
      setEditorTitle('');
      setEditorContent('');
    }
  }, [selectedNoteId, selectedNote]);

  // If no note is selected on mount/update, show list on mobile
  useEffect(() => {
      if (!selectedNoteId && notes.length > 0) {
          setShowMobileList(true);
      }
  }, [selectedNoteId, notes.length]);

  const handleCreateNote = async () => {
    if (isDirty) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to create a new note?")) {
        return;
      }
    }
    try {
        const newId = await onAddNote({
            title: 'Untitled Note',
            content: '',
            createdAt: new Date().toISOString()
        });
        setSelectedNoteId(newId);
    } catch (error) {
        console.error("Failed to create note", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await onDeleteNote(id);
      if (selectedNoteId === id) {
        // Optimistically cleared by parent, just reset selection
        setSelectedNoteId(null);
        setShowMobileList(true);
      }
    }
  };

  const handleSelectNote = (noteId: string) => {
    if (isDirty) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to switch notes?")) {
        return;
      }
    }
    setSelectedNoteId(noteId);
  };
  
  const handleBackToList = () => {
      setShowMobileList(true);
      setShowMobileAi(false);
  }

  const handleSave = useCallback(async () => {
    if (!selectedNoteId) return;
    setIsSaving(true);
    
    try {
        const noteToUpdate = notes.find(n => n.id === selectedNoteId);
        if (noteToUpdate) {
            await onUpdateNote({
                ...noteToUpdate,
                title: editorTitle,
                content: editorContent
            });
            setIsDirty(false);
        }
    } catch (e) {
        console.error("Failed to save", e);
    } finally {
        setIsSaving(false);
    }
  }, [selectedNoteId, editorTitle, editorContent, notes, onUpdateNote]);

  const handleAiAction = async (action: AiAction) => {
    if (!editorContent.trim()) return;
    if (!checkTokenLimit()) return;

    setIsAiLoading(true);
    setActiveAiAction(action);
    setAiOutput('');
    incrementTokenUsage();

    try {
      if (action === 'cleanup') {
          const result = await enhanceNote(editorContent, 'cleanup');
          setAiOutput(result);
      } else if (action === 'continue') {
        const result = await enhanceNote(editorContent, action);
        setAiOutput(result);
      } else if (action === 'summarize') {
        const result = await enhanceNote(editorContent, 'summarize');
        setAiOutput(result);
      } else if (action === 'study_guide') {
        const result = await generateStudyGuide(editorContent);
        setAiOutput(result);
      }
    } catch (error) {
      console.error("AI action failed:", error);
      setAiOutput("An error occurred. Please try again.");
    } finally {
      setIsAiLoading(false);
      setActiveAiAction(null);
    }
  };

  const handleAppendToNote = () => {
      if (aiOutput) {
          const newContent = editorContent + `\n\n---\n\n` + aiOutput;
          setEditorContent(newContent);
          setIsDirty(true);
          setAiOutput('');
      }
  };

  const handleReplaceNote = () => {
      if (aiOutput) {
          if(window.confirm("This will replace your current note content with the AI generated version. This action cannot be undone. Proceed?")) {
            setEditorContent(aiOutput);
            setIsDirty(true);
            setAiOutput('');
          }
      }
  };

  return (
    <div className="h-full flex bg-white font-sans relative overflow-hidden">
      {/* 1. Notes List Sidebar */}
      <div className={`
          absolute inset-0 z-20 bg-slate-50 flex flex-col border-r border-slate-200 transition-transform duration-300 md:relative md:translate-x-0 md:w-64 md:flex-shrink-0 md:z-0
          ${showMobileList ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-3 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm h-14">
          <h3 className="font-bold text-base text-slate-800 px-1">Smart Notes</h3>
          <button 
            onClick={handleCreateNote}
            className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
          {notes.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50"/>
              No notes yet. <br/> Click '+' to start.
            </div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id}
                onClick={() => handleSelectNote(note.id)}
                className={`p-3 border-b border-slate-100 cursor-pointer hover:bg-white transition-colors group relative ${selectedNoteId === note.id ? 'bg-white border-l-4 border-blue-600 shadow-sm' : 'border-l-4 border-transparent'}`}
              >
                <h4 className={`font-semibold text-xs truncate ${selectedNoteId === note.id ? 'text-slate-900' : 'text-slate-700'}`}>{note.title}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{note.content || "Empty note"}</p>
                <span className="text-[9px] text-slate-300 mt-1.5 block">{new Date(note.createdAt).toLocaleDateString()}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                  className="absolute right-2 top-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Editor Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden w-full relative">
        {selectedNoteId ? (
          <>
            <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 md:gap-4 bg-white h-14 flex-shrink-0">
              <button onClick={handleBackToList} className="md:hidden p-1.5 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
              </button>
              <input 
                value={editorTitle}
                onChange={(e) => { setEditorTitle(e.target.value); setIsDirty(true); }} 
                className="text-base md:text-lg font-bold text-slate-800 bg-transparent outline-none flex-1 placeholder:text-slate-300 truncate"
                placeholder="Note Title"
              />
              <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSave} 
                    disabled={!isDirty || isSaving}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isSaving ? 'bg-slate-100 text-slate-500' : 
                        isDirty ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700' : 
                        'text-slate-400'
                    }`}
                  >
                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3" />}
                    <span className="hidden md:inline">{isSaving ? 'Saving...' : (isDirty ? 'Save' : 'Saved')}</span>
                  </button>
                  <button 
                    onClick={() => setShowMobileAi(!showMobileAi)}
                    className={`md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 ${showMobileAi ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                      {showMobileAi ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
                  </button>
              </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
                <textarea 
                  value={editorContent}
                  onChange={(e) => { setEditorContent(e.target.value); setIsDirty(true); }} 
                  className="w-full h-full p-4 md:p-6 resize-none outline-none text-slate-700 leading-relaxed text-sm bg-white overflow-y-auto custom-scrollbar pb-24 md:pb-8 font-sans"
                  placeholder="Start typing your notes here..."
                  spellCheck={false}
                />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 hidden md:flex">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 opacity-20" />
            </div>
            <h3 className="text-lg font-bold text-slate-400">Select a note</h3>
          </div>
        )}
      </div>

      {/* 3. AI Inspector Panel */}
      <div className={`
          absolute inset-y-0 right-0 w-80 bg-slate-50/95 backdrop-blur shadow-xl z-30 transform transition-transform duration-300 border-l border-slate-200 flex flex-col
          md:relative md:translate-x-0 md:bg-slate-50/50 md:shadow-none
          ${showMobileAi ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
         <div className="p-3 border-b border-slate-200 bg-white h-14 flex justify-between items-center flex-shrink-0">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-500"/> Study Tools
            </h3>
            <button onClick={() => setShowMobileAi(false)} className="md:hidden p-1 text-slate-400">
                <PanelRightClose className="w-5 h-5" />
            </button>
         </div>
         <div className="flex-1 p-4 space-y-5 overflow-y-auto custom-scrollbar pb-24 md:pb-6">
             {/* Same AI buttons as before but styled appropriately via inherited styles or utility classes which are consistent */}
             <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Organization</h4>
                 <div className="space-y-2">
                     <button onClick={() => handleAiAction('cleanup')} disabled={isAiLoading || !editorContent} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm text-slate-700 disabled:opacity-50 transition-all group text-left">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            {activeAiAction === 'cleanup' ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <RefreshCw className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                            <span className="block font-bold text-slate-800">Clean Up</span>
                        </div>
                     </button>
                 </div>
             </div>
             <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Analysis</h4>
                 <div className="space-y-2">
                     <button onClick={() => handleAiAction('summarize')} disabled={isAiLoading || !editorContent} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium bg-white border border-slate-200 hover:border-purple-300 hover:shadow-sm text-slate-700 disabled:opacity-50 transition-all group text-left">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                             {activeAiAction === 'summarize' ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <AlignLeft className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                            <span className="block font-bold text-slate-800">Summarize</span>
                        </div>
                     </button>
                      <button onClick={() => handleAiAction('study_guide')} disabled={isAiLoading || !editorContent} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm text-slate-700 disabled:opacity-50 transition-all group text-left">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            {activeAiAction === 'study_guide' ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <BrainCircuit className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                            <span className="block font-bold text-slate-800">Study Guide</span>
                        </div>
                     </button>
                      <button onClick={() => handleAiAction('continue')} disabled={isAiLoading || !editorContent} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm text-slate-700 disabled:opacity-50 transition-all group text-left">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            {activeAiAction === 'continue' ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <PenLine className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                            <span className="block font-bold text-slate-800">Expand</span>
                        </div>
                     </button>
                 </div>
             </div>
             
             { (isAiLoading || aiOutput) && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col overflow-hidden max-h-[400px] animate-in slide-in-from-bottom-5 duration-300">
                    <div className="p-3 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                         <h4 className="text-[10px] font-bold text-slate-700 flex items-center gap-2 uppercase">
                            <Sparkles className="w-3 h-3 text-blue-500" /> Result
                         </h4>
                         <button onClick={() => {setAiOutput('')}} className="text-slate-400 hover:text-slate-600 text-[10px] font-bold">Clear</button>
                    </div>
                    
                    <div className="p-3 overflow-y-auto flex-1 custom-scrollbar bg-slate-50">
                        {isAiLoading ? (
                            <div className="flex flex-col items-center justify-center py-4 text-slate-400 gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                <span className="text-[10px]">Thinking...</span>
                            </div>
                        ) : (
                            <div className="prose prose-sm prose-slate max-w-none text-xs leading-relaxed whitespace-pre-wrap font-mono">
                                {aiOutput}
                            </div>
                        )}
                    </div>

                    { aiOutput && !isAiLoading && (
                        <div className="p-2 border-t border-slate-200 bg-white grid grid-cols-2 gap-2">
                             <button 
                                onClick={handleReplaceNote} 
                                className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-[10px] font-bold transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" /> Replace
                            </button>
                            <button 
                                onClick={handleAppendToNote} 
                                className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-[10px] font-bold transition-colors"
                            >
                                <ArrowDownToLine className="w-3 h-3" /> Append
                            </button>
                        </div>
                    )}
                </div>
             )}
         </div>
      </div>
      
      {/* Mobile AI Overlay Backdrop */}
      {showMobileAi && (
        <div className="fixed inset-0 bg-black/20 z-20 md:hidden" onClick={() => setShowMobileAi(false)} />
      )}
    </div>
  );
};

export default NotesModule;
