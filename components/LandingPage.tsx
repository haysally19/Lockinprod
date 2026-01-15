import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, GraduationCap, ArrowRight, Check, Zap, ShieldCheck, BookOpen, ChevronDown, Star, PlayCircle, BarChart3, UploadCloud, Brain, Trophy, Download } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="bg-white text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="overflow-x-hidden">
        {/* HERO SECTION - LIGHT THEME */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Top Left Gradient */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-gradient-to-br from-blue-100/50 via-indigo-100/40 to-purple-100/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            {/* Bottom Right Gradient */}
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-gradient-to-tl from-cyan-100/50 via-blue-100/40 to-indigo-100/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            {/* Center Subtle Highlight */}
            <div className="absolute top-[30%] left-[50%] -translate-x-[50%] w-[600px] h-[600px] bg-rose-100/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <div className="container mx-auto px-6 text-center relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wide mb-8 animate-fade-in-up backdrop-blur-sm shadow-sm hover:bg-white/80 transition-colors cursor-default" style={{ marginTop: 'max(0px, env(safe-area-inset-top))' }}>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Join 10,000+ students using Lockin AI
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8 max-w-5xl mx-auto animate-fade-in-up delay-100">
                    Stop Drowning in Assignments. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                        Start Locking In.
                    </span>
                </h1>

                {/* Subtext */}
                <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-4 leading-relaxed animate-fade-in-up delay-200">
                    The only AI workspace that knows your syllabus. Upload your documents and get instant tutoring, grading, and organization for every class.
                </p>

                {/* Social Proof Stats */}
                <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-slate-600 animate-fade-in-up delay-250">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-white"></div>
                        </div>
                        <span className="font-bold text-slate-700">2,847 students joined this week</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-slate-700 ml-1">4.9/5</span>
                        <span className="text-slate-500">(1,200+ reviews)</span>
                    </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                    <Link
                        to="/login"
                        state={{ isSignUp: true }}
                        className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                    >
                        Get Started Free — No Credit Card
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    {showInstallButton && (
                        <button
                            onClick={handleInstallClick}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/30"
                        >
                            <Download className="w-5 h-5" />
                            Get the App
                        </button>
                    )}
                </div>
                <p className="text-sm text-slate-500 mt-4 animate-fade-in-up delay-350">
                    {showInstallButton ? 'Install the app for quick access from your home screen' : 'Free forever. Upgrade anytime.'}
                </p>
            </div>

            {/* Dashboard Screenshot */}
            <div className="relative mt-20 container mx-auto px-4 perspective-1000 animate-fade-in-up delay-500">
                <div className="relative rounded-2xl bg-white p-2 ring-1 ring-slate-200 shadow-2xl mx-auto max-w-6xl transform hover:scale-[1.02] transition-transform duration-500 ease-out border border-slate-100">
                    {/* Browser Chrome */}
                    <div className="h-10 bg-slate-50 rounded-t-xl flex items-center px-4 gap-2 border-b border-slate-200">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="ml-4 flex-1 bg-white h-7 rounded-md border border-slate-200 text-[10px] flex items-center px-3 text-slate-400 font-medium font-mono shadow-sm">lockinai.online/dashboard</div>
                    </div>
                    {/* Screenshot */}
                    <div className="rounded-b-xl overflow-hidden bg-slate-50 relative">
                        <img
                            src="/screenshot_15-1-2026_11737_lockinai.online.jpeg"
                            alt="Lockin AI Dashboard Interface"
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                 {/* Floating Badges */}
                <div className="absolute -top-4 right-4 lg:right-8 w-64 bg-white border border-green-200 p-4 rounded-2xl shadow-xl animate-float hidden lg:block">
                     <div className="flex items-center gap-3 mb-2">
                         <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100"><Trophy className="w-5 h-5" /></div>
                         <div>
                             <p className="text-xs text-green-600 font-bold uppercase tracking-wide">Average GPA Increase</p>
                             <p className="font-black text-slate-900 text-2xl">+0.7 Points</p>
                         </div>
                     </div>
                     <p className="text-xs text-slate-500 mt-2">Based on 1,000+ student surveys</p>
                 </div>

                 <div className="absolute -bottom-4 left-4 lg:left-8 w-72 bg-white border border-blue-200 p-4 rounded-2xl shadow-xl animate-float hidden lg:block" style={{animationDelay: '1s'}}>
                     <div className="flex items-center gap-4 mb-3">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><Zap className="w-5 h-5" /></div>
                         <div className="flex-1">
                             <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Time Saved Per Week</p>
                             <p className="font-black text-slate-900 text-2xl">8-12 Hours</p>
                         </div>
                     </div>
                     <p className="text-xs text-slate-500">More time for what matters</p>
                 </div>
            </div>
        </section>

        {/* SOCIAL PROOF */}
        <div className="border-b border-slate-100 bg-slate-50 py-12 overflow-hidden">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by students at top universities</p>
            <div className="flex justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 flex-wrap px-6 select-none mb-8">
                {['Stanford', 'MIT', 'Harvard', 'Berkeley', 'UCLA', 'Oxford'].map((uni) => (
                    <span key={uni} className="text-xl md:text-2xl font-serif font-bold text-slate-800">{uni}</span>
                ))}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 text-center px-6 max-w-4xl mx-auto">
                <div className="flex-1 min-w-[200px]">
                    <div className="text-4xl font-black text-blue-600 mb-1">10,000+</div>
                    <div className="text-sm text-slate-600 font-medium">Active Students</div>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <div className="text-4xl font-black text-blue-600 mb-1">50,000+</div>
                    <div className="text-sm text-slate-600 font-medium">Essays Graded</div>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <div className="text-4xl font-black text-blue-600 mb-1">1M+</div>
                    <div className="text-sm text-slate-600 font-medium">AI Tutor Queries</div>
                </div>
            </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                 <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">From overwhelmed to organized in <span className="text-blue-600">3 steps</span>.</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -z-10"></div>

                    <div className="text-center">
                        <div className="w-24 h-24 bg-white border border-slate-100 shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <UploadCloud className="w-8 h-8" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-white">1</div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Connect Your Classes</h3>
                        <p className="text-slate-600">Upload your syllabus, notes, and past assignments. Lockin AI builds a custom knowledge base for each course.</p>
                    </div>

                    <div className="text-center">
                        <div className="w-24 h-24 bg-white border border-slate-100 shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                             <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                <Brain className="w-8 h-8" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-white">2</div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">AI Does The Heavy Lifting</h3>
                        <p className="text-slate-600">Get instant answers from the AI Tutor, generate study guides from your notes, or grade your essays in seconds.</p>
                    </div>

                    <div className="text-center">
                        <div className="w-24 h-24 bg-white border border-slate-100 shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                             <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-white">3</div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Ace The Semester</h3>
                        <p className="text-slate-600">Track deadlines on your dashboard and watch your GPA climb with significantly less stress.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* BENTO GRID FEATURES */}
        <section id="features" className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Everything you need to <span className="text-blue-600">Lock In</span>.</h2>
                <p className="text-lg text-slate-600">Replace your scattered tools with one cohesive operating system designed for academic success.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1: AI Tutor (Large) */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative min-h-[400px]">
                    <div className="relative z-10 max-w-lg">
                         <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">24/7 Context-Aware AI Tutor</h3>
                        <p className="text-slate-600 text-lg mb-6">
                            Gemini 3.0 Pro doesn't just guess. It reads your uploaded syllabus and notes to give you answers that actually match your curriculum.
                        </p>
                         <ul className="space-y-2 mb-8">
                            {['Step-by-step problem solving', 'Exam prep based on your notes', 'Deep conceptual explanations'].map(i => (
                                <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                                    <Check className="w-4 h-4 text-blue-500" /> {i}
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="absolute right-0 bottom-0 w-3/4 md:w-1/2 bg-slate-50 border-t border-l border-slate-100 rounded-tl-3xl p-6 shadow-sm translate-y-4 translate-x-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">
                         <div className="flex gap-3 mb-4">
                             <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0"></div>
                             <div className="bg-slate-200 rounded-2xl rounded-tl-none p-3 w-full h-4"></div>
                         </div>
                         <div className="flex gap-3 mb-4">
                             <div className="w-full bg-slate-100 rounded-2xl rounded-tr-none p-3 h-12"></div>
                             <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0"></div>
                         </div>
                    </div>
                </div>

                {/* Feature 2: Essay Grader (Tall) */}
                <div className="md:row-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl border border-slate-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-white mb-6 border border-white/20">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Instant Essay Feedback</h3>
                        <p className="text-slate-400 mb-8">
                            Stop waiting weeks for a grade. Get a score, detailed critique, and grammar fixes in seconds.
                        </p>
                        
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-4 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                <span className="text-sm text-slate-400 font-medium">Predicted Score</span>
                                <span className="text-3xl font-bold text-green-400">92<span className="text-sm text-slate-500">/100</span></span>
                            </div>
                            <div className="space-y-3 pt-2">
                                <div className="flex gap-3 items-start">
                                    <div className="bg-green-500/20 p-1 rounded text-green-400 mt-0.5"><Check className="w-3 h-3" /></div>
                                    <p className="text-xs text-slate-300">Strong thesis statement with clear argumentation.</p>
                                </div>
                                 <div className="flex gap-3 items-start">
                                    <div className="bg-yellow-500/20 p-1 rounded text-yellow-400 mt-0.5"><Zap className="w-3 h-3" /></div>
                                    <p className="text-xs text-slate-300">Consider varying sentence structure in paragraph 3.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 3: Smart Notes */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:border-purple-200 group">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:rotate-6 transition-transform">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Notes</h3>
                    <p className="text-slate-600">Auto-summarize long readings, generate study guides, and fix messy formatting instantly.</p>
                </div>

                {/* Feature 4: Organization */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:border-emerald-200 group">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:rotate-6 transition-transform">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Assignment Tracker</h3>
                    <p className="text-slate-600">Visualize deadlines and progress. Never miss a due date with automated priority sorting.</p>
                </div>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="py-24 bg-white border-y border-slate-100">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why students switch to Lockin.</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center text-red-600"><span className="font-bold text-lg">✕</span></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">The Old Way</h4>
                                    <p className="text-slate-600 text-sm mt-1">Disorganized Google Docs, generic ChatGPT answers that hallucinate facts, missed deadlines, and endless exam stress.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white"><Check className="w-6 h-6"/></div>
                                <div>
                                    <h4 className="font-bold text-slate-900">The Lockin Way</h4>
                                    <p className="text-slate-700 text-sm mt-1">A centralized hub. AI that knows your syllabus. Automated organization. Better grades with significantly less effort.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl rotate-3 opacity-10 blur-xl"></div>
                        <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-lg">SJ</div>
                                <div>
                                    <p className="font-bold text-slate-900">Sarah Jenkins</p>
                                    <p className="text-xs text-slate-500">Pre-Med Student @ Yale</p>
                                </div>
                                <div className="ml-auto flex text-yellow-400">
                                    {[1,2,3,4,5].map(i=><Star key={i} className="w-4 h-4 fill-current"/>)}
                                </div>
                            </div>
                            <p className="text-slate-700 text-lg italic leading-relaxed">"I used to have 50 tabs open and still felt lost. Lockin AI consolidated everything. The essay grader alone saved my GPA last semester. It's honestly unfair how much time it saves."</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                 <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Don't just take our word for it.</h2>
                    <p className="text-lg text-slate-600">Join the community of students securing their future.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <TestimonialCard
                        initials="JD"
                        name="Jason D."
                        role="Engineering Major • Cornell"
                        text="I used to pull all-nighters every week. The automated study guides cut my exam prep time in half. Went from a 3.2 to 3.8 GPA in one semester."
                        delay={0}
                    />
                    <TestimonialCard
                        initials="PL"
                        name="Priya L."
                        role="English Lit • UC Berkeley"
                        text="The essay grader is better than my professor's feedback. It caught thesis errors that would have tanked my grade. Got an A on my final paper."
                        delay={100}
                    />
                    <TestimonialCard
                        initials="MR"
                        name="Marcus R."
                        role="Pre-Law • Georgetown"
                        text="Finally an app that actually understands my specific syllabus. It's not just generic AI, it knows exactly what I need to study. Game changer."
                        delay={200}
                    />
                </div>
            </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Simple, Transparent Pricing</h2>
                    <p className="text-lg text-slate-600">Invest in your GPA for less than the price of a Spotify subscription.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl border border-slate-200 bg-white hover:border-blue-300 transition-all hover:shadow-lg flex flex-col">
                        <h3 className="font-bold text-xl text-slate-900 mb-2">Starter</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-slate-900">$0</span>
                            <span className="text-slate-500">/month</span>
                        </div>
                        <p className="text-slate-600 mb-8 font-medium">Perfect for trying out the platform.</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['1 Course Limit', '5 AI Tutor Queries / Day', 'Basic Note Taking', 'Assignment Tracker'].map((feat) => (
                                <li key={feat} className="flex items-center gap-3 text-slate-600 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Check className="w-3 h-3" /></div> {feat}
                                </li>
                            ))}
                        </ul>
                        <Link to="/login" state={{ isSignUp: true }} className="block w-full py-3.5 px-6 text-center font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-3xl border-2 border-blue-600 bg-slate-900 text-white relative shadow-2xl transform md:-translate-y-4 flex flex-col">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-lg uppercase tracking-wide">
                            Best Value
                        </div>
                        <h3 className="font-bold text-xl mb-2">Pro Scholar</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold text-white">$9.99</span>
                            <span className="text-slate-400">/month</span>
                        </div>
                        <p className="text-slate-300 mb-8 font-medium">Everything you need to excel.</p>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Unlimited Courses', 'Unlimited AI Tutor 24/7', 'Advanced Essay Grading', 'Smart Study Guides', 'Priority Support'].map((feat) => (
                                <li key={feat} className="flex items-center gap-3 text-slate-200 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div> {feat}
                                </li>
                            ))}
                        </ul>
                        <Link to="/login" state={{ isSignUp: true }} className="block w-full py-3.5 px-6 text-center font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-lg shadow-blue-600/30">
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <FAQItem 
                question="Is Lockin AI academic dishonesty?"
                answer="No. Lockin AI is designed as a tutor and study aid, not a homework machine. It helps you understand concepts, outlines essays, and organizes your life. We encourage learning, not cheating."
              />
              <FAQItem 
                question="Can I upload my own syllabus?"
                answer="Yes! You can upload PDFs, Word docs, and images. Our AI reads them to understand exactly what you need to study for your specific class."
              />
              <FAQItem 
                question="What makes this better than ChatGPT?"
                answer="ChatGPT is general. Lockin AI is a workspace built specifically for students, with persistent context for each of your classes, specialized tools for grading and notes, and an organization system tied to your actual schedule."
              />
              <FAQItem 
                question="Can I use it on my phone?"
                answer="Absolutely. Lockin AI is fully responsive and works great on mobile devices, so you can study on the go.The app store version is in production. Click share and add it to your home screen for now!"
              />
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-blue-600 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[120px]" />
             </div>

             <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Stop struggling. Start excelling.</h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">Join 10,000+ students who transformed their grades with Lockin AI. Your future self will thank you.</p>
                <Link to="/login" state={{ isSignUp: true }} className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-10 py-5 rounded-full hover:bg-slate-100 transition-all transform hover:scale-105 shadow-xl">
                    Start Free Today — No Credit Card
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="mt-6 text-sm text-slate-400">Free tier includes 5 daily AI queries. Upgrade anytime.</p>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 mt-10 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span>256-bit Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        <span>Instant Setup</span>
                    </div>
                </div>
             </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// --- Subcomponents ---

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center text-left p-5 focus:outline-none"
      >
        <h3 className="text-lg font-bold text-slate-800">{question}</h3>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
            {answer}
        </div>
      </div>
    </div>
  );
};

const TestimonialCard: React.FC<{ initials: string; name: string; role: string; text: string; delay: number }> = ({ initials, name, role, text, delay }) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
            <div className="flex gap-1 text-yellow-400 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-slate-700 italic mb-6 leading-relaxed">"{text}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">{initials}</div>
                <div>
                    <p className="font-bold text-slate-900 text-sm">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;