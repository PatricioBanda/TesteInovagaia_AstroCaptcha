import React from 'react';
import { UserSession } from '../types';

interface TopNavBarProps {
  user: UserSession | null;
  lang: 'en' | 'pt';
  setLang: (l: 'en' | 'pt') => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onHomeClick: () => void;
}

export default function TopNavBar({
  user,
  lang,
  setLang,
  onLoginClick,
  onLogoutClick,
  onHomeClick,
}: TopNavBarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#050816]/40 backdrop-blur-lg border-b border-white/5 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={onHomeClick}
          className="flex items-center gap-2 rounded-xl px-2 py-1 -ml-2 transition-all hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={lang === 'pt' ? 'Voltar a pagina inicial' : 'Back to home page'}
        >
          <span className="material-symbols-outlined text-tertiary text-2xl animate-pulse">
            language
          </span>
          <span className="font-display text-xl font-bold text-primary tracking-tight">
            AstroCAPTCHA
          </span>
        </button>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-6">
          {/* Language Toggle */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                lang === 'en'
                  ? 'bg-primary text-on-primary font-bold shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('pt')}
              className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                lang === 'pt'
                  ? 'bg-primary text-on-primary font-bold shadow-md'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              PT
            </button>
          </div>

          {/* User Sign / Auth Actions */}
          {user && user.authenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
                  {lang === 'pt' ? 'Sinalizador' : 'Call Sign'}
                </span>
                <span className="font-sans text-sm text-text-primary font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success inline-block animate-pulse"></span>
                  {user.username}
                </span>
              </div>
              <button
                onClick={onLogoutClick}
                className="bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 transition-all px-4 py-2 rounded-full font-sans text-xs flex items-center gap-1.5"
                id="logout-btn"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                {lang === 'pt' ? 'Sair' : 'Logout'}
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all px-4 py-2 rounded-full font-sans text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(173,198,255,0.1)]"
              id="login-btn"
            >
              {lang === 'pt' ? 'Entrar' : 'Sign In'}
              <span className="material-symbols-outlined text-[16px]">login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}



