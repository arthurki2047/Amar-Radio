
'use client';

import { useApp } from '@/context/app-context';
import { AnimatePresence, motion } from 'framer-motion';

export function NowPlayingBar() {
  const { currentStation, isPlaying } = useApp();

  const variants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: '0%', opacity: 1 },
  };

  return (
    <AnimatePresence>
      {currentStation && isPlaying && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-[10.5rem] left-0 right-0 px-4 z-30 flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-xl bg-purple-900/50 backdrop-blur-md border border-white/10 rounded-full py-2 px-6 shadow-lg text-center">
            <p className="text-white text-sm font-semibold truncate">
              {currentStation.name}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
