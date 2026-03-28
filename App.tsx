/**
 * HormoFit Main Application Component
 * Orchestrates the landing, onboarding, and dashboard views.
 */

import React, { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { Onboarding } from './components/Onboarding';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Tracker } from './components/Tracker';
import { Nutrition } from './components/Nutrition';
import { MentalHealth } from './components/MentalHealth';
import { Community } from './components/Community';
import { Settings } from './components/Settings';
import { updateHealthState, HealthState, HealthMetrics } from './lib/healthEngine';
import { getRecommendations, Recommendation } from './lib/recommendationEngine';
import { generatePredictions, PredictionPoint } from './lib/predictionEngine';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, doc, getDoc, setDoc, onSnapshot, FirebaseUser, handleFirestoreError, OperationType } from './firebase';
import { AlertCircle } from 'lucide-react';

type AppView = 'landing' | 'onboarding' | 'app' | 'loading';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        errorMessage = `Firestore Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path}`;
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-rose-50/30">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-rose-100 max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-rose-950">Application Error</h2>
            <p className="text-rose-600/70 text-sm leading-relaxed">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [view, setView] = useState<AppView>('loading');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  
  // App State
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [healthState, setHealthState] = useState<HealthState | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [predictions, setPredictions] = useState<PredictionPoint[]>([]);

  // Auth Listener
  useEffect(() => {
    console.log('Auth listener initialized');
    
    // Safety timeout: if auth doesn't respond in 8 seconds, show landing
    const timeoutId = setTimeout(() => {
      if (view === 'loading') {
        console.warn('Auth listener timed out, forcing landing view');
        setView('landing');
      }
    }, 8000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeoutId);
      console.log('Auth state changed:', firebaseUser ? `User: ${firebaseUser.uid}` : 'No user');
      if (firebaseUser) {
        setUser(firebaseUser);
        // Check if user has a profile
        try {
          console.log('Fetching user profile for:', firebaseUser.uid);
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          console.log('User profile exists:', userDoc.exists());
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const initialMetrics: HealthMetrics = {
              weight: userData.weight,
              height: userData.height,
              sugarIntake: userData.diet,
              exerciseLevel: userData.exercise,
              stressLevel: 5,
              cycleDeviation: userData.cycleRegularity === 'irregular' ? 10 : 0,
              sleepHours: 7,
              symptoms: userData.symptoms || [],
            };
            setMetrics(initialMetrics);
            setView('app');
          } else {
            console.log('No profile found, redirecting to onboarding');
            setView('onboarding');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If it's a permission error, it might be handled by ErrorBoundary
          // but we should still set a view to avoid blank screen
          setView('landing');
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        console.log('No user, redirecting to landing');
        setUser(null);
        setView('landing');
      }
    });
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // Data Listeners
  useEffect(() => {
    if (!user || view !== 'app') return;

    const healthRef = doc(db, 'users', user.uid, 'health', 'current');

    const unsubscribeHealth = onSnapshot(healthRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const state: HealthState = {
          bmi: data.bmi,
          insulinResistanceScore: data.insulinScore || 0,
          cycleRegularityScore: data.cycleScore || 0,
          stressScore: data.stressScore || 0,
          inflammationIndex: data.inflammationIndex || 0,
          adherenceScore: data.adherenceScore || 0,
          hormonalStabilityScore: data.stabilityScore || 0,
          riskLevel: data.riskLevel as any,
        };
        setHealthState(state);
        
        if (metrics) {
          setRecommendations(getRecommendations(state, metrics));
          setPredictions(generatePredictions(state, metrics));
        }
      } else {
        console.warn('Health state document does not exist for user:', user.uid);
        // If profile exists but health state doesn't, we might need to recalculate it
        if (metrics) {
          const state = updateHealthState(metrics);
          setHealthState(state);
          setRecommendations(getRecommendations(state, metrics));
          setPredictions(generatePredictions(state, metrics));
        }
      }
    }, (error) => {
      console.error('Snapshot error:', error);
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/health/current`);
    });

    return () => {
      unsubscribeHealth();
    };
  }, [user, view, metrics]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleOnboardingComplete = async (data: any) => {
    if (!user) return;

    const initialMetrics: HealthMetrics = {
      weight: data.weight,
      height: data.height,
      sugarIntake: data.diet as any,
      exerciseLevel: data.exercise as any,
      stressLevel: 5,
      cycleDeviation: data.cycleRegularity === 'irregular' ? 10 : 0,
      sleepHours: 7,
      symptoms: data.symptoms,
    };

    const state = updateHealthState(initialMetrics);

    try {
      // Save User Profile
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'User',
        email: user.email,
        age: data.age,
        height: data.height,
        weight: data.weight,
        cycleRegularity: data.cycleRegularity,
        symptoms: data.symptoms,
        exercise: data.exercise,
        diet: data.diet,
        role: 'user',
        createdAt: new Date().toISOString(),
      });

      // Save Health State
      await setDoc(doc(db, 'users', user.uid, 'health', 'current'), {
        userId: user.uid,
        bmi: state.bmi,
        insulinScore: state.insulinResistanceScore,
        cycleScore: state.cycleRegularityScore,
        stressScore: state.stressScore,
        inflammationIndex: state.inflammationIndex,
        adherenceScore: state.adherenceScore,
        stabilityScore: state.hormonalStabilityScore,
        riskLevel: state.riskLevel,
        lastUpdated: new Date().toISOString(),
      });

      setMetrics(initialMetrics);
      setHealthState(state);
      setRecommendations(getRecommendations(state, initialMetrics));
      setPredictions(generatePredictions(state, initialMetrics));
      setView('app');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('landing');
      setMetrics(null);
      setHealthState(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-rose-50/30 font-sans selection:bg-rose-100 selection:text-rose-900">
        {view === 'loading' && (
          <div className="min-h-screen flex items-center justify-center flex-col gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
            <p className="text-rose-600/60 font-medium animate-pulse">Initializing HormoFit...</p>
          </div>
        )}

        {view === 'landing' && <Landing onStart={handleLogin} />}
        
        {view === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
        
        {view === 'app' && (
          <Layout 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={handleLogout}
            userName={user?.displayName}
          >
            {activeTab === 'dashboard' && (
              healthState && metrics ? (
                <Dashboard 
                  state={healthState} 
                  metrics={metrics} 
                  recommendations={recommendations} 
                  predictions={predictions} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-600"></div>
                  <p className="text-rose-600/60 font-medium">Syncing health data...</p>
                </div>
              )
            )}
            {activeTab === 'tracker' && <Tracker />}
            {activeTab === 'nutrition' && <Nutrition />}
            {activeTab === 'mental' && <MentalHealth />}
            {activeTab === 'community' && <Community />}
            {activeTab === 'settings' && <Settings userName={user?.displayName} userEmail={user?.email} />}
          </Layout>
        )}
      </div>
    </ErrorBoundary>
  );
}
