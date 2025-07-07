import { DailyAssessment, StressPattern, RiskAssessment } from '../types';

export class MentalHealthMLEngine {
  // Simple stress prediction based on lifestyle factors
  predictStressLevel(assessment: Partial<DailyAssessment>): number {
    let stressScore = 0;
    
    // Sleep factor (0-40 points)
    const sleepHours = assessment.sleepHours || 8;
    if (sleepHours < 6) stressScore += 40;
    else if (sleepHours < 7) stressScore += 25;
    else if (sleepHours > 9) stressScore += 15;
    
    // Work hours factor (0-30 points)
    const workHours = assessment.workHours || 8;
    if (workHours > 10) stressScore += 30;
    else if (workHours > 9) stressScore += 20;
    else if (workHours > 8) stressScore += 10;
    
    // Exercise factor (0-20 points)
    const exerciseMinutes = assessment.exerciseMinutes || 0;
    if (exerciseMinutes === 0) stressScore += 20;
    else if (exerciseMinutes < 30) stressScore += 10;
    
    // Social interaction factor (0-25 points)
    const socialScore = assessment.socialInteraction || 5;
    if (socialScore < 3) stressScore += 25;
    else if (socialScore < 5) stressScore += 15;
    
    // Screen time factor (0-15 points)
    const screenTime = assessment.screenTime || 4;
    if (screenTime > 8) stressScore += 15;
    else if (screenTime > 6) stressScore += 10;
    
    // Caffeine factor (0-10 points)
    const caffeine = assessment.caffeine || 1;
    if (caffeine > 3) stressScore += 10;
    else if (caffeine > 2) stressScore += 5;
    
    // Alcohol factor (0-10 points)
    const alcohol = assessment.alcohol || 0;
    if (alcohol > 2) stressScore += 10;
    else if (alcohol > 1) stressScore += 5;
    
    // Convert to 1-10 scale
    return Math.min(Math.max(Math.round(stressScore / 15), 1), 10);
  }

  // Analyze mood patterns over time
  analyzeMoodPatterns(assessments: DailyAssessment[]): StressPattern[] {
    const patterns: StressPattern[] = [];
    
    if (assessments.length < 7) return patterns;
    
    // Weekly pattern analysis
    const weeklyData = this.groupByWeek(assessments);
    const weeklyStressAvg = weeklyData.map(week => 
      week.reduce((sum, day) => sum + day.stressLevel, 0) / week.length
    );
    
    // Detect increasing stress trend
    if (weeklyStressAvg.length >= 3) {
      const trend = this.calculateTrend(weeklyStressAvg);
      if (trend > 0.5) {
        patterns.push({
          id: `pattern-${Date.now()}`,
          userId: assessments[0].userId,
          patternType: 'weekly',
          triggers: this.identifyTriggers(assessments),
          intensity: Math.round(weeklyStressAvg[weeklyStressAvg.length - 1]),
          frequency: 5,
          duration: 7,
          detectedAt: new Date()
        });
      }
    }
    
    return patterns;
  }

  // Risk assessment based on multiple factors
  assessRisk(assessments: DailyAssessment[], patterns: StressPattern[]): RiskAssessment {
    let riskScore = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];
    
    if (assessments.length === 0) {
      return {
        id: `risk-${Date.now()}`,
        userId: 'unknown',
        riskLevel: 'low',
        factors: [],
        score: 0,
        recommendations: ['Please complete daily assessments for accurate risk evaluation'],
        needsProfessionalHelp: false,
        assessedAt: new Date()
      };
    }
    
    const recentAssessments = assessments.slice(-7); // Last 7 days
    const avgStress = recentAssessments.reduce((sum, a) => sum + a.stressLevel, 0) / recentAssessments.length;
    const avgMood = recentAssessments.reduce((sum, a) => sum + a.moodLevel, 0) / recentAssessments.length;
    const avgSleep = recentAssessments.reduce((sum, a) => sum + a.sleepHours, 0) / recentAssessments.length;
    
