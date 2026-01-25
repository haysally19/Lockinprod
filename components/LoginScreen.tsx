import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Loader2, AlertCircle, Star, Sparkles, Check, Shield, Zap, PlayCircle } from 'lucide-react';
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
          redirectTo: window.location.origin
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
        // Optimized Signup: Email + Password only
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          onLogin();
        } else {
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
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-4 md:p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-6xl'} relative z-10 transition-all duration-500 ease-in-out`}>
        
        <div className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl overflow-hidden border border-white/20 grid lg:grid-cols-12 min-h-[600px]">
            
            {/* Left Side (Visuals) - Only visible on Signup or large Login */}
            <div className={`hidden lg:flex ${isLogin ? 'lg:col-span-0 hidden' : 'lg:col-span-5'} flex-col relative bg-slate-900 text-white p-10 overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 opacity-90 z-0"></div>
                
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-8 opacity-80">
                            <Sparkles className="w-5 h-5 text-blue-300" />
                            <span className="font-bold tracking-wide text-sm uppercase text-blue-100">AI Student Assistant</span>
                        </div>
                        
                        <h2 className="text-4xl font-extrabold leading-tight mb-6">
                            Study smarter,<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">not harder.</span>
                        </h2>
                        
                        <p className="text-blue-100/80 text-lg leading-relaxed mb-8">
                            Join 10,000+ students using Lockin AI to automate their summaries, grading, and scheduling.
                        </p>

                        <div className="space-y-5">
                            <FeatureRow icon={<Zap className="w-4 h-4 text-amber-300"/>} text="Instant Essay Grading" />
                            <FeatureRow icon={<PlayCircle className="w-4 h-4 text-emerald-300"/>} text="Automated Study Guides" />
                            <FeatureRow icon={<Shield className="w-4 h-4 text-purple-300"/>} text="Syllabus Organization" />
                        </div>
                    </div>

                    {/* Social Proof Widget */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 transform hover:scale-105 transition-transform duration-300 cursor-default">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="flex -space-x-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${10+i}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                    +10k
                                </div>
                            </div>
                            <div>
                                <div className="flex text-amber-400 mb-0.5">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                </div>
                                <p className="text-xs font-medium text-blue-100">Loved by students at Ivy Leagues</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side (Form) */}
            <div className={`col-span-12 ${!isLogin ? 'lg:col-span-7' : ''} p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-center`}>
                <div className="max-w-md mx-auto w-full">
                    <div className="text-center mb-10">
                        <div className="inline-block mb-4">
                             <Logo showText={false} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                            {isLogin ? 'Welcome back' : 'Create your account'}
                        </h1>
                        <p className="text-slate-500">
                            {isLogin ? 'Enter your details to access your workspace.' : 'Get started for free. No credit card required.'}
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full h-14 bg-white border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Continue with Google</span>
                    </button>

                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or email</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    placeholder="student@university.edu"
                                    required
                                    autoFocus={!isLogin}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                    placeholder={isLogin ? "••••••••" : "Create a password (8+ chars)"}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Get Started Free'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                    if(isLogin) navigate('/signup');
                                    else navigate('/login');
                                }}
                                className="ml-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
                            >
                                {isLogin ? 'Sign up for free' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Footer links */}
        <div className="mt-8 text-center space-x-6 text-sm text-slate-400 font-medium">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>

      </div>
    </div>
  );
};

const FeatureRow: React.FC<{icon: React.ReactNode, text: string}> = ({icon, text}) => (
    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            {icon}
        </div>
        <span className="font-medium text-blue-50">{text}</span>
    </div>
);

export default LoginScreen;