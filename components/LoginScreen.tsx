import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Loader2, AlertCircle, Sparkles } from 'lucide-react';
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
        options: { redirectTo: window.location.origin }
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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin();
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) onLogin();
        else setError('Please check your email to confirm your account.');
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#0F172A] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* --- Premium Ambient Background (No Scroll) --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px]"></div>
      
      <div className="relative z-10 w-full max-w-[400px] mx-4 animate-fade-in-up">
        {/* Glass Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4 scale-90">
                <Logo showText={true} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isLogin ? 'Access your AI workspace.' : 'Join 10,000+ students excelling.'}
            </p>
          </div>

          {/* Google Auth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-sm text-sm"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs flex gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Compact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
                <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                        placeholder="Email address"
                        required
                        autoFocus={!isLogin}
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                        placeholder="Password"
                        required
                        minLength={8}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs">
                {isLogin ? "New here?" : "Already a member?"}
                <button
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError(null);
                        navigate(isLogin ? '/signup' : '/login');
                    }}
                    className="ml-1.5 text-blue-600 font-bold hover:text-blue-700 transition-colors"
                >
                    {isLogin ? 'Sign up free' : 'Log in'}
                </button>
            </p>
          </div>
        </div>

        {/* Footer Links (Outside Card) */}
        <div className="mt-6 text-center flex justify-center gap-4 text-xs text-slate-500/60 font-medium">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;