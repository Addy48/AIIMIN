import React from 'react';
import { motion } from 'framer-motion';
import { shouldShip } from '../../utils/designVoteShip';
import { pageVariants } from '../../constants/animations';
import { staggerContainer, staggerItem, progressTween, springSnappy } from '../../utils/motionPresets';

export function getShippedPageVariants() {
  if (!shouldShip('motion-page-fade')) return pageVariants;
  return {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
    },
  };
}

export function StaggerWrap({ children, className, style, shipId = 'motion-stagger' }) {
  if (!shouldShip(shipId)) {
    return <div className={className} style={style}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      style={style}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return <motion.div variants={staggerItem}>{child}</motion.div>;
      })}
    </motion.div>
  );
}

export function ShippedHoverLift({ children, className, style, shipId = 'motion-hover-lift' }) {
  if (!shouldShip(shipId)) {
    return <div className={className} style={style}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      style={style}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}

export function ShippedSpringAmount({ amount, prefix = '+', suffix = ' XP', shipId = 'motion-spring-number' }) {
  if (!shouldShip(shipId)) {
    return <span>{prefix}{amount}{suffix}</span>;
  }
  return (
    <motion.span
      key={amount}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={springSnappy}
    >
      {prefix}{amount}{suffix}
    </motion.span>
  );
}

export { progressTween };
