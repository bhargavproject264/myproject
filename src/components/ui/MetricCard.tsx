import React from 'react';
import { GlassCard } from './GlassCard';
import { ProgressRing } from './ProgressRing';

interface MetricCardProps {
  title: string;
  value: number;
  maxValue?: number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  maxValue = 10,
  unit = '',
  icon,
  color,
  trend,
  trendValue
}) => {
  const percentage = (value / maxValue) * 100;
  
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  return (
    <GlassCard className="relative overflow-hidden hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/20">
          {icon}
        </div>
        <ProgressRing
          progress={percentage}
          size={60}
          strokeWidth={4}
          color={color}
        >
          <span className="text-white text-sm font-bold">
            {Math.round(percentage)}%
          </span>
        </ProgressRing>
      </div>
      
      <div>
        <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-white text-2xl font-bold">
            {value.toFixed(1)}{unit}
          </span>
          {trend && trendValue && (
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()} {Math.abs(trendValue).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};