export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface BattlecardData {
  howToWin: string[];
  commonObjections: string[];
  discoveryQuestions: string[];
}

export interface FeatureGap {
  feature: string;
  status: 'available' | 'limited' | 'missing';
  description: string;
}

export interface SentimentAnalysis {
  category: string;
  score: number; // 0 to 100
  gripes: string[];
}

export interface MapLocation {
  title: string;
  uri: string;
}

export interface AuditResult {
  id: string;
  domain: string;
  companyName: string;
  industry: string;
  summary: string;
  techStack: string[];
  swot: SWOTData;
  battlecard: BattlecardData;
  featureGap: FeatureGap[];
  sentiment: SentimentAnalysis[];
  timestamp: string;
  sourceUrls?: string[];
  visualUrl?: string; 
  videoUrl?: string;
  audioUrl?: string; // New: TTS narrated briefing
  marketPresence?: MapLocation[]; // New: Google Maps grounding data
}

export enum AppView {
  DASHBOARD = 'dashboard',
  NEW_AUDIT = 'new_audit',
  AUDIT_DETAIL = 'audit_detail'
}