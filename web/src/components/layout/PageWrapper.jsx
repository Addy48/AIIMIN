import { useReducedMotion } from 'framer-motion';
import { motion } from 'framer-motion';

export default function PageWrapper({ children }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div style={{ position: 'relative', width: '100%' }}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ position: 'relative', width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
