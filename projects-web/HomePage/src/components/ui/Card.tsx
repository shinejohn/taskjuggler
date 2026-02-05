import React from 'react';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
}
export function Card({
  children,
  className = '',
  variant = 'default',
  hover = false,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl overflow-hidden';
  const variants = {
    default: 'bg-white border border-slate-100 shadow-sm',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20',
    gradient: 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white'
  };
  const hoverStyles = hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : '';
  return <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>;
}