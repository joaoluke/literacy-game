import { type ButtonHTMLAttributes } from 'react';

type Button3DProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button3D({ children, variant = 'primary', className = '', ...props }: Button3DProps) {
  const variantClass = variant === 'primary' ? '' : variant;
  return (
    <button className={`btn-3d ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
