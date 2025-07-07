export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  culturalBackground: string;
  workHours: string;
  sleepSchedule: string;
}

export interface DailyAssessment {
  id: string;
  userId: string;
  date: string;
  stressLevel: number; // 1-10
  moodLevel: number; // 1-10
  sleepHours: number;
  workHours: number;
  exerciseMinutes: number;
  socialInteraction: number; // 1-10
  screenTime: number;
  caffeine: number;
  alcohol: number;
  symptoms: string[];
  notes: string;
  createdAt: Date;
}

export interface StressPattern {
  id: string;
  userId: string;
  patternType: 'weekly' | 'monthly' | 'seasonal';
  triggers: string[];
  intensity: number;
  frequency: number;
  duration: number;
  detectedAt: Date;
}

export interface Intervention {
  id: string;
  type: 'breathing' | 'meditation' | 'exercise' | 'social' | 'professional';
  title: string;
  description: string;
  duration: number;
  effectiveness: number;
  culturallyAdapted: boolean;
  instructions: string[];
  resources: string[];
}

export interface RiskAssessment {
  id: string;
  userId: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  factors: string[];
  score: number;
  recommendations: string[];
  needsProfessionalHelp: boolean;
  assessedAt: Date;
}

export interface ProgressMetrics {
  stressTrend: number;
  moodTrend: number;
  sleepQuality: number;
  interventionSuccess: number;
  overallWellness: number;
}