import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'outline' | 'interactive' | 'hero' | 'dark';
}

export const Card: React.FC<CardProps> = ({
  className = '',
  variant = 'default',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-[24px] transition-all duration-200';

  const variantStyles = {
    default: 'bg-white border border-slate-200 shadow-2xs text-slate-900',
    flat: 'bg-slate-50 border border-slate-200/80 text-slate-900',
    outline: 'bg-transparent border border-slate-200 text-slate-900',
    interactive:
      'bg-white border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-md cursor-pointer text-slate-900',
    hero: 'bg-white rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden text-slate-900',
    dark: 'bg-blue-950 rounded-[24px] border border-blue-900 p-6 text-white shadow-sm'
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
