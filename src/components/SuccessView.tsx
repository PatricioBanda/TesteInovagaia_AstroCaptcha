import React from 'react';
import { CaptchaSuccessData } from '../types';

interface SuccessViewProps {
  lang: 'en' | 'pt';
  data: CaptchaSuccessData;
  onNewChallenge: () => void;
  onLogout: () => void;
}

export default function SuccessView({ lang, data, onNewChallenge, onLogout }: SuccessViewProps) {
  return (
    <main className="w-full max-w-[820px] flex flex-col items-center animate-fade-in">
      <div className="w-full bg-white/[0.03] backdrop-blur-[16px] border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center success-glow relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-success/10 blur-[40px] rounded-full pointer-events-none" />

        <div className="mb-8 flex flex-col items-center">
          <span className="material-symbols-outlined text-[72px] text-success mb-6 icon-glow" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-4 tracking-tight leading-tight">
            {lang === 'pt' ? 'Validacao concluida' : 'Validation complete'}
          </h1>
          <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-lg mx-auto">
            {lang === 'pt'
              ? 'Parabens! Validaste com sucesso o desafio AstroCAPTCHA.'
              : 'Congratulations! You successfully validated the AstroCAPTCHA challenge.'}
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1b1f2e]/40 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-text-secondary mb-2 text-[24px]">fingerprint</span>
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1">
              {lang === 'pt' ? 'Registo publico' : 'Public reg'}
            </span>
            <span className="font-mono text-xl text-text-primary font-bold">{data.userId}</span>
          </div>

          <div className="bg-[#1b1f2e]/40 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-tertiary mb-2 text-[24px]">auto_awesome</span>
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1">
              {lang === 'pt' ? 'Constelacao' : 'Constellation'}
            </span>
            <span className="font-display text-xl text-text-primary font-bold">{data.constellationName}</span>
          </div>

          <div className="bg-[#1b1f2e]/40 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-text-secondary mb-2 text-[24px]">timer</span>
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1">
              {lang === 'pt' ? 'Tempo' : 'Time'}
            </span>
            <span className="font-mono text-xl text-text-primary font-bold">{data.timeSpent}s</span>
          </div>

          <div className="bg-[#1b1f2e]/40 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-success mb-2 text-[24px]">fact_check</span>
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1">
              {lang === 'pt' ? 'Tentativas' : 'Attempts'}
            </span>
            <span className="font-mono text-xl text-success font-bold">{data.attemptsUsed}</span>
          </div>
        </div>

        <div className="w-full bg-[#005ac2]/10 border border-[#adc6ff]/20 rounded-xl p-6 mb-10 flex flex-col sm:flex-row gap-4 items-start text-left">
          <div className="flex-shrink-0 bg-primary/20 p-3 rounded-full">
            <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              lightbulb
            </span>
          </div>
          <div>
            <h3 className="font-sans text-xs font-semibold text-primary uppercase tracking-wide mb-1">
              {lang === 'pt' ? 'Feedback educativo' : 'Educational feedback'}
            </h3>
            <p className="text-sm text-on-surface leading-relaxed mt-1">{data.feedback}</p>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onNewChallenge}
            className="w-full sm:w-auto bg-primary-container text-text-primary hover:bg-primary-container/80 transition-all px-8 py-4 rounded-xl font-sans text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(77,142,255,0.3)] hover:scale-[1.02]"
          >
            <span>{lang === 'pt' ? 'Tentar novo desafio' : 'Try new challenge'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full sm:w-auto bg-transparent border border-white/10 text-text-primary hover:bg-white/5 transition-all px-8 py-4 rounded-xl font-sans text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>{lang === 'pt' ? 'Sair' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </main>
  );
}
