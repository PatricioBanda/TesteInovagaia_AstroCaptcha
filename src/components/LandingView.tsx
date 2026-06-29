import React, { useEffect, useState } from 'react';
import { UserSession } from '../types';

interface LandingViewProps {
  user: UserSession | null;
  lang: 'en' | 'pt';
  onStartChallenge: () => void;
  onLoginClick: () => void;
  onCreateAccountClick: () => void;
}

interface DemoPoint {
  x: number;
  y: number;
}

export default function LandingView({
  user,
  lang,
  onStartChallenge,
  onLoginClick,
  onCreateAccountClick,
}: LandingViewProps) {
  // Simple automated constellation drawing for the Demo Canvas
  const [demoStep, setDemoStep] = useState(0);
  const demoPoints: DemoPoint[] = [
    { x: 20, y: 30 }, // Segin
    { x: 35, y: 55 }, // Ruchbah
    { x: 50, y: 40 }, // Tsih
    { x: 65, y: 60 }, // Schedar
    { x: 80, y: 35 }, // Caph
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % (demoPoints.length + 2));
    }, 1500);
    return () => clearInterval(timer);
  }, [demoPoints.length]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left column: Copy & CTAs */}
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex self-center lg:self-start items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
            {lang === 'pt' ? 'MÉTODO DE SEGURANÇA CÓSMICO' : 'COSMIC SECURITY PROTOCOL'}
          </div>

          <h1 className="font-display text-5xl sm:text-6xl font-bold text-text-primary tracking-tight leading-tight hero-glow">
            AstroCAPTCHA
          </h1>

          <p className="font-display text-2xl text-primary font-semibold leading-relaxed">
            {lang === 'pt'
              ? 'Valide o seu acesso conectando estrelas e reconhecendo constelações.'
              : 'Validate your access by connecting stars and recognizing constellations.'}
          </p>

          <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            {lang === 'pt'
              ? 'Uma forma revolucionária de provar a sua humanidade através da beleza do cosmos. Educacional, altamente seguro, inspirado na precisão dos mapas estelares.'
              : 'A revolutionary way to prove your humanity through the beauty of the cosmos. Educational, highly secure, and inspired by the precision of ancient star charts.'}
          </p>

          {user && user.authenticated && (
            <div className="glass-panel border-success/20 bg-success/5 rounded-2xl p-6 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-4 relative overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.1)]">
              {/* Highlight background orb */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 blur-[30px] rounded-full pointer-events-none"></div>
              
              <div className="flex flex-col gap-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success inline-block animate-pulse"></span>
                  <span className="font-mono text-xs text-success font-bold uppercase tracking-widest">
                    {lang === 'pt' ? 'VIAJANTE AUTENTICADO' : 'VOYAGER AUTHENTICATED'}
                  </span>
                </div>
                <div className="font-display text-lg text-text-primary font-semibold">
                  {user.username}
                </div>
                <div className="font-mono text-xs text-text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                  <span>{user.email}</span>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end relative z-10">
                <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest">
                  {lang === 'pt' ? 'Nº REGISTO' : 'USER NUMBER'}
                </span>
                <span className="font-display text-4xl sm:text-5xl font-black text-primary tracking-tighter hover:scale-105 transition-transform duration-300">
                  {user.userId}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
            <button
              onClick={onStartChallenge}
              className="px-8 py-4 bg-primary-container text-text-primary hover:bg-primary-container/80 transition-all font-display font-semibold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(77,142,255,0.3)] hover:scale-[1.02] cursor-pointer"
              id="start-challenge-btn"
            >
              <span>{lang === 'pt' ? 'Iniciar Desafio' : 'Launch Challenge'}</span>
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            </button>

            {(!user || !user.authenticated) && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onCreateAccountClick}
                  className="px-8 py-4 glass-panel text-primary hover:bg-white/10 transition-all rounded-xl font-sans font-medium flex items-center justify-center cursor-pointer"
                >
                  {lang === 'pt' ? 'Criar Conta' : 'Create Account'}
                </button>
                <button
                  onClick={onLoginClick}
                  className="px-8 py-4 bg-transparent border border-white/10 text-text-primary hover:bg-white/5 transition-all rounded-xl font-sans font-medium flex items-center justify-center cursor-pointer"
                >
                  {lang === 'pt' ? 'Entrar' : 'Login'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Interactive Demo Starfield */}
        <div className="relative w-full aspect-square max-w-[480px] mx-auto">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-3xl blur-[80px] pointer-events-none"></div>

          <div className="glass-panel w-full h-full rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 rounded-br-2xl"></div>

            {/* Reticle grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(248, 250, 252, 0.03)" strokeWidth="0.15" strokeDasharray="1 2"></circle>
              <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(248, 250, 252, 0.03)" strokeWidth="0.15" strokeDasharray="1 2"></circle>
              <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(248, 250, 252, 0.02)" strokeWidth="0.15"></line>
              <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(248, 250, 252, 0.02)" strokeWidth="0.15"></line>

              {/* Demo Lines Connecting Stars */}
              {demoStep > 0 && (
                <polyline
                  points={demoPoints
                    .slice(0, Math.min(demoStep, demoPoints.length))
                    .map((p) => `${p.x},${p.y}`)
                    .join(' ')}
                  fill="none"
                  stroke="url(#demoGrad)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="constellation-line"
                />
              )}

              {/* Define dynamic gradient in demo */}
              <defs>
                <linearGradient id="demoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#adc6ff" />
                  <stop offset="100%" stopColor="#d0bcff" />
                </linearGradient>
              </defs>

              {/* Star points */}
              {demoPoints.map((point, index) => {
                const isActivated = demoStep > index;
                return (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={isActivated ? 1.4 : 0.9}
                    fill={isActivated ? '#eec200' : 'rgba(248,250,252,0.4)'}
                    className={`transition-all duration-500 ${isActivated ? 'star-pulse' : ''}`}
                    style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                  />
                );
              })}
            </svg>

            {/* Simulated background dust */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#adc6ff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>

            <div className="z-10 font-mono text-xs text-text-secondary uppercase tracking-widest">
              {lang === 'pt' ? 'REDUÇÃO DE RETÍCULO' : 'RETICLE COMPLIANCE'}
            </div>

            <div className="z-10 flex justify-between items-end">
              <div>
                <div className="font-display font-bold text-text-primary text-lg">Cassiopeia</div>
                <div className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">
                  {lang === 'pt' ? 'Mapeamento Demo' : 'Demo Mapping'}
                </div>
              </div>
              <div className="font-mono text-xs text-tertiary bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                DEMO MODE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: How It Works */}
      <section className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary">
            {lang === 'pt' ? 'Como Funciona' : 'How It Works'}
          </h2>
          <p className="text-text-secondary mt-2">
            {lang === 'pt'
              ? 'Uma sequência simples de três etapas para validar sua identidade.'
              : 'A simple three-step astronomical sequence to validate your digital terminal.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Authenticate */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col gap-4 items-center text-center hover:bg-white/5 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(77,142,255,0.15)]">
              <span className="material-symbols-outlined text-[32px]">shield_person</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-primary">
              {lang === 'pt' ? '1. Autenticar' : '1. Authenticate'}
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {lang === 'pt'
                ? 'Inicie o processo de verificação no seu terminal espacial para provar que é humano de forma segura.'
                : 'Initiate the verification protocol on your secure terminal to safely prove your human identity.'}
            </p>
          </div>

          {/* Card 2: Connect Stars */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col gap-4 items-center text-center hover:bg-white/5 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(238,194,0,0.15)]">
              <span className="material-symbols-outlined text-[32px]">polyline</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-primary">
              {lang === 'pt' ? '2. Ligar Estrelas' : '2. Connect Stars'}
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {lang === 'pt'
                ? 'Desenhe segmentos entre os corpos celestes brilhantes reproduzindo a constelação solicitada.'
                : 'Draw segments between the glowing celestial bodies to match the structural shape of the target constellation.'}
            </p>
          </div>

          {/* Card 3: Explore */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col gap-4 items-center text-center hover:bg-white/5 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-16 h-16 rounded-full bg-secondary-container/10 border border-secondary-container/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(87,27,193,0.15)]">
              <span className="material-symbols-outlined text-[32px]">explore</span>
            </div>
            <h3 className="font-display text-xl font-semibold text-primary">
              {lang === 'pt' ? '3. Explorar' : '3. Explore'}
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {lang === 'pt'
                ? 'Conquiste acessos enquanto aprende sobre constelações reais do nosso universo.'
                : 'Gain access codes while learning astronomical facts and stellar histories of our cosmic skies.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
