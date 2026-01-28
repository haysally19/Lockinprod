import React, { useState, useEffect, ReactNode, Component, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import AddCourseModal from './components/AddCourseModal';
import { Course, ClassSubject, Note } from './types';
import Dashboard from './components/Dashboard';
import PaywallModal from './components/PaywallModal';
import { Menu } from 'lucide-react';
import Logo from './components/Logo';
import { supabase } from './lib/supabase';
import { db } from './services/db';
import { startCheckout } from './lib/stripe';

const LandingPage = lazy(() => import('./components/LandingPage'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const ClassesOverview = lazy(() => import('./components/ClassesOverview'));
const ClassView = lazy(() => import('./components/ClassView'));
const SettingsView = lazy(() => import('./components/SettingsView'));
const QuickSolve = lazy(() => import('./components/QuickSolve'));

const LoadingSpinner = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Something went wrong.</h2>
          <p className="text-slate-600 mb-6 max-w-md bg-white p-4 rounded-lg border border-slate-200 font-mono text-sm">
            {this.state.error?.message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

const ClassViewWrapper: React.FC<{
  courses: Course[],
  checkTokenLimit: () => boolean,
  incrementTokenUsage: () => void,
  onAddNote: (cid: string, n: any) => Promise<string>,
  onUpdateNote: (n: any) => Promise<void>,
  onDeleteNote: (id: string) => Promise<void>
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  const course = props.courses.find(c => c.id === id);
  if (!course) {
    return <div className="p-8 text-center text-slate-500">Class not found.</div>;
  }
  return (
      <ClassView
          course={course}
          checkTokenLimit={props.checkTokenLimit}
          incrementTokenUsage={props.incrementTokenUsage}
          onAddNote={props.onAddNote}
          onUpdateNote={props.onUpdateNote}
          onDeleteNote={props.onDeleteNote}
      />
  );
};

interface MainLayoutProps {
    courses: Course[];
    onAddCourse: () => void;
    userTier: 'free' | 'pro';
    tierLoaded: boolean;
    userProfile: {
      full_name: string;
      email: string;
      phone: string | null;
    } | null;
    dailyTokens: number;
    bonusCredits: number;
    streak: number;
    subscriptionEndDate: string | null;
    checkCourseLimit: () => boolean;
    checkTokenLimit: () => boolean;
    incrementTokenUsage: () => void;
    onUpgrade: () => void; // Opens modal
    onPaymentAttempt: () => void; // Action inside modal
    onDowngrade: () => void;
    onLogout: () => void;
    isAddModalOpen: boolean;
    setIsAddModalOpen: (val: boolean) => void;
    handleAddCourse: (c: Course) => void;
    handleDeleteCourse: (id: string) => Promise<void>;
    showPaywall: boolean;
    setShowPaywall: (val: boolean) => void;
    paywallReason: 'course_limit' | 'token_limit' | 'upgrade';
    onAddNote: (cid: string, n: any) => Promise<string>,
    onUpdateNote: (n: any) => Promise<void>,
    onDeleteNote: (id: string) => Promise<void>
}

const MainLayout: React.FC<MainLayoutProps> = (props) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden relative" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <Sidebar
            courses={props.courses}
            onAddCourse={props.onAddCourse}
            userTier={props.userTier}
            tierLoaded={props.tierLoaded}
            userProfile={props.userProfile}
            dailyTokens={props.dailyTokens}
            bonusCredits={props.bonusCredits}
            streak={props.streak}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 flex flex-col overflow-hidden h-full shadow-inner relative">
            <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-30" style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-3 -ml-1 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
                >
                    <Menu className="w-7 h-7" />
                </button>
                <div className="w-10">
                    <Logo showText={false} />
                </div>
                <div className="w-10"></div>
            </header>

            <div className="flex-1 overflow-hidden relative">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                  <Route path="/" element={<Dashboard courses={props.courses} streak={props.streak} userTier={props.userTier} tierLoaded={props.tierLoaded} onUpgrade={props.onUpgrade} onAddCourse={props.onAddCourse} />} />
                  <Route path="/quick-solve" element={<QuickSolve checkTokenLimit={props.checkTokenLimit} incrementTokenUsage={props.incrementTokenUsage} onNavigateToDashboard={() => window.location.hash = '#/'} />} />
                  <Route
                      path="/classes"
                      element={
                          <ClassesOverview
                              courses={props.courses}
                              onAddCourse={() => {
                                  if (props.checkCourseLimit()) props.setIsAddModalOpen(true);
                              }}
                              onDeleteCourse={props.handleDeleteCourse}
                          />
                      }
                  />
                  <Route
                      path="/class/:id"
                      element={
                          <ClassViewWrapper
                              courses={props.courses}
                              checkTokenLimit={props.checkTokenLimit}
                              incrementTokenUsage={props.incrementTokenUsage}
                              onAddNote={props.onAddNote}
                              onUpdateNote={props.onUpdateNote}
                              onDeleteNote={props.onDeleteNote}
                          />
                      }
                  />
                  <Route
                      path="/settings"
                      element={
                          <SettingsView
                              userTier={props.userTier}
                              userProfile={props.userProfile}
                              onUpgrade={props.onUpgrade}
                              onDowngrade={props.onDowngrade}
                              onLogout={props.onLogout}
                              dailyTokens={props.dailyTokens}
                              bonusCredits={props.bonusCredits}
                              subscriptionEndDate={props.subscriptionEndDate}
                          />
                      }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Suspense>
            </div>
          </main>
          
          <AddCourseModal 
            isOpen={props.isAddModalOpen} 
            onClose={() => props.setIsAddModalOpen(false)} 
            onAdd={props.handleAddCourse} 
          />
          <PaywallModal 
            isOpen={props.showPaywall} 
            onClose={() => props.setShowPaywall(false)} 
            onUpgrade={props.onPaymentAttempt}
            reason={props.paywallReason}
          />
        </div>
    );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);

  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    email: string;
    phone: string | null;
  } | null>(null);

  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [tierLoaded, setTierLoaded] = useState(false);

  const [dailyTokens, setDailyTokens] = useState<number>(0);
  const [bonusCredits, setBonusCredits] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);

  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<'course_limit' | 'token_limit' | 'upgrade'>('token_limit');

  // Check for successful payment on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
        // Clean URL first
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash.split('?')[0];
        window.history.replaceState({path:newUrl},'',newUrl);

        // Show success message
        alert("Payment successful! Your Pro upgrade is being processed.");

        // Refresh data immediately to get updated tier from database
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
  }, []);

  // Auth & Data Fetching
  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.warn("Session check error:", error);
        setLoading(false);
        return;
      }
      const session = data?.session;
      setIsAuthenticated(!!session);
      if (session) {
          setCurrentUserEmail(session.user.email);
          fetchData();
      } else {
          setLoading(false);
      }
    }).catch(err => {
      console.warn("Failed to check auth session:", err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
          setCurrentUserEmail(session.user.email);
          fetchData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const [coursesResponse, profileResponse, subscriptionResponse] = await Promise.all([
            supabase
                .from('courses')
                .select(`
                    *,
                    notes (*),
                    documents (*)
                `),
            supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle(),
            supabase
                .from('subscriptions')
                .select('current_period_end, status')
                .eq('user_id', user.id)
                .maybeSingle()
        ]);

        if (coursesResponse.error) throw coursesResponse.error;

        const transformedCourses: Course[] = (coursesResponse.data || []).map(c => ({
            id: c.id,
            name: c.name,
            subject: c.subject as ClassSubject,
            color: c.color,
            icon: c.icon || 'book',
            notes: (c.notes || []).map((n: any) => ({
                id: n.id,
                title: n.title,
                content: n.content,
                createdAt: n.created_at
            }))
        }));

        setCourses(transformedCourses);

        // Set subscription end date if available and subscription is active
        if (subscriptionResponse.data && (subscriptionResponse.data.status === 'active' || subscriptionResponse.data.status === 'trialing')) {
            setSubscriptionEndDate(subscriptionResponse.data.current_period_end);
        } else {
            setSubscriptionEndDate(null);
        }

        if (profileResponse.data) {
            setUserProfile({
                full_name: profileResponse.data.full_name,
                email: profileResponse.data.email,
                phone: profileResponse.data.phone
            });

            // Sync tier from database (database is source of truth)
            const dbTier = (profileResponse.data.tier || 'free') as 'free' | 'pro';
            setUserTier(dbTier);
            setTierLoaded(true);

            // Handle daily reset logic
            const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
            const lastVisit = profileResponse.data.last_visit_date;

            if (lastVisit !== today) {
                // New day - reset daily tokens and update streak
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                let newStreak = profileResponse.data.streak || 0;

                if (lastVisit === yesterdayStr) {
                    // Consecutive day - increment streak
                    newStreak = newStreak + 1;
                } else if (lastVisit) {
                    // Missed a day - reset streak
                    newStreak = 1;
                } else {
                    // First visit ever
                    newStreak = 1;
                }

                // Update database with reset values
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        daily_tokens: 0,
                        streak: newStreak,
                        last_visit_date: today
                    })
                    .eq('id', user.id);

                if (updateError) {
                    console.error("Error updating daily reset:", updateError);
                }

                // Update local state
                setDailyTokens(0);
                setStreak(newStreak);
                setBonusCredits(profileResponse.data.bonus_credits || 0);
            } else {
                // Same day - load existing values
                setDailyTokens(profileResponse.data.daily_tokens || 0);
                setBonusCredits(profileResponse.data.bonus_credits || 0);
                setStreak(profileResponse.data.streak || 0);
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
  };

  // --- Database Actions ---

  const handleAddCourse = async (newCourse: Course) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.from('courses').insert({
            name: newCourse.name,
            subject: newCourse.subject,
            color: newCourse.color,
            icon: newCourse.icon,
            user_id: user.id
        }).select().single();

        if (error) throw error;

        const createdCourse: Course = { ...newCourse, id: data.id };
        setCourses([...courses, createdCourse]);
    } catch (e) {
        console.error("Error creating course:", e);
        alert("Failed to create course");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
        await db.deleteCourse(courseId);
        setCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (e) {
        console.error("Error deleting course:", e);
        alert("Failed to delete course");
    }
  };

  const handleAddNote = async (courseId: string, noteData: Omit<Note, 'id'>) => {
      try {
          const newNote = await db.addNote(courseId, noteData);
          setCourses(prev => prev.map(c => 
              c.id === courseId 
                  ? { ...c, notes: [newNote, ...c.notes] }
                  : c
          ));
          return newNote.id;
      } catch (e) { console.error("DB Error", e); return ''; }
  };

  const handleUpdateNote = async (updated: Note) => {
      try {
          await db.updateNote(updated);
          setCourses(prev => prev.map(c => ({
              ...c,
              notes: c.notes.map(n => n.id === updated.id ? updated : n)
          })));
      } catch (e) { console.error("DB Error", e); }
  };

  const handleDeleteNote = async (id: string) => {
      try {
          await db.deleteNote(id);
          setCourses(prev => prev.map(c => ({
              ...c,
              notes: c.notes.filter(n => n.id !== id)
          })));
      } catch (e) { console.error("DB Error", e); }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCourses([]);
  };

  const checkCourseLimit = () => {
      if (!tierLoaded) return true; // Don't block if tier not loaded yet
      if (userTier === 'free' && courses.length >= 1) {
          setPaywallReason('course_limit');
          setShowPaywall(true);
          return false;
      }
      return true;
  };

  const checkTokenLimit = () => {
      if (!tierLoaded) return true; // Don't block if tier not loaded yet
      if (userTier === 'pro') return true;
      if (dailyTokens < 5) return true;
      if (bonusCredits > 0) return true;
      setPaywallReason('token_limit');
      setShowPaywall(true);
      return false;
  };

  const incrementTokenUsage = async () => {
      if (userTier === 'pro') return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (dailyTokens < 5) {
          const newDailyTokens = dailyTokens + 1;
          setDailyTokens(newDailyTokens);

          // Persist to database
          await supabase
              .from('profiles')
              .update({ daily_tokens: newDailyTokens })
              .eq('id', user.id);
      } else if (bonusCredits > 0) {
          const newBonusCredits = bonusCredits - 1;
          setBonusCredits(newBonusCredits);

          // Persist to database
          await supabase
              .from('profiles')
              .update({ bonus_credits: newBonusCredits })
              .eq('id', user.id);
      }
  };

  // Triggered when user clicks "Upgrade" buttons in UI
  const handleUpgradeClick = () => {
      setPaywallReason('upgrade');
      setShowPaywall(true);
  };

  // Triggered when user attempts to pay inside the modal
  const handlePaymentAttempt = async () => {
      try {
          await startCheckout();
      } catch (error) {
          console.error('Checkout error:', error);
      }
  };

  const onDowngrade = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update profiles table
      await supabase
          .from('profiles')
          .update({ tier: 'free' })
          .eq('id', user.id);

      setUserTier('free');
  }
  
  if (loading) {
      return (
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
      )
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {isAuthenticated ? (
            <Route path="/*" element={
                <MainLayout
                    courses={courses}
                    onAddCourse={() => { if (checkCourseLimit()) setIsAddModalOpen(true); }}
                    userTier={userTier}
                    tierLoaded={tierLoaded}
                    userProfile={userProfile}
                    dailyTokens={dailyTokens}
                    bonusCredits={bonusCredits}
                    streak={streak}
                    subscriptionEndDate={subscriptionEndDate}
                    checkCourseLimit={checkCourseLimit}
                    checkTokenLimit={checkTokenLimit}
                    incrementTokenUsage={incrementTokenUsage}
                    onUpgrade={handleUpgradeClick}
                    onPaymentAttempt={handlePaymentAttempt}
                    onDowngrade={onDowngrade}
                    onLogout={handleLogout}
                    isAddModalOpen={isAddModalOpen}
                    setIsAddModalOpen={setIsAddModalOpen}
                    handleAddCourse={handleAddCourse}
                    handleDeleteCourse={handleDeleteCourse}
                    showPaywall={showPaywall}
                    setShowPaywall={setShowPaywall}
                    paywallReason={paywallReason}
                    onAddNote={handleAddNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                />
            } />
          ) : (
            <>
              <Route path="/login" element={<LoginScreen onLogin={handleLogin} initialMode="login" />} />
              <Route path="/signup" element={<LoginScreen onLogin={handleLogin} initialMode="signup" />} />
              <Route path="/privacy" element={<Suspense fallback={<LoadingSpinner />}><PrivacyPolicy /></Suspense>} />
              <Route path="/terms" element={<Suspense fallback={<LoadingSpinner />}><TermsOfService /></Suspense>} />
              <Route path="/" element={<Suspense fallback={<LoadingSpinner />}><LandingPage /></Suspense>} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;