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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col justify-center items-center p-4 relative overflow-hidden" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))', paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}>
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none"></div>

      <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-5xl'} relative z-10 animate-fade-in-up`}>
        {!isLogin ? (
          <div className="grid lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white"></div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white"></div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-white"></div>
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
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Free Forever • No Credit Card Required
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Create your free account
                </h1>
                <p className="text-slate-600">
                  Start improving your grades in under 60 seconds
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
                  <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 hover:border-slate-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="student@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 hover:border-slate-300"
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
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 hover:border-slate-300"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 ml-1">Phone Number (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 hover:border-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6 text-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Start Learning Smarter
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  By signing up, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </p>
              </form>

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

              {/* Mobile Social Proof */}
              <div className="lg:hidden mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 text-center">
                  Trusted by 10,000+ students at top universities
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