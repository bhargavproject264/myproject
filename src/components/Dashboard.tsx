import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { MetricCard } from './ui/MetricCard';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Brain, Heart, Moon, Activity, TrendingUp, AlertTriangle, Zap, Target } from 'lucide-react';
import { DailyAssessment, RiskAssessment, ProgressMetrics } from '../types';

interface DashboardProps {
  assessments: DailyAssessment[];
  riskAssessment: RiskAssessment | null;
  progressMetrics: ProgressMetrics;
}

export const Dashboard: React.FC<DashboardProps> = ({ assessments, riskAssessment, progressMetrics }) => {
  const chartData = assessments.slice(-14).map(assessment => ({
    date: new Date(assessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    stress: assessment.stressLevel,
    mood: assessment.moodLevel,
    sleep: assessment.sleepHours,
    energy: 10 - assessment.stressLevel + assessment.moodLevel / 2,
  }));

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return '#4facfe';
      case 'moderate': return '#43e97b';
      case 'high': return '#f093fb';
      case 'critical': return '#f5576c';
      default: return '#667eea';
    }
  };

  const getWellnessMessage = (score: number) => {
    if (score >= 80) return { message: 'Excellent wellness state', color: 'text-green-400' };
    if (score >= 60) return { message: 'Good mental health', color: 'text-blue-400' };
    if (score >= 40) return { message: 'Moderate wellness', color: 'text-yellow-400' };
    return { message: 'Needs attention', color: 'text-red-400' };
  };

  const wellnessStatus = getWellnessMessage(progressMetrics.overallWellness);

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 font-poppins">
          Welcome to Your Wellness Journey
        </h1>
        <p className="text-white/80 text-lg">
          Track, analyze, and improve your mental health with AI-powered insights
        </p>
      </div>

      {/* Risk Assessment Alert */}
      {riskAssessment && riskAssessment.riskLevel !== 'low' && (
        <GlassCard className="border-l-4 border-l-red-400 glow">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-300 text-lg mb-2">Wellness Alert</h4>
              <p className="text-white/80 mb-3">
                Your current wellness level requires attention. Risk level: 
                <span 
                  className="ml-2 px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: getRiskColor(riskAssessment.riskLevel) + '20',
                    color: getRiskColor(riskAssessment.riskLevel)
                  }}
                >
                  {riskAssessment.riskLevel.toUpperCase()}
                </span>
              </p>
              {riskAssessment.needsProfessionalHelp && (
                <p className="text-yellow-300 font-medium">
                  💡 Consider seeking professional mental health support
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Overall Wellness"
          value={progressMetrics.overallWellness}
          maxValue={100}
          unit="%"
          icon={<Target className="h-6 w-6 text-white" />}
          color="#4facfe"
          trend={progressMetrics.overallWellness > 70 ? 'up' : progressMetrics.overallWellness < 50 ? 'down' : 'stable'}
          trendValue={5.2}
        />
        
        <MetricCard
          title="Stress Level"
          value={10 - (progressMetrics.stressTrend + 5)}
          maxValue={10}
          icon={<Brain className="h-6 w-6 text-white" />}
          color="#f093fb"
          trend={progressMetrics.stressTrend < 0 ? 'up' : 'down'}
          trendValue={Math.abs(progressMetrics.stressTrend)}
        />
        
        <MetricCard
          title="Mood Score"
          value={progressMetrics.moodTrend}
          maxValue={10}
          icon={<Heart className="h-6 w-6 text-white" />}
          color="#43e97b"
          trend={progressMetrics.moodTrend > 6 ? 'up' : 'down'}
          trendValue={1.3}
        />
        
        <MetricCard
          title="Sleep Quality"
          value={progressMetrics.sleepQuality * 10}
          maxValue={10}
          icon={<Moon className="h-6 w-6 text-white" />}
          color="#38f9d7"
          trend={progressMetrics.sleepQuality > 0.7 ? 'up' : 'down'}
          trendValue={0.8}
        />
      </div>

      {/* Wellness Score */}
      <GlassCard className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  <AnimatedCounter value={progressMetrics.overallWellness} suffix="%" />
                </div>
                <div className="text-white/80 text-sm">Wellness</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-yellow-800" />
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Your Wellness Score</h3>
        <p className={`text-lg font-medium ${wellnessStatus.color}`}>
          {wellnessStatus.message}
        </p>
      </GlassCard>

      {/* Trends Chart */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">14-Day Wellness Trends</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-white/80">Stress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="text-white/80">Mood</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-white/80">Energy</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
              <YAxis domain={[0, 10]} stroke="rgba(255,255,255,0.6)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)'
                }}
              />
              <Area type="monotone" dataKey="stress" stroke="#ef4444" fillOpacity={1} fill="url(#stressGradient)" strokeWidth={3} />
              <Area type="monotone" dataKey="mood" stroke="#8b5cf6" fillOpacity={1} fill="url(#moodGradient)" strokeWidth={3} />
              <Area type="monotone" dataKey="energy" stroke="#22c55e" fillOpacity={1} fill="url(#energyGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-white">Today's Insights</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Energy Level</span>
              <span className="text-green-400 font-medium">High</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Stress Triggers</span>
              <span className="text-yellow-400 font-medium">Work Pressure</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Recommended Action</span>
              <span className="text-blue-400 font-medium">Breathing Exercise</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-white">Weekly Progress</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Assessments Completed</span>
              <span className="text-green-400 font-medium">6/7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Interventions Used</span>
              <span className="text-blue-400 font-medium">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Improvement Rate</span>
              <span className="text-green-400 font-medium">+15%</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};