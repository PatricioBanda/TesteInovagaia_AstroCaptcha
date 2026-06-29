import React, { useState } from 'react';
import { UserSession } from '../types';

interface AuthViewProps {
  lang: 'en' | 'pt';
  onAuthSuccess: (session: UserSession) => void;
}

export default function AuthView({ lang, onAuthSuccess }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password || (mode === 'register' && !username)) {
      setErrorMessage(lang === 'pt' ? 'Por favor, preencha todos os campos.' : 'Please fill in all fields.');
      return;
    }

    const savedUsersStr = localStorage.getItem('astro_users');
    let users = [];
    if (savedUsersStr) {
      try {
        users = JSON.parse(savedUsersStr);
      } catch (err) {
        users = [];
      }
    }

    // Ensure we have the default voyager user in the DB
    const hasDefault = users.some((u: any) => u.email === 'voyager@starfleet.net');
    if (!hasDefault) {
      users.push({
        email: 'voyager@starfleet.net',
        username: 'Voyager #001',
        userId: '#742',
        password: 'voyager123'
      });
      localStorage.setItem('astro_users', JSON.stringify(users));
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (mode === 'login') {
      const matchedUser = users.find((u: any) => u.email.toLowerCase().trim() === normalizedEmail);
      if (!matchedUser) {
        setErrorMessage(
          lang === 'pt'
            ? '⚠️ DADO NÃO REGISTADO: Canal de dados (Email) não localizado na base estelar.'
            : '⚠️ STREAM NOT FOUND: Data stream (Email) not located in the celestial database.'
        );
        return;
      }

      if (matchedUser.password !== password) {
        setErrorMessage(
          lang === 'pt'
            ? '⚠️ ACESSO NEGADO: Cifra de acesso incorreta. Falha na decodificação do sinal.'
            : '⚠️ ACCESS DENIED: Incorrect access cipher. Failed to decrypt voyager signal.'
        );
        return;
      }

      const session: UserSession = {
        email: matchedUser.email,
        username: matchedUser.username,
        userId: matchedUser.userId,
        authenticated: true,
      };

      onAuthSuccess(session);
    } else {
      // mode === 'register'
      const matchedUser = users.find((u: any) => u.email.toLowerCase().trim() === normalizedEmail);
      if (matchedUser) {
        setErrorMessage(
          lang === 'pt'
            ? '⚠️ DUPLICIDADE DETECTADA: Este email já se encontra em órbita ativa.'
            : '⚠️ DUPLICITY DETECTED: This email is already registered in active orbit.'
        );
        return;
      }

      const newUserId = '#' + Math.floor(Math.random() * 900 + 100).toString();
      const newUser = {
        email: normalizedEmail,
        username: username.trim(),
        userId: newUserId,
        password: password,
      };

      users.push(newUser);
      localStorage.setItem('astro_users', JSON.stringify(users));

      const session: UserSession = {
        email: newUser.email,
        username: newUser.username,
        userId: newUser.userId,
        authenticated: true,
      };

      onAuthSuccess(session);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto py-12 relative">
      {/* Decorative ambient blurred orbs */}
      <div className="absolute -top-12 -left-12 w-[300px] h-[300px] bg-primary-container opacity-10 blur-[80px] pointer-events-none rounded-full"></div>
      <div className="absolute -bottom-12 -right-12 w-[300px] h-[300px] bg-secondary opacity-10 blur-[80px] pointer-events-none rounded-full"></div>

      {/* Main Glass Form Card */}
      <div className="glass-card rounded-2xl p-8 md:p-10 flex flex-col gap-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
        {mode === 'login' ? (
          /* LOGIN SECTION */
          <div className="flex flex-col gap-6" id="login-form-container">
            <header className="text-center flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <span className="material-symbols-outlined text-[28px]">explore</span>
                <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                  AstroCAPTCHA
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold text-text-primary">
                {lang === 'pt' ? 'Bem-vindo, Viajante' : 'Welcome Back, Voyager'}
              </h1>
              <p className="text-sm text-text-secondary">
                {lang === 'pt' ? 'Autentique o seu terminal para continuar.' : 'Authenticate your terminal to continue.'}
              </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errorMessage && (
                <div className="text-xs text-error bg-error-container/10 border border-error/20 p-3 rounded-lg text-center animate-pulse">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  {lang === 'pt' ? 'Fluxo de Dados (Email)' : 'Data Stream (Email)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass font-sans text-sm px-4 py-3 rounded-t-lg w-full focus:ring-0"
                  placeholder="voyager@starfleet.net"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">key</span>
                  {lang === 'pt' ? 'Cifra de Acesso (Senha)' : 'Access Cipher (Password)'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass font-sans text-sm px-4 py-3 rounded-t-lg w-full focus:ring-0"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="text-[11px] font-mono text-tertiary/70 text-center leading-relaxed">
                {lang === 'pt'
                  ? 'DICA: Usuário padrão é voyager@starfleet.net com senha voyager123'
                  : 'HINT: Default user is voyager@starfleet.net with password voyager123'}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-primary-glow w-full py-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(173,198,255,0.2)]"
                >
                  <span>{lang === 'pt' ? 'Sequência de Entrada' : 'Login Sequence'}</span>
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                </button>
              </div>
            </form>

            <footer className="text-center pt-6 border-t border-white/5">
              <p className="font-sans text-xs text-text-secondary">
                {lang === 'pt' ? 'Não tem coordenadas ativas?' : 'No active coordinates?'}
                <button
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="text-primary hover:text-secondary transition-all font-bold underline underline-offset-4 decoration-white/10 hover:decoration-secondary ml-1.5 cursor-pointer"
                >
                  {lang === 'pt' ? 'Registrar' : 'Register'}
                </button>
              </p>
            </footer>
          </div>
        ) : (
          /* REGISTER SECTION */
          <div className="flex flex-col gap-6" id="register-form-container">
            <header className="text-center flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <span className="material-symbols-outlined text-[28px]">radar</span>
                <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                  AstroCAPTCHA
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold text-text-primary">
                {lang === 'pt' ? 'Junte-se à Missão' : 'Join the Mission'}
              </h1>
              <p className="text-sm text-text-secondary">
                {lang === 'pt' ? 'Inicialize o seu perfil navegacional.' : 'Initialize your navigational profile.'}
              </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errorMessage && (
                <div className="text-xs text-error bg-error-container/10 border border-error/20 p-3 rounded-lg text-center animate-pulse">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  {lang === 'pt' ? 'Sinalizador de Chamada (Username)' : 'Call Sign (Username)'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-glass font-sans text-sm px-4 py-3 rounded-t-lg w-full focus:ring-0"
                  placeholder="StarGazer99"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  {lang === 'pt' ? 'Fluxo de Dados (Email)' : 'Data Stream (Email)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass font-sans text-sm px-4 py-3 rounded-t-lg w-full focus:ring-0"
                  placeholder="voyager@starfleet.net"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">key</span>
                  {lang === 'pt' ? 'Cifra de Acesso (Senha)' : 'Access Cipher (Password)'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass font-sans text-sm px-4 py-3 rounded-t-lg w-full focus:ring-0"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-primary-glow w-full py-4 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(173,198,255,0.2)]"
                >
                  <span>{lang === 'pt' ? 'Inicializar Conta' : 'Initialize Account'}</span>
                  <span className="material-symbols-outlined text-[18px]">add_task</span>
                </button>
              </div>
            </form>

            <footer className="text-center pt-6 border-t border-white/5">
              <p className="font-sans text-xs text-text-secondary">
                {lang === 'pt' ? 'Coordenadas já estabelecidas?' : 'Coordinates already established?'}
                <button
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-primary hover:text-secondary transition-all font-bold underline underline-offset-4 decoration-white/10 hover:decoration-secondary ml-1.5 cursor-pointer"
                >
                  {lang === 'pt' ? 'Aceder' : 'Login'}
                </button>
              </p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
