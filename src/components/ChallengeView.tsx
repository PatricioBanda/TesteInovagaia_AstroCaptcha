import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CaptchaSuccessData,
  GenerateChallengeResponse,
  PublicChallenge,
  UserSession,
  VerifyChallengeResponse
} from '../types';

const MEMORIZE_SECONDS = 5;

interface ChallengeViewProps {
  user: UserSession;
  lang: 'en' | 'pt';
  onLogout: () => void;
  onSuccess: (data: Omit<CaptchaSuccessData, 'userId' | 'username'>) => void;
}

export default function ChallengeView({ user, lang, onLogout, onSuccess }: ChallengeViewProps) {
  const [challenge, setChallenge] = useState<PublicChallenge | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [drawnLines, setDrawnLines] = useState<[string, string][]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [memorizeRemaining, setMemorizeRemaining] = useState(MEMORIZE_SECONDS);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [status, setStatus] = useState<'loading' | 'memorize' | 'idle' | 'checking' | 'failed' | 'expired' | 'locked'>('loading');
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expiresAtRef = useRef<number>(0);

  const generateChallenge = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setHint(null);
    setDrawnLines([]);
    setActiveNode(null);

    try {
      const res = await fetch('/api/captcha/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, username: user.username })
      });

      if (!res.ok) throw new Error('Failed to generate challenge');

      const data = (await res.json()) as GenerateChallengeResponse;
      setChallenge(data.challenge);
      setSessionId(data.sessionId);
      setAttemptsRemaining(data.attemptsRemaining);
      expiresAtRef.current = new Date(data.expiresAt).getTime() + MEMORIZE_SECONDS * 1000;
      setTimeRemaining(45);
      setMemorizeRemaining(MEMORIZE_SECONDS);
      setStatus('memorize');
    } catch (err) {
      console.error(err);
      setError(lang === 'pt' ? 'Nao foi possivel gerar o desafio.' : 'Could not generate the challenge.');
      setStatus('locked');
    }
  }, [lang, user.userId, user.username]);

  useEffect(() => {
    generateChallenge();
  }, [generateChallenge]);

  useEffect(() => {
    if (status === 'loading' || status === 'memorize' || status === 'checking' || status === 'expired' || status === 'locked') return;

    const timer = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((expiresAtRef.current - Date.now()) / 1000));
      setTimeRemaining(next);
      if (next <= 0) {
        setStatus('expired');
        setHint(lang === 'pt' ? 'A sessao expirou. Gera um novo desafio.' : 'The session expired. Generate a new challenge.');
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [lang, status]);

  useEffect(() => {
    if (status !== 'memorize') return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, MEMORIZE_SECONDS - elapsedSeconds);
      setMemorizeRemaining(remaining);

      if (remaining <= 0) {
        window.clearInterval(timer);
        setDrawnLines([]);
        setActiveNode(null);
        setHint(lang === 'pt' ? 'Agora replica a constelacao de memoria.' : 'Now reproduce the constellation from memory.');
        setStatus('idle');
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [lang, status]);

  const resetDrawing = () => {
    setDrawnLines([]);
    setActiveNode(null);
    setHint(null);
    setError(null);
    if (status === 'failed') setStatus('idle');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !activeNode) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const handleNodeClick = (starId: string) => {
    if (!challenge || status === 'memorize' || status === 'checking' || status === 'expired' || status === 'locked') return;
    if (status === 'failed') setStatus('idle');

    if (!activeNode) {
      setActiveNode(starId);
      return;
    }

    if (activeNode === starId) {
      setActiveNode(null);
      return;
    }

    const pair = [activeNode, starId].sort() as [string, string];
    const exists = drawnLines.some((line) => line[0] === pair[0] && line[1] === pair[1]);

    if (exists) {
      setDrawnLines((prev) => prev.filter((line) => !(line[0] === pair[0] && line[1] === pair[1])));
    } else {
      setDrawnLines((prev) => [...prev, pair]);
    }

    setActiveNode(null);
  };

  const handleSvgBgClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setActiveNode(null);
  };

  const handleVerify = async () => {
    if (!sessionId || !challenge || drawnLines.length === 0) return;

    setStatus('checking');
    setError(null);

    try {
      const res = await fetch('/api/captcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, submittedEdges: drawnLines, lang })
      });

      const data = (await res.json()) as VerifyChallengeResponse;
      setAttemptsRemaining(data.attemptsRemaining);

      if (data.success) {
        onSuccess({
          constellationName: challenge.name,
          timeSpent: data.timeSpent ?? 45 - timeRemaining,
          attemptsUsed: 3 - data.attemptsRemaining,
          feedback: data.feedback || (lang === 'pt' ? 'Desafio validado com sucesso.' : 'Challenge validated successfully.')
        });
        return;
      }

      setHint(data.hint || (lang === 'pt' ? 'Tenta observar melhor a geometria das estrelas.' : 'Try looking more closely at the star geometry.'));
      setStatus(data.status === 'expired' ? 'expired' : data.status === 'failed' ? 'locked' : 'failed');
    } catch (err) {
      console.error(err);
      setError(lang === 'pt' ? 'Erro ao validar o desafio.' : 'Error validating the challenge.');
      setStatus('idle');
    }
  };

  const activeCoords = activeNode && challenge ? challenge.stars.find((star) => star.id === activeNode) : null;
  const isBlocked = status === 'loading' || status === 'memorize' || status === 'checking' || status === 'expired' || status === 'locked';

  return (
    <div className="w-full max-w-4xl mx-auto py-12 flex flex-col items-center">
      <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
        <div className="text-center space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#262939]/50 border border-white/10 backdrop-blur-sm mb-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">my_location</span>
            <span className="font-mono text-[10px] text-tertiary tracking-widest uppercase font-bold">
              {challenge ? `${lang === 'pt' ? 'ALVO' : 'TARGET'}: ${challenge.name}` : lang === 'pt' ? 'A gerar desafio' : 'Generating challenge'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary leading-snug">
            {status === 'memorize'
              ? lang === 'pt' ? 'Memoriza o modelo da constelacao' : 'Memorize the constellation model'
              : lang === 'pt' ? 'Conecta as estrelas para passar o AstroCAPTCHA' : 'Connect the stars to pass the AstroCAPTCHA'}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            {status === 'memorize'
              ? lang === 'pt' ? `Observa as linhas iluminadas. O modelo desaparece em ${memorizeRemaining}s.` : `Watch the lit lines. The model disappears in ${memorizeRemaining}s.`
              : lang === 'pt' ? 'Agora replica o modelo de memoria. A validacao acontece no servidor.' : 'Now reproduce the model from memory. Validation happens on the server.'}
          </p>
        </div>

        <div className="w-full max-w-[500px] flex justify-between items-center bg-[#262939]/40 backdrop-blur-md border border-white/5 rounded-xl px-6 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={generateChallenge}
              className="material-symbols-outlined text-text-secondary hover:text-text-primary transition-colors hover:rotate-180 duration-500 cursor-pointer text-lg"
              title={lang === 'pt' ? 'Novo desafio' : 'New challenge'}
            >
              replay
            </button>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-text-secondary uppercase tracking-wider leading-none">
                {lang === 'pt' ? 'Tentativas restantes' : 'Attempts remaining'}
              </span>
              <span className="font-display text-base text-primary font-bold">{attemptsRemaining}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="font-mono text-[9px] text-text-secondary uppercase tracking-wider leading-none">
                {lang === 'pt' ? 'Tempo limite' : 'Time limit'}
              </span>
              <span className={`font-mono text-base font-bold tracking-widest ${timeRemaining <= 10 ? 'text-error animate-pulse' : 'text-tertiary'}`}>
                00:{timeRemaining.toString().padStart(2, '0')}
              </span>
            </div>
            <span className={`material-symbols-outlined text-lg ${timeRemaining <= 10 ? 'text-error animate-pulse' : 'text-tertiary'}`}>
              timer
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onClick={handleSvgBgClick}
          className={`relative w-full max-w-[480px] aspect-square bg-[#0a0d1c] border border-white/5 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.6)] group select-none ${isBlocked ? 'cursor-not-allowed opacity-80' : 'cursor-crosshair'}`}
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#adc6ff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <svg className="w-full h-full relative z-10" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100">
            <defs>
              <filter id="svgGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#5516be" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(248, 250, 252, 0.02)" strokeDasharray="1 3" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(248, 250, 252, 0.02)" strokeDasharray="1 3" strokeWidth="0.2" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(248, 250, 252, 0.01)" strokeWidth="0.2" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(248, 250, 252, 0.01)" strokeWidth="0.2" />

            {status === 'memorize' && challenge?.previewEdges?.map((line, idx) => {
              const starA = challenge.stars.find((star) => star.id === line[0]);
              const starB = challenge.stars.find((star) => star.id === line[1]);
              if (!starA || !starB) return null;
              return (
                <line
                  key={`preview-${line[0]}-${line[1]}-${idx}`}
                  x1={starA.x}
                  y1={starA.y}
                  x2={starB.x}
                  y2={starB.y}
                  stroke="#eec200"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  filter="url(#svgGlow)"
                  className="animate-pulse pointer-events-none"
                />
              );
            })}
            {challenge && drawnLines.map((line, idx) => {
              const starA = challenge.stars.find((star) => star.id === line[0]);
              const starB = challenge.stars.find((star) => star.id === line[1]);
              if (!starA || !starB) return null;
              return (
                <line
                  key={`${line[0]}-${line[1]}-${idx}`}
                  x1={starA.x}
                  y1={starA.y}
                  x2={starB.x}
                  y2={starB.y}
                  stroke={status === 'failed' || status === 'locked' ? '#EF4444' : 'url(#lineGrad)'}
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeDasharray={status === 'failed' || status === 'locked' ? '2 1' : undefined}
                  filter="url(#svgGlow)"
                  className="constellation-line cursor-pointer"
                  onClick={() => setDrawnLines((prev) => prev.filter((candidate) => !(candidate[0] === line[0] && candidate[1] === line[1])))}
                />
              );
            })}

            {activeNode && activeCoords && !isBlocked && (
              <line
                x1={activeCoords.x}
                y1={activeCoords.y}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke="rgba(248, 250, 252, 0.4)"
                strokeWidth="0.5"
                strokeDasharray="1.5 1.5"
                strokeLinecap="round"
                className="pointer-events-none"
              />
            )}

            {challenge?.stars.map((star) => {
              const isSelected = activeNode === star.id;
              return (
                <g key={star.id} className={isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'} onClick={() => handleNodeClick(star.id)}>
                  <circle cx={star.x} cy={star.y} r={isSelected ? 4 : 2.5} className="fill-transparent stroke-white/5 opacity-0 group-hover:opacity-100 transition-all hover:stroke-tertiary/40" />
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.magnitude || 1.2}
                    fill={star.color || '#F8FAFC'}
                    filter="url(#svgGlow)"
                    className={`star-point transition-all duration-300 ${isSelected ? 'fill-tertiary stroke-tertiary stroke-[2px] star-pulse' : ''}`}
                    style={{ transformOrigin: `${star.x}px ${star.y}px` }}
                  />
                  <circle cx={star.x} cy={star.y} r="6" fill="transparent" />
                </g>
              );
            })}
          </svg>

          {(status === 'loading' || status === 'checking') && (
            <div className="absolute inset-0 z-20 bg-[#050816]/70 backdrop-blur-sm flex items-center justify-center text-center px-8">
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
                <p className="font-mono text-xs uppercase tracking-widest text-primary">
                  {status === 'loading'
                    ? lang === 'pt' ? 'A gerar desafio seguro' : 'Generating secure challenge'
                    : lang === 'pt' ? 'Validacao no servidor' : 'Server validation'}
                </p>
              </div>
            </div>
          )}


          {status === 'memorize' && (
            <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full border border-tertiary/40 bg-[#050816]/70 px-4 py-2 text-center shadow-[0_0_24px_rgba(238,194,0,0.25)] backdrop-blur-md">
              <div className="font-mono text-[10px] uppercase tracking-widest text-tertiary">
                {lang === 'pt' ? 'Memoriza' : 'Memorize'}
              </div>
              <div className="font-display text-lg font-bold text-text-primary">{memorizeRemaining}s</div>
            </div>
          )}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 rounded-br-2xl" />
        </div>

        {(hint || error) && (
          <div className={`w-full max-w-[480px] glass-panel rounded-xl p-5 flex items-start gap-4 ${error ? 'bg-error-container/10 border-error/30' : 'bg-[#1b1f2e]/50'}`}>
            <div className={`${error ? 'bg-error/10' : 'bg-tertiary/10'} p-2 rounded-full mt-0.5`}>
              <span className={`material-symbols-outlined ${error ? 'text-error' : 'text-tertiary'} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {error ? 'error' : 'lightbulb'}
              </span>
            </div>
            <div>
              <h3 className={`font-mono text-[10px] uppercase tracking-widest font-bold mb-1 ${error ? 'text-error' : 'text-tertiary'}`}>
                {error ? (lang === 'pt' ? 'Erro' : 'Error') : lang === 'pt' ? 'Pista' : 'Hint'}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{error || hint}</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-[480px] flex flex-col sm:flex-row gap-4 justify-center items-center">
          {status === 'expired' || status === 'locked' ? (
            <button
              onClick={generateChallenge}
              className="w-full bg-inverse-primary hover:bg-primary-container text-text-primary px-8 py-4 rounded-xl font-display font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(0,90,194,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>{lang === 'pt' ? 'Gerar novo desafio' : 'Generate new challenge'}</span>
            </button>
          ) : status === 'failed' ? (
            <button
              onClick={resetDrawing}
              className="w-full bg-inverse-primary hover:bg-primary-container text-text-primary px-8 py-4 rounded-xl font-display font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(0,90,194,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>{lang === 'pt' ? 'Tentar novamente' : 'Try again'}</span>
            </button>
          ) : (
            <button
              onClick={handleVerify}
              disabled={drawnLines.length === 0 || status === 'loading' || status === 'checking'}
              className={`w-full py-4 rounded-xl font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all ${drawnLines.length === 0 || status === 'loading' || status === 'checking'
                ? 'bg-white/5 text-text-secondary border border-white/5 cursor-not-allowed opacity-50'
                : 'bg-primary text-on-primary hover:bg-primary-container hover:text-text-primary shadow-[0_0_20px_rgba(173,198,255,0.25)] hover:scale-[1.01] cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{lang === 'pt' ? 'Verificar no servidor' : 'Verify on server'}</span>
            </button>
          )}

          <button
            onClick={onLogout}
            className="w-full sm:w-auto bg-transparent border border-white/10 text-text-primary hover:bg-white/5 transition-all px-8 py-4 rounded-xl font-sans text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>{lang === 'pt' ? 'Sair' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}





