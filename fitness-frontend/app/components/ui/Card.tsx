'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card = ({ children, className = '', hoverEffect = true }: CardProps) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.03 } : {}}
      className={`bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const CardContent = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};
