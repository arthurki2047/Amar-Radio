'use client';

import { useApp } from '@/context/app-context';
import type { Station } from '@/types';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Button } from './ui/button';

const ChannelCard = ({ 
  channel, 
  sourceList, 
  index 
}: { 
  channel: Station; 
  sourceList: Station[]; 
  index?: number; 
}) => {
  const { playStation, currentStation, isPlaying, toggleFavorite, favorites, t } = useApp();
  
  const isCurrent = currentStation?.id === channel.id;
  const isFavorite = favorites.includes(channel.id);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    playStation(channel, sourceList); 
  };
  
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleFavorite(channel.id);
  }

  return (
    <div 
      onClick={handleCardClick}
      className={`
        group relative p-3 rounded-[1.5rem] cursor-pointer overflow-hidden transition-all duration-500 ease-out
        backdrop-blur-md
        border border-white/10
        shadow-xl
        bg-gradient-to-br from-orange-600/10 via-white/5 to-green-600/10
        hover:-translate-y-2
        hover:from-orange-600/20 hover:via-white/10 hover:to-green-600/20
        hover:border-white/20
        hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]
        ${isCurrent ? 'ring-2 ring-orange-500/80 bg-orange-900/20 shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)]' : ''}
      `}
    >
        {/* Serial Number Badge */}
        {index !== undefined && (
          <div className="absolute top-3 left-3 z-20 h-6 w-6 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-white border border-white/20 shadow-lg group-hover:bg-purple-600/80 transition-colors">
            {index + 1}
          </div>
        )}

        <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleFavoriteClick}
            className="absolute top-1 right-1 z-20 h-8 w-8 rounded-full bg-black/20 hover:bg-black/50"
        >
            <Star className={`w-5 h-5 transition-colors ${isFavorite ? 'text-amber-400 fill-current' : 'text-gray-400 group-hover:text-white'}`} />
        </Button>
      
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-900/50 shadow-inner">
        <Image 
          src={channel.logoUrl} 
          alt={channel.name} 
          width={150}
          height={150}
          unoptimized
          className={`w-full h-full object-cover transition-transform duration-700 ease-in-out 
            ${isCurrent ? 'scale-110 blur-[2px]' : 'group-hover:scale-110 group-hover:blur-[1px]'}`} 
        />
        
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300 
          ${isCurrent ? 'opacity-100 bg-black/50' : 'opacity-0 group-hover:opacity-100'}`}>
          
          {isCurrent && isPlaying ? (
             <div className="flex items-end gap-1 h-8">
                <span className="w-1.5 bg-[#FF9933] rounded-full animate-[music-bar_1s_ease-in-out_infinite]"></span>
                <span className="w-1.5 bg-white rounded-full animate-[music-bar_1s_ease-in-out_0.2s_infinite]"></span>
                <span className="w-1.5 bg-[#138808] rounded-full animate-[music-bar_1s_ease-in-out_0.4s_infinite]"></span>
             </div>
          ) : (
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-2xl group-active:scale-90 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1 drop-shadow-lg">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
            </div>
          )}
        </div>
      </div>

      <div className="text-left px-1">
        <h3 className={`font-bold text-base sm:text-lg truncate transition-colors duration-300 tracking-tight
          ${isCurrent ? 'text-orange-200 drop-shadow-sm' : 'text-white group-hover:text-purple-200'}`}>
          {channel.name}
        </h3>
        
        <div className="mt-2 flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider py-1 px-2 rounded-md backdrop-blur-md
                ${isCurrent ? 'bg-gradient-to-r from-[#FF9933] via-white/40 to-[#138808] text-black' : 'bg-white/5 text-gray-300 group-hover:bg-white/10'}
            `}>
               {isCurrent ? t('now_playing') : t('live_radio')}
            </span>
            
            {isCurrent && (
                 <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
            )}
        </div>
      </div>

      <div className={`absolute -top-20 -left-20 w-40 h-40 blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isCurrent ? 'bg-orange-600/20' : 'bg-green-600/20'}`}></div>
    </div>
  );
};

export default ChannelCard;