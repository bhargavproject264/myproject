import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DailyAssessment, StressPattern } from '../types';
import { Calendar, TrendingUp, Target, AlertCircle } from 'lucide-react';

interface ProgressTrackingProps {
  assessments: DailyAssessment[];
  patterns: StressPattern[];
}

export const ProgressTracking: React.FC<ProgressTrackingProps> = ({ assessments, patterns }) => {
  const last30Days = assessments.slice(-30);
  
  const chartData = last30Days.map(assessment => ({
    date: new Date(assessment.date).toLocaleDateString(),
    stress: assessment.stressLevel,
    mood: assessment.moodLevel,
    sleep: assessment.sleepHours,
    exercise: assessment.exerciseMinutes,
  }));

  const weeklyData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (3 - i) * 7);
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() - (2 - i) * 7);
    
    const weekAssessments = assessments.filter(a => {
      const date = new Date(a.date);
      return date >= weekStart && date <= weekEnd;
    });
    
    if (weekAssessments.length === 0) return null;
    
    const avgStress = weekAssessments.reduce((sum, a) => sum + a.stressLevel, 0) / weekAssessments.length;
    const avgMood = weekAssessments.reduce((sum, a) => sum + a.moodLevel, 0) / weekAssessments.length;
    const avgSleep = weekAssessments.reduce((sum, a) => sum + a.sleepHours, 0) / weekAssessments.length;
    const totalExercise = weekAssessments.reduce((sum, a) => sum + a.exerciseMinutes, 0);
    
    return {
      week: `Week ${i + 1}`,
      stress: Math.round(avgStress * 10) / 10,
      mood: Math.round(avgMood * 10) / 10,
      sleep: Math.round(avgSleep * 10) / 10,
      exercise: Math.round(totalExercise / 60), 
    };
  }).filter(Boolean);

  const calculateImprovement = (metric: 'stress' | 'mood' | 'sleep') => {
    if (weeklyData.length < 2) return 0;
    const latest = weeklyData[weeklyData.length - 1];
    const previous = weeklyData[weeklyData.length - 2];
    
    if (metric === 'stress') {
      return previous.stress - latest.stress; 
    } else {
      return latest[metric] - previous[metric]; 
    }
  };

  const getImprovementColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getImprovementIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    return <TrendingUp className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Progress Tracking</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stress Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].stress : 'N/A'}
                </p>
                <div className={`flex items-center space-x-1 text-sm ${getImprovementColor(calculateImprovement('stress'))}`}>
                  {getImprovementIcon(calculateImprovement('stress'))}
                  <span>
                    {calculateImprovement('stress') > 0 ? 'Decreased' : calculateImprovement('stress') < 0 ? 'Increased' : 'No change'}
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mood Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].mood : 'N/A'}
                </p>
                <div className={`flex items-center space-x-1 text-sm ${getImprovementColor(calculateImprovement('mood'))}`}>
                  {getImprovementIcon(calculateImprovement('mood'))}
                  <span>
                    {calculateImprovement('mood') > 0 ? 'Improved' : calculateImprovement('mood') < 0 ? 'Declined' : 'No change'}
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sleep Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].sleep : 'N/A'}
                </p>
                <div className={`flex items-center space-x-1 text-sm ${getImprovementColor(calculateImprovement('sleep'))}`}>
                  {getImprovementIcon(calculateImprovement('sleep'))}
                  <span>
                    {calculateImprovement('sleep') > 0 ? 'Improved' : calculateImprovement('sleep') < 0 ? 'Declined' : 'No change'}
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress Level" />
                <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood Level" />
                <Line type="monotone" dataKey="sleep" stroke="#22c55e" strokeWidth={2} name="Sleep Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stress" fill="#ef4444" name="Avg Stress" />
                <Bar dataKey="mood" fill="#8b5cf6" name="Avg Mood" />
                <Bar dataKey="sleep" fill="#22c55e" name="Avg Sleep" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detected Patterns */}
      {patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detected Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patterns.map((pattern) => (
                <div key={pattern.id} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">
                      {pattern.patternType.charAt(0).toUpperCase() + pattern.patternType.slice(1)} Pattern Detected
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Intensity: {pattern.intensity}/10 | Frequency: {pattern.frequency} times per week
                    </p>
                    {pattern.triggers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-yellow-700 font-medium">Triggers:</p>
                        <ul className="text-sm text-yellow-600 ml-4 list-disc">
                          {pattern.triggers.map((trigger, index) => (
                            <li key={index}>{trigger}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};