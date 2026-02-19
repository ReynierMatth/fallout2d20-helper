import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'flex items-center justify-center gap-2 font-bold uppercase tracking-wide transition-all border-2 rounded disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-vault-yellow text-vault-blue border-vault-yellow-dark hover:bg-vault-yellow-light active:bg-vault-yellow-dark',
    secondary:
      'bg-transparent text-vault-yellow border-vault-yellow hover:bg-vault-yellow hover:text-vault-blue',
    outline:
      'bg-transparent text-vault-yellow-dark border-vault-yellow-dark hover:text-vault-yellow hover:border-vault-yellow',
    danger:
      'bg-vault-danger text-white border-red-800 hover:bg-red-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
