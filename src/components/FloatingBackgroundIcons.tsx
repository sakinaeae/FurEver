import React from 'react';
import { motion } from 'motion/react';
import { CustomIcon } from './CustomIcon';

export const FloatingBackgroundIcons: React.FC = () => {
  const floatingItems = [
    { icon: 'ball', top: '5%', left: '15%', size: 48, duration: 7, delay: 0 },
    { icon: 'bone', top: '12%', left: '80%', size: 52, duration: 8, delay: 1.2 },
    { icon: 'heart-illustration', top: '25%', left: '40%', size: 44, duration: 6, delay: 0.5 },
    { icon: 'paw-illustration', top: '35%', left: '70%', size: 56, duration: 9, delay: 2 },
    { icon: 'ball', top: '45%', left: '20%', size: 40, duration: 7.5, delay: 1 },
    { icon: 'bone', top: '55%', left: '85%', size: 48, duration: 6.5, delay: 1.8 },
    { icon: 'heart-illustration', top: '65%', left: '30%', size: 50, duration: 8.5, delay: 0.8 },
    { icon: 'paw-illustration', top: '75%', left: '60%', size: 46, duration: 7, delay: 1.5 },
    { icon: 'ball', top: '85%', left: '10%', size: 42, duration: 8.2, delay: 0.3 },
    { icon: 'bone', top: '92%', left: '75%', size: 50, duration: 7.8, delay: 1.6 },
    { icon: 'heart-illustration', top: '10%', left: '55%', size: 46, duration: 6.9, delay: 0.9 },
    { icon: 'paw-illustration', top: '20%', left: '25%', size: 44, duration: 8.8, delay: 2.1 },
    { icon: 'ball', top: '30%', left: '88%', size: 38, duration: 7.2, delay: 0.4 },
    { icon: 'bone', top: '40%', left: '50%', size: 42, duration: 8.5, delay: 1.1 },
    { icon: 'heart-illustration', top: '50%', left: '12%', size: 46, duration: 6.3, delay: 0.6 },
    { icon: 'paw-illustration', top: '60%', left: '92%', size: 40, duration: 9.1, delay: 1.9 },
    { icon: 'ball', top: '70%', left: '45%', size: 44, duration: 7.6, delay: 1.3 },
    { icon: 'bone', top: '80%', left: '22%', size: 48, duration: 6.7, delay: 2.4 },
    { icon: 'heart-illustration', top: '90%', left: '50%', size: 42, duration: 8.1, delay: 0.7 },
    { icon: 'paw-illustration', top: '15%', left: '95%', size: 46, duration: 7.4, delay: 1.7 },
    { icon: 'bone', top: '38%', left: '5%', size: 40, duration: 8.3, delay: 0.2 },
    { icon: 'heart-illustration', top: '88%', left: '90%', size: 42, duration: 6.6, delay: 1.4 },
    { icon: 'paw-illustration', top: '5%', left: '35%', size: 48, duration: 7.9, delay: 0.9 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {floatingItems.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          style={{ top: item.top, left: item.left }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 20, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          <CustomIcon name={item.icon} white size={item.size} className="opacity-60 drop-shadow-[2px_4px_8px_rgba(15,92,148,0.15)]" />
        </motion.div>
      ))}
    </div>
  );
};
