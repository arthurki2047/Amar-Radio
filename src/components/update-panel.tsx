
'use client';

import { useApp } from '@/context/app-context';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';

export function UpdatePanel() {
  const { toggleUpdatePanel, announcement, announcementColor } = useApp();

  const panelVariants = {
    hidden: { opacity: 0, height: 0, y: -20 },
    visible: { opacity: 1, height: 'auto', y: 0, transition: { type: 'spring', duration: 0.5 } },
    exit: { opacity: 0, height: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.section
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="px-4"
    >
      <div className="relative bg-card/50 backdrop-blur-md text-foreground shadow-lg rounded-2xl overflow-hidden border border-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-7 w-7"
          onClick={toggleUpdatePanel}
        >
          <X className="w-4 h-4" />
        </Button>
        <div className="flex-1 overflow-hidden relative h-16 w-full flex items-center">
          <div className={`absolute whitespace-nowrap animate-scroll-left hover:pause-animation text-xl font-medium px-6 ${announcementColor}`}>
            {announcement}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
