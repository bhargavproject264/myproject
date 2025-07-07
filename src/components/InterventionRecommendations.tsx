import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { Intervention } from '../types';
import { Clock, Star, ExternalLink, ChevronDown, ChevronUp, Play, Zap, Heart, Brain, Users, Stethoscope } from 'lucide-react';

interface InterventionRecommendationsProps {
  interventions: Intervention[];
  onStartIntervention: (intervention: Intervention) => void;
}

export const InterventionRecommendations: React.FC<InterventionRecommendationsProps> = ({ 
  interventions, 
  onStartIntervention 
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'breathing': return <Zap className="h-5 w-5" />;
      case 'meditation': return <Brain className="h-5 w-5" />;
      case 'exercise': return <Heart className="h-5 w-5" />;
      case 'social': return <Users className="h-5 w-5" />;
      case 'professional': return <Stethoscope className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breathing': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-400/30' };
      case 'meditation': return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-400/30' };
      case 'exercise': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/30' };
      case 'social': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-400/30' };
      case 'professional': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/30' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-400/30' };
    }
  };

  const getEffectivenessStars = (effectiveness: number) => {
    const stars = Math.round(effectiveness * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-white/30'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-poppins">Personalized Interventions</h1>
        <p className="text-white/80">AI-powered recommendations tailored to your wellness needs</p>
      </div>

      <div className="grid gap-6">
        {interventions.map((intervention) => {
          const typeStyle = getTypeColor(intervention.type);
          const isExpanded = expandedId === intervention.id;
          
          return (
            <GlassCard key={intervention.id} className="hover:scale-[1.02] transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${typeStyle.bg}`}>
                        <span className={typeStyle.text}>
                          {getTypeIcon(intervention.type)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{intervention.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                            {intervention.type}
                          </span>
                          {intervention.culturallyAdapted && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-400/30">
                              Culturally Adapted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white/80 mb-4 leading-relaxed">{intervention.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-white/60" />
                        <span className="text-white/80">{intervention.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white/80">Effectiveness:</span>
                        <div className="flex space-x-1">{getEffectivenessStars(intervention.effectiveness)}</div>
                        <span className="text-white/60">({Math.round(intervention.effectiveness * 100)}%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <ModernButton 
                      variant="primary" 
                      size="md"
                      gradient={true}
                      icon={<Play className="h-4 w-4" />}
                      onClick={() => onStartIntervention(intervention)}
                    >
                      Start Now
                    </ModernButton>
                    <ModernButton
                      variant="glass"
                      size="md"
                      onClick={() => setExpandedId(isExpanded ? null : intervention.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </ModernButton>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t border-white/10 pt-6 mt-6 space-y-6 slide-in">
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                        <span>Step-by-Step Instructions</span>
                      </h4>
                      <div className="space-y-3">
                        {intervention.instructions.map((instruction, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="text-white/90 leading-relaxed">{instruction}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {intervention.resources.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Additional Resources</span>
                        </h4>
                        <div className="space-y-2">
                          {intervention.resources.map((resource, index) => (
                            <a
                              key={index}
                              href={resource}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                            >
                              <ExternalLink className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                              <span className="text-blue-400 group-hover:text-blue-300 text-sm">Learn more about this technique</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-primary/10 border border-primary-400/20">
                      <div>
                        <h5 className="text-white font-medium">Ready to begin?</h5>
                        <p className="text-white/70 text-sm">This intervention typically takes {intervention.duration} minutes</p>
                      </div>
                      <ModernButton 
                        variant="primary" 
                        size="lg"
                        gradient={true}
                        icon={<Play className="h-5 w-5" />}
                        onClick={() => onStartIntervention(intervention)}
                      >
                        Start Intervention
                      </ModernButton>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};