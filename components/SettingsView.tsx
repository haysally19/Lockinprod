import React, { useState } from 'react';
import { User, CreditCard, Zap, LogOut, Loader2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { openPortal } from '../lib/stripe';

interface SettingsViewProps {
  userTier: 'free' | 'pro';
  userProfile: {
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
  onUpgrade: () => void;
  onDowngrade: () => void;
  onLogout: () => void;
  dailyTokens: number;
  bonusCredits: number;
}

const SettingsView: React.FC<SettingsViewProps> = ({ userTier, userProfile, onUpgrade, onDowngrade, onLogout, dailyTokens, bonusCredits }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const maxTokens = 5;
  const creditsRemaining = Math.max(0, maxTokens - dailyTokens);
  const totalCredits = creditsRemaining + bonusCredits;

  const handleStripeUpgrade = () => {
    // Open the Paywall Modal directly.
    onUpgrade();
  };

  const handleStripePortal = async (action: 'cancel' | 'update_payment') => {
    setLoadingAction(action);
    // Use the Stripe portal helper
    try {
        openPortal();
    } catch (e) {
        console.error("Portal error:", e);
    } finally {
        setLoadingAction(null);
    }
  };

  const handleSignOut = () => {
      if(window.confirm("Are you sure you want to sign out?")) {
          onLogout();
      }
  }

  return (
    <div className="h-full bg-slate-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6 pb-24">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account, subscription, and preferences.</p>
        </div>

        {/* Subscription Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${userTier === 'pro' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {userTier === 'pro' ? 'Pro Scholar Plan' : 'Starter Plan'}
                </h2>
                <p className="text-xs text-slate-500">
                  {userTier === 'pro' ? 'Active • Next billing date: June 1, 2024' : 'Free Tier • Limited Access'}
                </p>
              </div>
            </div>
            {userTier === 'free' ? (
              <button 
                onClick={handleStripeUpgrade}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2"
              >
                <Zap className="w-3 h-3 fill-white" />
                Upgrade to Pro
              </button>
            ) : (
               <button 
                onClick={() => handleStripePortal('cancel')}
                disabled={!!loadingAction}
                className="px-4 py-2 text-xs text-slate-500 hover:text-red-600 font-bold transition-colors flex items-center gap-2"
              >
                {loadingAction === 'cancel' && <Loader2 className="w-3 h-3 animate-spin" />}
                Manage Subscription
              </button>
            )}
          </div>

          <div className="p-5 bg-slate-50/50">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Usage & Limits</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">AI Tutor Credits Remaining</span>
                  <span className="font-bold text-slate-900">{userTier === 'pro' ? 'Unlimited' : `${totalCredits} left`}</span>
                </div>
                {userTier === 'free' && (
                  <>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          creditsRemaining > 2 ? 'bg-blue-500' :
                          creditsRemaining > 0 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(creditsRemaining / maxTokens) * 100}%` }}
                      />
                    </div>
                    {bonusCredits > 0 && (
                      <p className="text-[10px] text-blue-600 mt-1 font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> +{bonusCredits} bonus credits available
                      </p>
                    )}
                    {creditsRemaining === 0 && bonusCredits === 0 && (
                      <p className="text-[10px] text-red-500 mt-1 font-bold">Limit reached. Upgrade for unlimited access.</p>
                    )}
                  </>
                )}
              </div>

               <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Active Courses</span>
                  <span className="font-bold text-slate-900">{userTier === 'pro' ? 'Unlimited' : '1 Max'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Profile
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                <input type="text" value={userProfile?.full_name || ''} className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm" readOnly />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                <input type="email" value={userProfile?.email || ''} className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm" readOnly />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                <input type="tel" value={userProfile?.phone || 'Not provided'} className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm" readOnly />
              </div>
              <div className="pt-1">
                 <button className="text-xs font-bold text-slate-500 hover:text-slate-800">
                    Change Password
                 </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" /> Billing Method
            </h3>
            {userTier === 'pro' ? (
                <>
                    <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg mb-4 bg-slate-50/50">
                    <div className="w-8 h-6 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-[10px]">VISA</div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">•••• •••• •••• 4242</p>
                        <p className="text-[10px] text-slate-500">Expires 12/28</p>
                    </div>
                    </div>
                    <button 
                        onClick={() => handleStripePortal('update_payment')}
                        disabled={!!loadingAction}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 mt-auto"
                    >
                        {loadingAction === 'update_payment' ? <Loader2 className="w-3 h-3 animate-spin"/> : <ExternalLink className="w-3 h-3" />}
                        Update Payment Method
                    </button>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50">
                    <ShieldCheck className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500 mb-3">No payment method on file.</p>
                    <button 
                        onClick={handleStripeUpgrade}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                        Add Payment Method
                    </button>
                </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-200">
            <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;