import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { MessageSquare, FileText, ArrowRight, Trash2 } from 'lucide-react';

interface ClassCardProps {
  course: Course;
  onDelete?: (id: string) => Promise<void>;
}

const ClassCard: React.FC<ClassCardProps> = ({ course, onDelete }) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete && confirm(`Delete ${course.name}?`)) {
      await onDelete(course.id);
    }
  };
  const totalNotes = course.notes.length;

  return (
    <div className="h-full group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Decorative Top Border */}
      <div className={`h-1 w-full ${course.color}`} />

      <div className="p-4 flex-1 flex flex-col">
          {/* Card Header */}
          <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${course.color} bg-opacity-10 flex-shrink-0 flex items-center justify-center`}>
                      <span className={`font-bold text-sm ${course.color.replace('bg-', 'text-')}`}>
                          {course.name.charAt(0)}
                      </span>
                  </div>
                  <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">{course.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">{course.subject}</p>
                  </div>
              </div>
          </div>

          {/* Study Materials Stats */}
          <div className="mb-3">
              <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-lg font-bold text-slate-700">{totalNotes}</div>
                  <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Study Notes</div>
              </div>
          </div>

          {/* AI Study Status */}
          <div className="flex-1 min-h-[38px] flex flex-col justify-end">
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-100">
                <MessageSquare className="w-3 h-3 flex-shrink-0 text-blue-600" />
                <span className="text-xs text-blue-900 font-medium">AI Tutor Available</span>
            </div>
          </div>

          {/* Action Footer (Condensed) */}
          <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
              <div className="flex gap-1 items-center">
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete class"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <Link to={`/class/${course.id}`} state={{ openTab: 'chat' }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="AI Tutor">
                      <MessageSquare className="w-3.5 h-3.5" />
                  </Link>
                  <Link to={`/class/${course.id}`} state={{ openTab: 'notes' }} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors" title="Notes">
                      <FileText className="w-3.5 h-3.5" />
                  </Link>
              </div>
              <Link
                  to={`/class/${course.id}`}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded-md"
              >
                  OPEN <ArrowRight className="w-3 h-3" />
              </Link>
          </div>
      </div>
    </div>
  );
};

export default ClassCard;