    // High stress levels
    if (avgStress >= 8) {
      riskScore += 40;
      factors.push('Consistently high stress levels');
      recommendations.push('Practice stress reduction techniques daily');
    } else if (avgStress >= 6) {
      riskScore += 20;
      factors.push('Elevated stress levels');
      recommendations.push('Implement regular stress management activities');
    }
    
    // Low mood
    if (avgMood <= 3) {
      riskScore += 35;
      factors.push('Persistently low mood');
      recommendations.push('Consider mood-boosting activities and social connections');
    } else if (avgMood <= 5) {
      riskScore += 20;
      factors.push('Below-average mood');
      recommendations.push('Focus on activities that bring joy and fulfillment');
    }
    
    // Poor sleep
    if (avgSleep < 6) {
      riskScore += 25;
      factors.push('Insufficient sleep');
      recommendations.push('Prioritize sleep hygiene and consistent sleep schedule');
    }
    
    // Pattern analysis
    const highIntensityPatterns = patterns.filter(p => p.intensity >= 7);
    if (highIntensityPatterns.length > 0) {
      riskScore += 30;
      factors.push('Detected high-intensity stress patterns');
      recommendations.push('Work on identifying and managing stress triggers');
    }
    
    // Determine risk level
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    let needsProfessionalHelp = false;
    
    if (riskScore >= 80) {
      riskLevel = 'critical';
      needsProfessionalHelp = true;
      recommendations.unshift('URGENT: Please consider seeking immediate professional mental health support');
    } else if (riskScore >= 60) {
      riskLevel = 'high';
      needsProfessionalHelp = true;
      recommendations.unshift('Consider speaking with a mental health professional');
    } else if (riskScore >= 30) {
      riskLevel = 'moderate';
      recommendations.unshift('Monitor your mental health closely and consider preventive measures');
    } else {
      riskLevel = 'low';
      recommendations.unshift('Continue maintaining good mental health practices');
    }
    
    return {
      id: `risk-${Date.now()}`,
      userId: assessments[0].userId,
      riskLevel,
      factors,
      score: riskScore,
      recommendations,
      needsProfessionalHelp,
      assessedAt: new Date()
    };
  }

  private groupByWeek(assessments: DailyAssessment[]): DailyAssessment[][] {
    const weeks: DailyAssessment[][] = [];
    const sorted = assessments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let currentWeek: DailyAssessment[] = [];
    let currentWeekStart = new Date(sorted[0]?.date || new Date());
    
    for (const assessment of sorted) {
      const assessmentDate = new Date(assessment.date);
      const daysDiff = Math.floor((assessmentDate.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 7) {
        if (currentWeek.length > 0) weeks.push(currentWeek);
        currentWeek = [assessment];
        currentWeekStart = assessmentDate;
      } else {
        currentWeek.push(assessment);
      }
    }
    
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = values.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  private identifyTriggers(assessments: DailyAssessment[]): string[] {
    const triggers: string[] = [];
    const highStressAssessments = assessments.filter(a => a.stressLevel >= 7);
    
    if (highStressAssessments.length === 0) return triggers;
    
    const avgWorkHours = highStressAssessments.reduce((sum, a) => sum + a.workHours, 0) / highStressAssessments.length;
    const avgSleep = highStressAssessments.reduce((sum, a) => sum + a.sleepHours, 0) / highStressAssessments.length;
    const avgExercise = highStressAssessments.reduce((sum, a) => sum + a.exerciseMinutes, 0) / highStressAssessments.length;
    
    if (avgWorkHours > 9) triggers.push('Long work hours');
    if (avgSleep < 6.5) triggers.push('Poor sleep quality');
    if (avgExercise < 30) triggers.push('Lack of physical activity');
    
    return triggers;
  }
}

export const mlEngine = new MentalHealthMLEngine();