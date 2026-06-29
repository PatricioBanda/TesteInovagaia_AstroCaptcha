import React, { useState } from 'react';
import TopNavBar from './components/TopNavBar';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import ChallengeView from './components/ChallengeView';
import SuccessView from './components/SuccessView';
import { CaptchaSuccessData, UserSession, ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [lang, setLang] = useState<'en' | 'pt'>('en');
  const [successData, setSuccessData] = useState<CaptchaSuccessData | null>(null);
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('astro_current_user');
    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const handleAuthSuccess = (session: UserSession) => {
    setUser(session);
    setSuccessData(null);
    localStorage.setItem('astro_current_user', JSON.stringify(session));
    setView('challenge');
  };

  const handleStartChallenge = () => {
    setSuccessData(null);
    setView(user?.authenticated ? 'challenge' : 'auth');
  };

  const handleCaptchaSuccess = (data: Omit<CaptchaSuccessData, 'userId' | 'username'>) => {
    if (!user) return;

    setSuccessData({
      ...data,
      userId: user.userId,
      username: user.username
    });
    setView('success');
  };

  const handleLogout = () => {
    setUser(null);
    setSuccessData(null);
    localStorage.removeItem('astro_current_user');
    setView('landing');
  };

  return (
    <div className="relative min-h-screen bg-background text-text-primary overflow-x-hidden font-sans">
      <div className="fixed inset-0 starfield z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-space-dust z-0 pointer-events-none" />

      <TopNavBar
        user={user}
        lang={lang}
        setLang={setLang}
        onLoginClick={() => setView('auth')}
        onLogoutClick={handleLogout}
        onHomeClick={() => setView('landing')}
      />

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {view === 'landing' && (
          <LandingView
            user={user}
            lang={lang}
            onStartChallenge={handleStartChallenge}
            onLoginClick={() => setView('auth')}
            onCreateAccountClick={() => setView('auth')}
          />
        )}

        {view === 'auth' && <AuthView lang={lang} onAuthSuccess={handleAuthSuccess} />}

        {view === 'challenge' && user && (
          <ChallengeView
            user={user}
            lang={lang}
            onLogout={handleLogout}
            onSuccess={handleCaptchaSuccess}
          />
        )}

        {view === 'success' && user && successData && (
          <SuccessView
            lang={lang}
            data={successData}
            onNewChallenge={handleStartChallenge}
            onLogout={handleLogout}
          />
        )}
      </main>

      <footer className="relative z-10 w-full bg-[#050816]/60 border-t border-white/5 py-8 text-center text-xs text-text-secondary select-none">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" />
            <span>CAPTCHA_POC_ONLINE // SERVER_VALIDATED</span>
          </div>
          <p>AstroCAPTCHA Proof of Concept</p>
          <div className="font-mono text-[10px] tracking-wider uppercase text-primary">
            Landing / Auth / Challenge / Success
          </div>
        </div>
      </footer>
    </div>
  );
}


