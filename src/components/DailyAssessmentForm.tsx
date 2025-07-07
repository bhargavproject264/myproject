import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { DailyAssessment } from '../types';
import { Save, Calendar, Brain, Heart, Moon, Coffee, Smartphone, Dumbbell } from 'lucide-react';

interface DailyAssessmentFormProps {
  onSubmit: (assessment: Omit<DailyAssessment, 'id' | 'userId' | 'createdAt'>) => void;
  existingAssessment?: DailyAssessment;
}

const symptoms = [
  'Anxiety', 'Fatigue', 'Irritability', 'Difficulty concentrating',
  'Headaches', 'Muscle tension', 'Sleep problems', 'Mood changes',
  'Loss of appetite', 'Restlessness'
];

export const DailyAssessmentForm: React.FC<DailyAssessmentFormProps> = ({ onSubmit, existingAssessment }) => {
  const [formData, setFormData] = useState({
    date: existingAssessment?.date || new Date().toISOString().split('T')[0],
    stressLevel: existingAssessment?.stressLevel || 5,
    moodLevel: existingAssessment?.moodLevel || 5,
    sleepHours: existingAssessment?.sleepHours || 8,
    workHours: existingAssessment?.workHours || 8,
    exerciseMinutes: existingAssessment?.exerciseMinutes || 0,
    socialInteraction: existingAssessment?.socialInteraction || 5,
    screenTime: existingAssessment?.screenTime || 4,
    caffeine: existingAssessment?.caffeine || 1,
    alcohol: existingAssessment?.alcohol || 0,
    symptoms: existingAssessment?.symptoms || [],
    notes: existingAssessment?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const SliderInput: React.FC<{ 
    label: string; 
    value: number; 
    onChange: (value: number) => void; 
    min?: number; 
    max?: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ label, value, onChange, min = 1, max = 10, icon, color }) => (
    <GlassCard className="p-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: color + '20' }}>
          {icon}
        </div>
        <div className="flex-1">
          <label className="block text-white font-medium text-sm">{label}</label>
          <div className="flex items-center space-x-4 mt-2">
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.2) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <span className="text-white font-bold text-lg w-8 text-center">{value}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-poppins">Daily Wellness Check-in</h1>
        <p className="text-white/80">Track your daily patterns to build better mental health insights</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Selection */}
        <GlassCard>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <label className="text-white font-medium">Assessment Date</label>
          </div>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </GlassCard>

        {/* Mood & Stress Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderInput
            label="Stress Level"
            value={formData.stressLevel}
            onChange={(value) => setFormData(prev => ({ ...prev, stressLevel: value }))}
            icon={<Brain className="h-5 w-5 text-red-400" />}
            color="#ef4444"
          />
          
          <SliderInput
            label="Mood Level"
            value={formData.moodLevel}
            onChange={(value) => setFormData(prev => ({ ...prev, moodLevel: value }))}
            icon={<Heart className="h-5 w-5 text-purple-400" />}
            color="#8b5cf6"
          />
          
          <SliderInput
            label="Social Interaction Quality"
            value={formData.socialInteraction}
            onChange={(value) => setFormData(prev => ({ ...prev, socialInteraction: value }))}
            icon={<Heart className="h-5 w-5 text-pink-400" />}
            color="#ec4899"
          />
        </div>

        {/* Lifestyle Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Moon className="h-5 w-5 text-green-400" />
              </div>
              <label className="text-white font-medium text-sm">Sleep Hours</label>
            </div>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.sleepHours}
              onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Brain className="h-5 w-5 text-blue-400" />
              </div>
              <label className="text-white font-medium text-sm">Work Hours</label>
            </div>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.workHours}
              onChange={(e) => setFormData(prev => ({ ...prev, workHours: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Dumbbell className="h-5 w-5 text-yellow-400" />
              </div>
              <label className="text-white font-medium text-sm">Exercise (min)</label>
            </div>
            <input
              type="number"
              min="0"
              max="1440"
              value={formData.exerciseMinutes}
              onChange={(e) => setFormData(prev => ({ ...prev, exerciseMinutes: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Smartphone className="h-5 w-5 text-purple-400" />
              </div>
              <label className="text-white font-medium text-sm">Screen Time (hrs)</label>
            </div>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.screenTime}
              onChange={(e) => setFormData(prev => ({ ...prev, screenTime: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Coffee className="h-5 w-5 text-orange-400" />
              </div>
              <label className="text-white font-medium text-sm">Caffeine Servings</label>
            </div>
            <input
              type="number"
              min="0"
              max="20"
              value={formData.caffeine}
              onChange={(e) => setFormData(prev => ({ ...prev, caffeine: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </GlassCard>
          
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Coffee className="h-5 w-5 text-red-400" />
              </div>
              <label className="text-white font-medium text-sm">Alcohol Servings</label>
            </div>
            <input
              type="number"
              min="0"
              max="20"
              value={formData.alcohol}
              onChange={(e) => setFormData(prev => ({ ...prev, alcohol: Number(e.target.value) }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </GlassCard>
        </div>

        {/* Symptoms */}
        <GlassCard>
          <h3 className="text-white font-medium text-lg mb-4">Symptoms Experienced Today</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {symptoms.map((symptom) => (
              <label key={symptom} className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.symptoms.includes(symptom)}
                  onChange={(e) => handleSymptomChange(symptom, e.target.checked)}
                  className="rounded border-white/30 text-primary-600 focus:ring-primary-500 bg-white/10"
                />
                <span className="text-white/90 text-sm">{symptom}</span>
              </label>
            ))}
          </div>
        </GlassCard>

        {/* Notes */}
        <GlassCard>
          <label className="block text-white font-medium text-lg mb-4">Additional Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
            placeholder="Share any additional thoughts or observations about your day..."
          />
        </GlassCard>

        <div className="text-center">
          <ModernButton 
            type="submit" 
            variant="primary" 
            size="lg" 
            gradient={true}
            icon={<Save className="h-5 w-5" />}
            className="px-12"
          >
            Save Assessment
          </ModernButton>
        </div>
      </form>
    </div>
  );
};