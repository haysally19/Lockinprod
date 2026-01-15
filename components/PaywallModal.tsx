import React from 'react';
import { X, Check, Zap, Sparkles, Star, Crown, Rocket } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  reason: 'course_limit' | 'token_limit' | 'upgrade';
}

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onUpgrade, reason }) => {
  if (!isOpen) return null;

  const getContent = () => {
      switch(reason) {
          case 'course_limit':
              return {
                  title: 'Unlock Unlimited Courses',
                  desc: 'The free plan is limited to 1 course. Upgrade to manage your entire semester.',
                  icon: <Crown className="w-10 h-10 text-white" />
              };
          case 'token_limit':
              return {
                  title: 'Daily Limit Reached',
                  desc: 'You have used your 5 free AI tutor requests for today. Go Pro for unlimited learning.',
                  icon: <Sparkles className="w-10 h-10 text-white" />
              };
          case 'upgrade':
          default:
              return {
                  title: 'Upgrade to Pro Scholar',
                  desc: 'Unlock the full power of Lockin AI. Unlimited courses, AI tutoring, and essay grading.',
                  icon: <Rocket className="w-10 h-10 text-white" />
              };
      }
  }

  const content = getContent();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative border border-slate-100">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/80 to-transparent z-0 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] z-0 pointer-events-none" />
        <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-indigo-500/10 rounded-full blur-[50px] z-0 pointer-events-none" />

        <div className="relative z-10 p-8 flex flex-col items-center text-center">
          
          {/* Hero Icon */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30 transform rotate-3">
              {content.icon}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-1.5 rounded-full shadow-sm border-2 border-white">
                <Star className="w-3 h-3 fill-current" />
            </div>
          </div>

          {/* Text Content */}
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {content.title}
          </h2>
          
          <p className="text-slate-500 mb-8 max-w-[280px] leading-relaxed text-sm">
            {content.desc}
          </p>

          {/* Pricing Box */}
          <div className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mb-6 relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Best Value
            </div>
            
            <div className="flex flex-col items-start mb-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pro Scholar</div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">$9.99</span>
                    <span className="text-sm font-medium text-slate-500">/month</span>
                </div>
            </div>

            <div className="space-y-2">
                <Feature text="Unlimited Courses & Assignments" />
                <Feature text="Unlimited AI Tutor Queries" />
                <Feature text="Advanced Essay Grading" />
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={onUpgrade}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <Zap className="w-5 h-5 text-amber-400 fill-current group-hover:animate-pulse" />
            <span>Upgrade to Pro</span>
          </button>
          
          <p className="mt-4 text-[11px] text-slate-400 font-medium">
            Secured by Stripe • Cancel anytime
          </p>

        </div>
      </div>
    </div>
  );
};

const Feature: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2.5 text-left">
    <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <Check className="w-2.5 h-2.5 text-blue-600 stroke-[3]" />
    </div>
    <span className="text-xs font-semibold text-slate-700">{text}</span>
  </div>
);

export default PaywallModal;