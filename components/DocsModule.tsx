
import React, { useState } from 'react';
import { CourseDocument } from '../types';
import { FileText, File, Download, Trash2, UploadCloud, Image as ImageIcon, FileCode } from 'lucide-react';

interface DocsModuleProps {
  documents: CourseDocument[];
  onAddDoc: (doc: Omit<CourseDocument, 'id'>) => Promise<void>;
  onDeleteDoc: (id: string) => Promise<void>;
}

const DocsModule: React.FC<DocsModuleProps> = ({ documents, onAddDoc, onDeleteDoc }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (file.size > 10 * 1024 * 1024) {
          alert("File is too large. Max size is 10MB.");
          return;
      }

      setIsUploading(true);
      try {
        await onAddDoc({
            name: file.name,
            type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            uploadDate: new Date().toLocaleDateString()
        });
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if(window.confirm("Are you sure you want to remove this document?")) {
        await onDeleteDoc(id);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="w-8 h-8 text-blue-500" />;
      case 'jpg':
      case 'png':
      case 'jpeg': return <ImageIcon className="w-8 h-8 text-purple-500" />;
      case 'js':
      case 'py':
      case 'html': return <FileCode className="w-8 h-8 text-yellow-500" />;
      default: return <File className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
           <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold">Class Materials</h2>
              <p className="text-slate-400 text-xs mt-0.5">Syllabus, readings, and handouts.</p>
            </div>
            <div className="relative">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.png,.jpeg,.txt"
                disabled={isUploading}
              />
              <label 
                htmlFor="file-upload"
                className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors text-xs font-bold shadow-sm active:scale-95 transform ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                {isUploading ? 'Uploading...' : 'Upload File'}
              </label>
            </div>
          </div>

          <div className="p-5">
            {documents.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 shadow-inner">
                  <UploadCloud className="w-6 h-6 text-slate-300" />
                </div>
                <p className="font-bold text-sm">No documents uploaded yet</p>
                <p className="text-xs mt-1">Upload syllabus or notes to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group bg-white shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex-shrink-0 scale-90">
                      {getIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-700 truncate text-sm">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                        <span>{doc.size}</span>
                        <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                        <span>{doc.uploadDate}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsModule;
