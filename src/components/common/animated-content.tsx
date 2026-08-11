'use client';

import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

interface AnimatedContentProps {
  children: React.ReactNode;
  className?: string;
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedContent({ children, className }: AnimatedContentProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  delay = 0.05,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {prefix}
      {value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      {suffix}
    </motion.span>
  );
}
