
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useApp } from '@/context/app-context';

export function LoadingScreen() {
  const { t } = useApp();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background overflow-hidden relative">
      {/* Background Scaling Icon */}
      <motion.div
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 60, opacity: 1 }}
        transition={{ 
          duration: 2, // Matches the approximate length of your audio file
          ease: "easeIn" 
        }}
        className="flex items-center justify-center"
      >
        <Image
            src="https://img.icons8.com/color/96/india.png"
            alt="Indian Flag Icon"
            width={96}
            height={96}
            unoptimized
        />
      </motion.div>

      {/* Foreground Text */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1, 
          delay: 1, // Appears during the peak of the conch sound
          ease: "easeOut" 
        }}
        className="absolute text-4xl md:text-6xl font-bold text-white mix-blend-difference text-center"
        style={{ textShadow: '0px 4px 15px rgba(0,0,0,0.9)' }}
      >
         {t('proudly_indian')}
      </motion.h1>
    </div>
  );
}
