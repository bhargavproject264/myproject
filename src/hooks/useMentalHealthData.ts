import { useState, useEffect } from 'react';
import { DailyAssessment, StressPattern, RiskAssessment, Intervention, ProgressMetrics } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { mlEngine } from '../lib/ml-engine';

export function useMentalHealthData() {
  const [assessments, setAssessments] = useLocalStorage<DailyAssessment[]>('mental-health-assessments', []);
  const [patterns, setPatterns] = useLocalStorage<StressPattern[]>('stress-patterns', []);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [interventions] = useState<Intervention[]>([
    {
      id: 'breathing-1',
      type: 'breathing',
      title: '4-7-8 Breathing Technique',
      description: 'A simple breathing exercise to reduce stress and anxiety',
      duration: 5,
      effectiveness: 0.85,
      culturallyAdapted: true,
      instructions: [
        'Inhale for 4 counts',
        'Hold for 7 counts',
        'Exhale for 8 counts',
        'Repeat 4-6 times'
      ],
      resources: ['https://www.healthline.com/health/4-7-8-breathing']
    },
    {
      id: 'meditation-1',
      type: 'meditation',
      title: 'Mindfulness Meditation',
      description: 'Basic mindfulness practice for stress reduction',
      duration: 10,
      effectiveness: 0.78,
      culturallyAdapted: true,
      instructions: [
        'Find a quiet space',
        'Sit comfortably',
        'Focus on your breath',
        'Notice thoughts without judgment',
        'Return focus to breath'
      ],
      resources: ['https://www.headspace.com/meditation/mindfulness']
    },
    {
      id: 'exercise-1',
      type: 'exercise',
      title: 'Quick Stress-Relief Walk',
      description: 'A brief walk to clear your mind and reduce tension',
      duration: 15,
      effectiveness: 0.72,
      culturallyAdapted: true,
      instructions: [
        'Step outside if possible',
        'Walk at a comfortable pace',
        'Focus on your surroundings',
        'Take deep breaths',
        'Notice how you feel'
      ],
      resources: ['https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/exercise-and-stress/art-20044469']
    },
    {
      id: 'social-1',
      type: 'social',
      title: 'Connect with a Friend',
      description: 'Reach out to someone you trust for support',
      duration: 20,
      effectiveness: 0.68,
      culturallyAdapted: true,
      instructions: [
        'Choose someone you feel comfortable with',
        'Share how you are feeling',
        'Listen actively',
        'Ask for specific support if needed'
      ],
      resources: ['https://www.mentalhealth.gov/get-help/immediate-help']
    }
  ]);

  const addAssessment = (assessment: Omit<DailyAssessment, 'id' | 'userId' | 'createdAt'>) => {
    const newAssessment: DailyAssessment = {
      ...assessment,
      id: `assessment-${Date.now()}`,
      userId: 'current-user',
      createdAt: new Date()
    };
    setAssessments(prev => [...prev, newAssessment]);
  };

  const calculateProgressMetrics = (): ProgressMetrics => {
    if (assessments.length === 0) {
      return {
        stressTrend: 0,
        moodTrend: 0,
        sleepQuality: 0,
        interventionSuccess: 0,
        overallWellness: 0
      };
    }

    const recentAssessments = assessments.slice(-14);
    const olderAssessments = assessments.slice(-28, -14);

    const calculateAverage = (items: DailyAssessment[], field: keyof DailyAssessment) => {
      if (items.length === 0) return 0;
      return items.reduce((sum, item) => sum + (item[field] as number), 0) / items.length;
    };

    const recentStress = calculateAverage(recentAssessments, 'stressLevel');
    const olderStress = calculateAverage(olderAssessments, 'stressLevel');
    const stressTrend = olderStress - recentStress; 

    const recentMood = calculateAverage(recentAssessments, 'moodLevel');
    const olderMood = calculateAverage(olderAssessments, 'moodLevel');
    const moodTrend = recentMood - olderMood; 

    const sleepQuality = calculateAverage(recentAssessments, 'sleepHours') / 10; 
    const interventionSuccess = 0.75; 

    
    const overallWellness = Math.max(0, Math.min(100, 
      ((10 - recentStress) / 10 * 30) + 
      (recentMood / 10 * 30) + 
      (sleepQuality * 25) + 
      (interventionSuccess * 15) 
    ));

    return {
      stressTrend,
      moodTrend,
      sleepQuality,
      interventionSuccess,
      overallWellness
    };
  };

  
  useEffect(() => {
    if (assessments.length > 0) {
      const newPatterns = mlEngine.analyzeMoodPatterns(assessments);
      setPatterns(newPatterns);
      
      const newRiskAssessment = mlEngine.assessRisk(assessments, newPatterns);
      setRiskAssessment(newRiskAssessment);
    }
  }, [assessments, setPatterns]);

  const progressMetrics = calculateProgressMetrics();

  return {
    assessments,
    patterns,
    riskAssessment,
    interventions,
    progressMetrics,
    addAssessment
  };
}