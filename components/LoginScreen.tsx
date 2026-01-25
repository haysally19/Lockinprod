import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Loader2, AlertCircle, Star, CheckCircle2, Zap } from 'lucide-react';
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
    <div className="flex h-screen w-full overflow-hidden bg-white font-sans">
      
      {/* LEFT SIDE: Visual Conversion Engine (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] text-white flex-col justify-between p-12 overflow-hidden">
        
        {/* Animated Background Mesh */}
        <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        
        {/* Content Layer */}
        <div className="relative z-10 h-full flex flex-col justify-center max-w-lg mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-8 w-fit">
                <Zap className="w-3 h-3" />
                <span>AI-Powered Advantage</span>
            </div>

            <h2 className="text-5xl font-extrabold leading-tight mb-6">
                Stop studying <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">harder.</span>
            </h2>
            
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Join 10,000+ students who have automated their note-taking, essay grading, and study planning with Lockin AI.
            </p>

            {/* Feature List (Trust Anchors) */}
            <div className="space-y-4 mb-12">
                <FeatureItem text="Instant Essay Feedback & Grading" />
                <FeatureItem text="Syllabus-Aware Study Guides" />
                <FeatureItem text="24/7 AI Tutor that knows your classes" />
            </div>

            {/* Social Proof Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-default">
                <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0F172A] bg-slate-700 overflow-hidden">
                            <img src={`https://i.pravatar.cc/150?img=${10 + i}`} alt="Student" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <div>
                    <div className="flex text-amber-400 mb-1">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                        <span className="text-white font-bold">4.9/5</span> from 1,200+ reviews
                    </p>
                </div>
            </div>
        </div>
        
        {/* Footer Note */}
        <div className="relative z-10 text-xs text-slate-500">
            © 2026 Lockin AI Inc. Secure & Encrypted.
        </div>
      </div>

      {/* RIGHT SIDE: High-Focus Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
        <div className="w-full max-w-[420px] animate-fade-in-up">
            
            <div className="mb-8 text-center">
                <div className="flex justify-center mb-6">
                    <Logo showText={true} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {isLogin ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className="text-slate-500">
                    {isLogin ? 'Enter your details to access your workspace.' : 'Get started for free. No credit card required.'}
                </p>
            </div>

            {/* Google Button - Primary Action */}
            <button
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden mb-6 shadow-sm"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
            </button>

            <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or continue with email</span>
                <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                            placeholder="student@university.edu"
                            required
                            autoFocus={!isLogin}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                            placeholder={isLogin ? "••••••••" : "8+ characters"}
                            required
                            minLength={8}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            {isLogin ? 'Sign In' : 'Create Account'}
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
                            navigate(isLogin ? '/signup' : '/login');
                        }}
                        className="ml-2 text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline"
                    >
                        {isLogin ? 'Sign up free' : 'Log in'}
                    </button>
                </p>
            </div>
            
            {/* Legal Links */}
            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-center gap-6 text-xs text-slate-400">
                <Link to="/terms" className="hover:text-slate-600">Terms of Service</Link>
                <Link to="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
            </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{text: string}> = ({text}) => (
    <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <span className="text-slate-300 font-medium">{text}</span>
    </div>
);

export default LoginScreen;