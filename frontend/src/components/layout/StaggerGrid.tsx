import { motion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export default function StaggerGrid({ children, className = '', animate = true }: StaggerGridProps) {
  const hasAnimated = useRef(false);
  const shouldAnimate = animate && !hasAnimated.current;

  if (shouldAnimate) {
    hasAnimated.current = true;
  }

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
