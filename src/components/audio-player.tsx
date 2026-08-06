
"use client";

import { useApp } from '@/context/app-context';
import { useEffect } from 'react';

function AudioPlayer() {
  const { 
    audioRef,
    volume,
  } = useApp();

  // The audio element is now mostly controlled by the AppContext
  // We just need to set its initial volume.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  return (
    <audio 
      ref={audioRef} 
      className="hidden" 
      crossOrigin="anonymous" 
    />
  );
}

export default AudioPlayer;
