import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { DailyAssessmentForm } from './components/DailyAssessmentForm';
import { InterventionRecommendations } from './components/InterventionRecommendations';
import { ProgressTracking } from './components/ProgressTracking';
import { ProfessionalResources } from './components/ProfessionalResources';
import { ModernButton } from './components/ui/ModernButton';
import { GlassCard } from './components/ui/GlassCard';
import { useMentalHealthData } from './hooks/useMentalHealthData';
import { Intervention } from './types';
import { 
  BarChart3, 
  Heart, 
  Plus, 
  Activity, 
  Users, 
  Brain,
  Menu,
  X,
  Sparkles,
  Shield
} from 'lucide-react';

type ActiveView = 'dashboard' | 'assessment' | 'interventions' | 'progress' | 'resources';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { assessments, patterns, riskAssessment, interventions, progressMetrics, addAssessment } = useMentalHealthData();

  const handleSubmitAssessment = (assessment: Parameters<typeof addAssessment>[0]) => {
    addAssessment(assessment);
    setActiveView('dashboard');
  };

  const handleStartIntervention = (intervention: Intervention) => {
    console.log('Starting intervention:', intervention.title);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-400' },
    { id: 'assessment', label: 'Daily Check-in', icon: Plus, color: 'text-green-400' },
    { id: 'interventions', label: 'Interventions', icon: Heart, color: 'text-purple-400' },
    { id: 'progress', label: 'Progress', icon: Activity, color: 'text-yellow-400' },
    { id: 'resources', label: 'Get Help', icon: Users, color: 'text-red-400' },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard assessments={assessments} riskAssessment={riskAssessment} progressMetrics={progressMetrics} />;
      case 'assessment':
        return <DailyAssessmentForm onSubmit={handleSubmitAssessment} />;
      case 'interventions':
        return <InterventionRecommendations interventions={interventions} onStartIntervention={handleStartIntervention} />;
      case 'progress':
        return <ProgressTracking assessments={assessments} patterns={patterns} />;
      case 'resources':
        return <ProfessionalResources />;
      default:
        return <Dashboard assessments={assessments} riskAssessment={riskAssessment} progressMetrics={progressMetrics} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <GlassCard className="m-4 mb-0">
          <div className="flex justify-between items-center h-16 px-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Brain className="h-10 w-10 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-green-800" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-poppins">my fitness</h1>
                <p className="text-white/60 text-sm">maintain perfect fitness</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <ModernButton
                    key={item.id}
                    variant={isActive ? "primary" : "glass"}
                    size="md"
                    onClick={() => setActiveView(item.id as ActiveView)}
                    className={`transition-all duration-300 ${isActive ? 'scale-105' : ''}`}
                    gradient={isActive}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.color}`} />
                    <span className={isActive ? 'text-white' : 'text-white/80'}>{item.label}</span>
                  </ModernButton>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <ModernButton
              variant="glass"
              size="md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </ModernButton>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 p-4 slide-in">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <ModernButton
                      key={item.id}
                      variant={isActive ? "primary" : "glass"}
                      size="md"
                      onClick={() => {
                        setActiveView(item.id as ActiveView);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                      gradient={isActive}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
                      <span className={isActive ? 'text-white' : 'text-white/80'}>{item.label}</span>
                    </ModernButton>
                  );
                })}
              </div>
            </div>
          )}
        </GlassCard>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4 pt-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {renderActiveView()}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16">
        <GlassCard className="m-4 mt-0">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">All rights reserved</span>
            </div>    
          </div>
        </GlassCard>
      </footer>
    </div>
  );
}

export default App;