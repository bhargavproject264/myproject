import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = false,
  glow = false 
}) => {
  return (
    <div
      className={clsx(
        'glass-effect rounded-2xl p-6 transition-all duration-300',
        hover && 'hover:scale-105 hover:shadow-2xl',
        glow && 'pulse-glow',
        className
      )}
    >
      {children}
    </div>
  );
};