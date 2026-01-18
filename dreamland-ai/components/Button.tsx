
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  
  // Base: Flex centering, font specs, and the critical transition for the "press" effect
  const baseStyles = `
    relative inline-flex items-center justify-center 
    font-display font-bold rounded-2xl md:rounded-3xl tracking-wide
    transition-all duration-150 ease-out cursor-pointer
    active:scale-[0.98] active:translate-y-[8px]
  `;
  
  // Variants: Using box-shadow (shadow-[...]) for the 3D depth instead of border-b
  // This prevents layout jumping and looks smoother
  const variants = {
    primary: "bg-orange-500 text-white shadow-3d-primary active:shadow-3d-primary-active hover:bg-orange-400",
    secondary: "bg-white text-slate-700 shadow-3d-secondary active:shadow-3d-secondary-active hover:bg-slate-50 border-2 border-slate-100",
    accent: "bg-amber-400 text-amber-900 shadow-[0_8px_0_#d97706,0_15px_20px_rgba(0,0,0,0.2)] active:shadow-[0_0_0_#d97706] hover:bg-amber-300",
    danger: "bg-red-500 text-white shadow-[0_8px_0_#b91c1c,0_15px_20px_rgba(0,0,0,0.2)] active:shadow-[0_0_0_#b91c1c] hover:bg-red-400"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[44px]",
    md: "px-8 py-3 text-lg min-h-[56px]",
    lg: "px-10 py-5 text-2xl min-h-[72px]"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:active:shadow-3d-primary disabled:active:translate-y-0`}
      {...props}
    >
      {/* Glossy shine overlay for that "candy" look */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl md:rounded-t-3xl pointer-events-none"></div>
      
      <span className="relative z-10 flex items-center gap-3">
        {children}
      </span>
    </button>
  );
};
