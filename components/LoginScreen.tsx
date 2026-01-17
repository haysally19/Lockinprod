import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, Loader2, AlertCircle, Phone, Check, Star, Zap, Shield, Sparkles } from 'lucide-react';
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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.isSignUp) {
      setIsLogin(false);
    }
  }, [location.state]);

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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone: phone || null,
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          onLogin();
        } else {
          setError('Please check your email to confirm your account before logging in.');
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col justify-center items-center p-4 md:p-6 relative overflow-hidden" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))', paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}>
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-5xl'} relative z-10 animate-fade-in-up`}>
        {!isLogin ? (
          <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-3xl lg:rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden backdrop-blur-sm">
            {/* Left Side - Value Proposition */}
            <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  Join 10,000+ students crushing their goals
                </h2>
                <p className="text-blue-100 text-lg mb-8">
                  Get instant access to AI-powered tutoring, essay grading, and productivity tools designed for academic success.
                </p>

                {/* Benefits List */}
                <div className="space-y-4 mb-12">
                  {[
                    { icon: <Sparkles className="w-5 h-5" />, text: '24/7 AI tutor trained on your course materials' },
                    { icon: <Zap className="w-5 h-5" />, text: 'Instant essay feedback and grading' },
                    { icon: <Check className="w-5 h-5" />, text: 'Smart assignment tracking and reminders' },
                    { icon: <Shield className="w-5 h-5" />, text: 'Secure, encrypted, and private' }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        {benefit.icon}
                      </div>
                      <p className="text-white/90 font-medium pt-2">{benefit.text}</p>
                    </div>
                  ))}
                </div>

                {/* Social Proof */}
                <div className="border-t border-white/20 pt-8">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex -space-x-2">
                      <img src="https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                      <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                      <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2" alt="Student" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-white flex items-center justify-center text-xs font-bold">
                        +10K
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-blue-100 italic">
                    "Lockin AI helped me raise my GPA by 0.8 points in one semester. The AI tutor is like having a professor available 24/7!"
                  </p>
                  <p className="text-xs text-blue-200 mt-2 font-semibold">— Sarah M., Stanford University</p>
                </div>
              </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="p-6 md:p-12 lg:p-12">
              {/* Mobile Hero Section */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 mb-6">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-green-700 font-bold text-sm">Free Forever • No Credit Card</span>
                </div>

                <h1 className="text-4xl md:text-3xl lg:text-3xl font-bold text-slate-900 mb-4 leading-[1.1]">
                  Your AI study companion
                </h1>

                <p className="text-slate-600 text-lg md:text-lg leading-relaxed mb-6">
                  Get instant help with homework, essays, and studying. Available 24/7.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6 lg:hidden">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100">
                    <div className="text-2xl font-bold text-blue-700 mb-1">24/7</div>
                    <div className="text-xs text-slate-600 font-medium">AI Tutor</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-purple-100">
                    <div className="text-2xl font-bold text-purple-700 mb-1">10K+</div>
                    <div className="text-xs text-slate-600 font-medium">Students</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center border border-green-100">
                    <div className="text-2xl font-bold text-green-700 mb-1">Free</div>
                    <div className="text-xs text-slate-600 font-medium">Forever</div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-[1.125rem] w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-[1.125rem] bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 text-[17px] placeholder:text-slate-400 hover:border-slate-300 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-[1.125rem] w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-[1.125rem] bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 text-[17px] placeholder:text-slate-400 hover:border-slate-300 shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-[1.125rem] w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Create password (8+ characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-[1.125rem] bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 text-[17px] placeholder:text-slate-400 hover:border-slate-300 shadow-sm"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold py-[1.125rem] rounded-2xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6 text-[17px]"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-500 pt-2">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline font-medium">Terms</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline font-medium">Privacy</Link>
                </p>
              </form>

              {/* Social Proof - Bottom */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex -space-x-2.5">
                    <img src="https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" alt="Student" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                    <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" alt="Student" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                    <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2" alt="Student" className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm" />
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-center text-sm text-slate-600 font-medium">
                  Join 10,000+ students already using Lockin AI
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-600 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setError(null);
                      navigate('/login');
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
            <div className="flex justify-center mb-8">
              <div className="h-16 w-auto transition-transform hover:scale-105 duration-500">
                <Logo showText={true} />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-500">
                Enter your credentials to access your workspace.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError(null);
                    navigate('/signup');
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Sign up free
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;