
'use client';

import { useApp } from '@/context/app-context';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const PlayerControl = () => {
  const { currentStation, isPlaying, togglePlayPause, playNext, playPrevious, togglePlayer, t } = useApp();

  if (!currentStation) return null;

  return (
    <motion.div
      layoutId="player"
      className="fixed bottom-24 left-0 right-0 px-4 z-40 flex justify-center"
      onClick={togglePlayer}
      style={{ cursor: 'pointer' }}
    >
      <div className="pointer-events-auto w-full max-w-xl bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-full p-2 pr-4 shadow-2xl flex items-center justify-between ring-1 ring-white/5 relative overflow-hidden">
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
          <div className={`w-12 h-12 rounded-full flex-shrink-0 overflow-hidden border-2 border-purple-500/30 bg-black/50 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
            <Image src={currentStation.logoUrl} width={48} height={48} className="w-full h-full object-cover" alt="logo" unoptimized />
          </div>
          <div className="flex flex-col min-w-0 justify-center">
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide uppercase truncate">
                {t('live_radio')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button onClick={(e) => { e.stopPropagation(); playPrevious(); }} className="p-2 text-gray-400 hover:text-white transition active:scale-90 touch-manipulation">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07c-.57.4-.57 1.24 0 1.64z"/></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full shadow-lg text-white hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <div className="flex items-center gap-1">
             <button onClick={(e) => { e.stopPropagation(); playNext(); }} className="p-2 text-gray-400 hover:text-white transition active:scale-90 touch-manipulation">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z" /></svg>
            </button>
            <button className="p-1 rounded-full hover:bg-white/10">
                <ChevronUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerControl;
