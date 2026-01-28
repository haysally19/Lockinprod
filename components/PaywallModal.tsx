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
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-t-[32px] md:rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:zoom-in-95 duration-300 relative border-t md:border border-slate-100" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 md:p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-20 active:scale-95"
        >
          <X className="w-5 h-5 md:w-4 md:h-4" />
        </button>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50/80 to-transparent z-0 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] z-0 pointer-events-none" />
        <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-indigo-500/10 rounded-full blur-[50px] z-0 pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8 flex flex-col items-center text-center">

          {/* Hero Icon */}
          <div className="mb-6 relative">
            <div className="w-24 h-24 md:w-20 md:h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30 transform rotate-3">
              {content.icon}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2 md:p-1.5 rounded-full shadow-sm border-2 border-white">
                <Star className="w-4 h-4 md:w-3 md:h-3 fill-current" />
            </div>
          </div>

          {/* Text Content */}
          <h2 className="text-3xl md:text-2xl font-extrabold text-slate-900 mb-3 md:mb-2 tracking-tight">
            {content.title}
          </h2>

          <p className="text-slate-500 mb-8 max-w-[320px] md:max-w-[280px] leading-relaxed text-base md:text-sm">
            {content.desc}
          </p>

          {/* Pricing Box */}
          <div className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl p-5 md:p-4 mb-6 relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] md:text-[10px] font-bold px-4 py-1.5 md:px-3 md:py-1 rounded-bl-xl uppercase tracking-wider">
                Best Value
            </div>

            <div className="flex flex-col items-start mb-4 md:mb-3">
                <div className="text-sm md:text-xs font-bold text-slate-500 uppercase tracking-wide">Pro Scholar</div>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-3xl font-extrabold text-slate-900">$9.99</span>
                    <span className="text-base md:text-sm font-medium text-slate-500">/month</span>
                </div>
            </div>

            <div className="space-y-3 md:space-y-2">
                <Feature text="Unlimited Courses & Assignments" />
                <Feature text="Unlimited AI Tutor Queries" />
                <Feature text="Advanced Essay Grading" />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onUpgrade}
            className="w-full py-5 md:py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-2xl shadow-xl shadow-slate-900/20 transition-all transform md:hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
          >
            <Zap className="w-6 h-6 md:w-5 md:h-5 text-amber-400 fill-current group-hover:animate-pulse" />
            <span>Upgrade to Pro</span>
          </button>

          <p className="mt-5 md:mt-4 text-xs md:text-[11px] text-slate-400 font-medium">
            Secured by Stripe • Cancel anytime
          </p>

        </div>
      </div>
    </div>
  );
};

const Feature: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-3 md:gap-2.5 text-left">
    <div className="w-5 h-5 md:w-4 md:h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <Check className="w-3 h-3 md:w-2.5 md:h-2.5 text-blue-600 stroke-[3]" />
    </div>
    <span className="text-sm md:text-xs font-semibold text-slate-700">{text}</span>
  </div>
);

export default PaywallModal;