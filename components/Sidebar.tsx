import React from 'react';
import { Course } from '../types';
import { LayoutDashboard, Plus, BookCopy, Calendar, Settings, Zap, Flame, X, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

interface SidebarProps {
  courses: Course[];
  onAddCourse: () => void;
  userTier: 'free' | 'pro';
  userProfile: {
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
  dailyTokens: number;
  bonusCredits: number;
  streak: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  courses,
  onAddCourse,
  userTier,
  userProfile,
  dailyTokens,
  bonusCredits,
  streak,
  isOpen = false,
  onClose
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Calculate credits remaining
  const maxTokens = 5;
  const creditsRemaining = Math.max(0, maxTokens - dailyTokens);
  const totalCredits = creditsRemaining + bonusCredits;
  const progressPercent = (creditsRemaining / maxTokens) * 100;

  // Get user initials from profile
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userName = userProfile?.full_name || 'User';
  const userInitials = getInitials(userName);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed md:relative inset-y-0 left-0 w-64 bg-white border-r border-slate-200 h-full flex flex-col flex-shrink-0 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      style={{
        paddingLeft: 'env(safe-area-inset-left)',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))'
      }}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 md:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 flex items-center justify-center border-b border-slate-100 h-20">
          <div className="h-10 w-auto transition-all duration-300 hover:scale-105">
            <Logo showText={true} />
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          <h2 className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Menu</h2>
          <Link
            to="/"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-bold text-xs ${
              currentPath === '/' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/classes"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-bold text-xs ${
              currentPath.startsWith('/classes') || currentPath.startsWith('/class/')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookCopy className="w-4 h-4" />
            <span>My Classes</span>
          </Link>
          <Link
            to="/calendar"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all font-bold text-xs ${
              currentPath === '/calendar'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendar</span>
          </Link>
        </nav>

        <div className="flex-1 overflow-y-auto px-3 no-scrollbar mt-2">
          <h2 className="px-3 pt-2 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Quick Access</span>
              <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{courses.length}</span>
          </h2>

          <div className="space-y-1">
              {courses.slice(0, 10).map((course) => (
              <Link
                  key={course.id}
                  to={`/class/${course.id}`}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                  currentPath === `/class/${course.id}`
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                  <div className={`w-2 h-2 rounded-full ${course.color}`} />
                  <span className="truncate text-xs font-medium">{course.name}</span>
              </Link>
              ))}
              
              <button
                onClick={() => { onAddCourse(); onClose?.(); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all mt-1 group"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Add New Course</span>
              </button>
          </div>
        </div>

        <div className="px-3 mb-2 mt-auto space-y-1">
          {/* Streak Badge - Extra Compact */}
          <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-orange-50 border border-orange-100">
              <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className={`w-3 h-3 fill-current ${streak > 0 ? 'animate-pulse text-orange-500' : 'text-slate-300'}`} /> Streak
              </span>
              <span className="text-[10px] font-black text-orange-700">{streak} Days</span>
          </div>

          {/* Token Credits - Extra Compact */}
          {userTier === 'free' && (
              <div className="bg-slate-50 border border-slate-200 rounded-md p-2 space-y-1.5">
                  <div className="flex justify-between items-center">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-amber-500 fill-current" /> Credits
                      </span>
                      <span className="text-[9px] font-bold text-slate-900">{totalCredits} left</span>
                  </div>
                  {/* Progress Bar: Width represents remaining credits */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${
                              creditsRemaining > 2 ? 'bg-blue-500' :
                              creditsRemaining > 0 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                      />
                  </div>
                  {bonusCredits > 0 && (
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200 mt-1">
                          <span className="text-[8px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="w-2 h-2 text-blue-500" /> Bonus
                          </span>
                          <span className="text-[9px] font-bold text-blue-700">+{bonusCredits}</span>
                      </div>
                  )}
              </div>
          )}
        </div>

        <div className="p-2 mt-3 border-t border-slate-100 bg-white">
          <Link
            to="/settings"
            onClick={onClose}
            className={`w-full flex items-center gap-2 p-1.5 rounded-lg transition-all group ${currentPath === '/settings' ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
              {userInitials}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[11px] font-bold text-slate-800 truncate">{userName}</p>
              <p className={`text-[8px] font-bold uppercase tracking-wide truncate ${userTier === 'free' ? 'text-slate-400' : 'text-blue-600'}`}>
                  {userTier === 'free' ? 'Free Plan' : 'Pro Scholar'}
              </p>
            </div>
            <Settings className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;