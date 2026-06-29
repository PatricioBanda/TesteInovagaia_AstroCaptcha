export interface Star {
  id: string;
  name: string;
  x: number;
  y: number;
  magnitude?: number;
  color?: string;
}

export interface PublicChallenge {
  id: string;
  name: string;
  stars: Star[];
  difficulty: 'easy' | 'medium' | 'hard';
  hintPt: string;
  hintEn: string;
  previewEdges?: [string, string][];
}


export interface Constellation {
  id: string;
  name: string;
  stars: Star[];
  connections: [string, string][];
  hintPt: string;
  hintEn: string;
  insightStatic: string;
}
export interface PrivateChallenge extends PublicChallenge {
  solutionEdges: [string, string][];
  successFeedbackPt: string;
  successFeedbackEn: string;
}

export type ViewState = 'landing' | 'auth' | 'challenge' | 'success';

export interface UserSession {
  email: string;
  username: string;
  userId: string;
  authenticated: boolean;
}

export interface CaptchaSuccessData {
  userId: string;
  username: string;
  constellationName: string;
  timeSpent: number;
  attemptsUsed: number;
  feedback: string;
}

export interface GenerateChallengeResponse {
  sessionId: string;
  expiresAt: string;
  attemptsRemaining: number;
  challenge: PublicChallenge;
}

export interface VerifyChallengeResponse {
  success: boolean;
  status: 'pending' | 'failed' | 'success' | 'expired';
  attemptsRemaining: number;
  hint?: string;
  feedback?: string;
  timeSpent?: number;
}

export interface InsightResponse {
  insight: string;
  source: 'gemini' | 'local';
}



