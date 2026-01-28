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
  visualUrl?: string; // New field for AI generated visual
}

export enum AppView {
  DASHBOARD = 'dashboard',
  NEW_AUDIT = 'new_audit',
  AUDIT_DETAIL = 'audit_detail'
}