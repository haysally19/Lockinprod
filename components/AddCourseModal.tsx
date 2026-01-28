import React, { useState } from 'react';
import { Course, ClassSubject } from '../types';
import { X, Check, BookOpen } from 'lucide-react';
import { markOnboardingTaskComplete } from '../services/onboardingService';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (course: Course) => void;
}

const COLORS = [
  'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 
  'bg-pink-500', 'bg-rose-500', 'bg-orange-500', 
  'bg-amber-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500'
];

const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<ClassSubject>(ClassSubject.GENERAL);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCourse: Course = {
      id: Date.now().toString(),
      name,
      subject,
      color: selectedColor,
      icon: 'book',
      notes: []
    };

    onAdd(newCourse);
    await markOnboardingTaskComplete('add_class_completed');
    setName('');
    setSubject(ClassSubject.GENERAL);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/50">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-slate-500"/>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Add New Course</h3>
              <p className="text-sm text-slate-500">Expand your learning workspace.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Course Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Organic Chemistry II"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Subject</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value as ClassSubject)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
            >
              {Object.values(ClassSubject).map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Theme Color</label>
            <div className="flex flex-wrap gap-3 p-1">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-9 h-9 rounded-full ${color} flex items-center justify-center transition-transform hover:scale-110 ring-offset-2 ring-white ${selectedColor === color ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                >
                  {selectedColor === color && <Check className="w-5 h-5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;