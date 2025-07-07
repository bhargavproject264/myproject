import React from 'react';
import { clsx } from 'clsx';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  icon?: React.ReactNode;
  gradient?: boolean;
}

export const ModernButton: React.FC<ModernButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children,
  icon,
  gradient = false,
  ...props 
}) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95',
        {
          'bg-gradient-primary text-white shadow-lg hover:shadow-xl focus:ring-primary-300': variant === 'primary' && gradient,
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-300 shadow-lg': variant === 'primary' && !gradient,
          'bg-gradient-secondary text-white shadow-lg hover:shadow-xl focus:ring-secondary-300': variant === 'secondary' && gradient,
          'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-300 shadow-lg': variant === 'secondary' && !gradient,
          'bg-gradient-success text-white shadow-lg hover:shadow-xl focus:ring-accent-300': variant === 'success' && gradient,
          'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-300 shadow-lg': variant === 'success' && !gradient,
          'bg-gradient-warning text-white shadow-lg hover:shadow-xl focus:ring-yellow-300': variant === 'warning' && gradient,
          'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300 shadow-lg': variant === 'warning' && !gradient,
          'text-gray-700 hover:bg-gray-100 focus:ring-gray-300': variant === 'ghost',
          'glass-effect text-white hover:bg-white/20 focus:ring-white/30': variant === 'glass',
          'px-3 py-2 text-sm gap-2': size === 'sm',
          'px-4 py-3 text-base gap-2': size === 'md',
          'px-6 py-4 text-lg gap-3': size === 'lg',
          'px-8 py-5 text-xl gap-3': size === 'xl',
        },
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};