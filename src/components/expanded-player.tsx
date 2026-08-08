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
    if (volume === 0) return <VolumeX className="w-6 h-6 text-primary" />;
    if (volume < 0.5) return <Volume1 className="w-6 h-6 text-primary" />;
    return <Volume2 className="w-6 h-6 text-primary" />;
  }

  const handleVolumeIconClick = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.5);
    }
  };

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
        <Button variant="ghost" onClick={togglePlayer} className="text-muted-foreground hover:text-white">
            <ChevronDown className="mr-2 h-5 w-5" /> {t('nav_home')}
        </Button>
        <span className="text-sm font-bold uppercase tracking-widest text-primary/80">{t('now_playing')}</span>
        <SettingsSheet />
      </div>

      {/* Artwork */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-4">
        <motion.div 
            initial={{scale: 0.8, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{delay: 0.2, type: 'spring'}}
            className="relative w-72 h-72 sm:w-96 sm:h-96"
        >
            <div className={`absolute inset-0 bg-purple-500/10 rounded-full blur-[100px] ${isPlaying ? 'animate-pulse' : ''}`}></div>
            <div className="relative w-full h-full p-4 rounded-[2.5rem] bg-gradient-to-tr from-white/5 to-white/10 border border-white/10 shadow-2xl overflow-hidden group">
               <Image
                  src={currentStation.logoUrl}
                  alt={currentStation.name}
                  width={400}
                  height={400}
                  className={`w-full h-full object-cover rounded-[2rem] shadow-lg transition-transform duration-[20s] linear ${isPlaying ? 'scale-110 rotate-3' : 'scale-100'}`}
                  unoptimized
              />
            </div>
        </motion.div>

        {/* Station Info */}
        <div className="text-center px-6">
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
          >
            {currentStation.name}
          </motion.h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base font-medium flex items-center justify-center gap-2">
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {t('live_from_amar_radio')}
          </p>
        </div>
      </div>
      
      {/* Playback Controls */}
       <div className="flex-shrink-0 flex flex-col gap-8 pb-10 max-w-lg mx-auto w-full px-4">
         {/* Volume Slider Section */}
        <div className="flex flex-col gap-2">
           <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Volume</span>
              <span className="text-[10px] font-bold text-primary">{Math.round(volume * 100)}%</span>
           </div>
           <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 shadow-inner">
            <button 
              onClick={handleVolumeIconClick}
              className="p-1 hover:scale-110 active:scale-90 transition-transform text-primary"
            >
              {getVolumeIcon()}
            </button>
            <Slider
              value={[volume * 100]}
              onValueChange={(value) => setVolume(value[0] / 100)}
              max={100}
              step={1}
              className="flex-1 cursor-pointer"
            />
            <button 
              onClick={() => setVolume(1)}
              className="p-1 hover:scale-110 active:scale-90 transition-transform text-muted-foreground hover:text-white"
            >
               <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-14 h-14 rounded-full text-muted-foreground hover:text-white hover:bg-white/5" 
                onClick={seekBackward} 
                aria-label={t('rewind_10s')}
              >
                <RotateCcw className="w-7 h-7" />
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="w-16 h-16 rounded-full text-white hover:bg-white/5" 
                onClick={playPrevious}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07c-.57.4-.57 1.24 0 1.64z"/></svg>
              </Button>

              <Button
                onClick={togglePlayPause}
                className="w-24 h-24 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-primary/20"
              >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="currentColor"><path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="w-16 h-16 rounded-full text-white hover:bg-white/5" 
                onClick={playNext}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82zM16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1z"/></svg>
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="w-14 h-14 rounded-full text-muted-foreground hover:text-white hover:bg-white/5" 
                onClick={seekForward} 
                aria-label={t('forward_10s')}
              >
                <RotateCw className="w-7 h-7" />
              </Button>
            </div>
            
            {/* Action Row */}
            <div className="flex justify-center items-center gap-12 pt-2">
                <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(currentStation.id)}
                    className={`w-12 h-12 rounded-full hover:bg-white/5 ${isFavorite ? 'text-amber-400' : 'text-muted-foreground'}`}
                >
                    <Star className={`h-6 w-6 transition-colors ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                
                <div className="h-10 w-px bg-white/10"></div>
                
                <SettingsSheet />
            </div>
        </div>
      </div>
    </motion.div>
  );
}
