
'use client';

import { useApp } from '@/context/app-context';
import { motion } from 'framer-motion';
import { Wrench, Radio } from 'lucide-react';
import { AuthButton } from './auth-button';

export function MaintenanceScreen() {
  const { t } = useApp();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0f172a] text-white p-6 text-center">
      <div className="absolute top-4 right-4">
        <AuthButton />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 1 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-[60px] animate-pulse"></div>
        <div className="relative w-32 h-32 flex items-center justify-center rounded-3xl bg-amber-500 text-white shadow-2xl">
          <Wrench className="w-16 h-16" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
      >
        {t('maintenance_title')}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 text-lg max-w-md mb-12"
      >
        {t('maintenance_desc')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-3 text-purple-400 font-bold tracking-widest uppercase text-sm"
      >
        <Radio className="w-5 h-5 animate-pulse" />
        Amar Radio
      </motion.div>
    </div>
  );
}
