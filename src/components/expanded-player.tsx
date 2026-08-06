'use client';

import { useApp } from '@/context/app-context';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown, Volume1, Volume2, VolumeX, Timer, Star, RotateCcw, RotateCw } from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { SettingsSheet } from './settings-sheet';


export function ExpandedPlayer() {
  const {
    currentStation,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    togglePlayer,
    volume,
    setVolume,
    favorites,
    toggleFavorite,
    seekForward,
    seekBackward,
    t,
  } = useApp();

  if (!currentStation) return null;
  
  const isFavorite = favorites.includes(currentStation.id);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5 text-muted-foreground" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5 text-muted-foreground" />;
    return <Volume2 className="w-5 h-5 text-muted-foreground" />;
  }

  const containerVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: '0%', opacity: 1 },
  };

  return (
    <motion.div
      layoutId="player"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      className="fixed inset-0 bg-background z-50 flex flex-col p-4"
    >
      {/* Top Controls */}
      <div className="flex-shrink-0 flex items-center justify-between">
        <Button variant="ghost" onClick={togglePlayer}>
            Back
        </Button>
        <span className="text-sm font-bold uppercase tracking-wider">{t('now_playing')}</span>
        <SettingsSheet />
      </div>

      {/* Artwork */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-4">
        <motion.div 
            initial={{scale: 0.8, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{delay: 0.2, type: 'spring'}}
            className="relative w-64 h-64 sm:w-80 sm:h-80"
        >
            <div className={`absolute inset-0 bg-purple-500/20 rounded-full blur-3xl ${isPlaying ? 'animate-pulse' : ''}`}></div>
            <Image
                src={currentStation.logoUrl}
                alt={currentStation.name}
                width={320}
                height={320}
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                unoptimized
            />
        </motion.div>

        {/* Station Info */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">{currentStation.name}</h1>
          <p className="text-muted-foreground mt-1">{t('live_from_amar_radio')}</p>
        </div>
      </div>
      
      {/* Playback Controls */}
       <div className="flex-shrink-0 flex flex-col gap-6 pb-6">
         {/* Volume Slider */}
        <div className="flex items-center gap-3">
          {getVolumeIcon()}
          <Slider
            value={[volume * 100]}
            onValueChange={(value) => setVolume(value[0] / 100)}
            max={100}
            step={1}
          />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-2">
           <Button variant="ghost" size="icon" className="w-16 h-16" onClick={seekBackward} aria-label={t('rewind_10s')}>
            <RotateCcw className="w-8 h-8" />
          </Button>
          <Button variant="ghost" size="icon" className="w-16 h-16" onClick={playPrevious}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07c-.57.4-.57 1.24 0 1.64z"/></svg>
          </Button>

          <Button
            onClick={togglePlayPause}
            className="w-20 h-20 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105"
          >
            {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"/></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="w-16 h-16" onClick={playNext}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"/></svg>
          </Button>
          <Button variant="ghost" size="icon" className="w-16 h-16" onClick={seekForward} aria-label={t('forward_10s')}>
            <RotateCw className="w-8 h-8" />
          </Button>
        </div>
        
        {/* Extra Controls */}
        <div className="flex justify-center items-center gap-4 mt-2">
            <Button 
                variant={'outline'}
                size="icon"
                onClick={() => toggleFavorite(currentStation.id)}
                className="w-14 h-14 rounded-full"
            >
                <Star className={`transition-colors ${isFavorite ? 'text-amber-400 fill-current' : 'text-foreground'}`} />
            </Button>
        </div>
      </div>
    </motion.div>
  );
}
