'use client';

type LoadingProps = {
  size?: 'small' | 'medium' | 'large';
  className?: string;
};

const sizeClasses = {
  small: 'w-6 h-6 border-2',
  medium: 'w-10 h-10 border-4',
  large: 'w-16 h-16 border-8',
};

export default function Loading({ size = 'medium', className }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizeClasses[size]}`}
      />
    </div>
  );
}