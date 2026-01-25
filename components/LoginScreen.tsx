import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Loader2, AlertCircle, Star, Sparkles, Check, Shield, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Logo from './Logo';

interface LoginScreenProps {
  onLogin: () => void;
  initialMode?: 'login' | 'signup';
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, initialMode = 'login' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.isSignUp) {
      setIsLogin(false);
    }
  }, [location.state]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin // Ensure this matches your Supabase Redirect URLs
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin();
      } else {
        // OPTIMIZATION: Removed 'options: data: { full_name }' to reduce friction.
        // Collect name in onboarding instead.
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;

        // CRITICAL: Ensure 'Confirm Email' is disabled in Supabase settings
        // so data.session is available immediately.
        if (data.session) {
          onLogin();
        } else {
          // Fallback if email confirmation is arguably still on
          setError('Please check your email to confirm your account.');
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col justify-center items-center p-4 md:p-6 relative">
      <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-5xl'} relative z-10 animate-fade-in-up`}>
        {!isLogin ? (
          <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
            {/* Left Side - Simplified for higher conversion focus */}
            <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">You're one step away.</h2>
                <p className="text-blue-100 text-lg mb-8">Join 10,000+ students already saving 10+ hours a week.</p>
                <div className="space-y-4">
                  {[
                    'Instant Essay Grading',
                    'Automatic Study Guides',
                    'Syllabus Organizer'
                  ].map((txt, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Check className="w-4 h-4"/></div>
                        <span className="font-medium">{txt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 mt-12 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10">
                   <div className="flex text-yellow-400 mb-2">
                       {[1,2,3,4,5].map(i=><Star key={i} className="w-4 h-4 fill-current"/>)}
                   </div>
                   <p className="text-sm italic">"I created my account 5 mins before my exam and the AI summary literally saved my grade."</p>
                   <p className="text-xs font-bold mt-2 opacity-80">- Alex T., UCLA</p>
              </div>
            </div>

            {/* Right Side - The High Conversion Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900">Create your free account</h1>
                  <p className="text-slate-500 mt-2">No credit card required.</p>
              </div>

              {/* SOCIAL PROOF / GOOGLE AUTH */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-medium text-slate-700 mb-6 bg-white"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase">Or with email</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* REMOVED NAME FIELD FOR HIGHER CONVERSION */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
                    <input
                      type="email"
                      autoFocus // Crucial for UX
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                      placeholder="student@university.edu"
                      required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                      placeholder="8+ characters"
                      required
                      minLength={8}
                    />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get Started <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>

              <p className="text-center text-xs text-slate-400 mt-6">
                By joining, you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
              </p>
              
              <div className="mt-6 text-center">
                  <span className="text-slate-500 text-sm">Already have an account? </span>
                  <button onClick={() => { setIsLogin(true); setError(null); navigate('/login'); }} className="text-blue-600 font-bold hover:underline text-sm">Log in</button>
              </div>
            </div>
          </div>
        ) : (
          /* Login View (Kept mostly the same, added Google Auth) */
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
             <div className="flex justify-center mb-6">
               <Logo showText={true} />
             </div>
             <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">Welcome Back</h1>
             
             <button 
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-medium text-slate-700 mb-6"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Sign in with Google
              </button>

             <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase">Or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
                   <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" required />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                   <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" required />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </button>
             </form>
             <div className="mt-6 text-center">
                  <span className="text-slate-500 text-sm">New here? </span>
                  <button onClick={() => { setIsLogin(false); setError(null); navigate('/signup'); }} className="text-blue-600 font-bold hover:underline text-sm">Create account</button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;