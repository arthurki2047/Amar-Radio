"use client";

import { useApp } from "@/context/app-context";
import Image from 'next/image';
import { Star, Play, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Station } from "@/types";
import ChannelCard from "../channel-card";

export function FavoritesView() {
  const { favorites, allStations, playStation, t } = useApp();
  const favoriteStations = allStations.filter(s => favorites.includes(s.id)) as Station[];

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-400/20 text-amber-400">
           <Star className="w-6 h-6 fill-current" />
        </div>
        <h2 className="text-3xl font-bold tracking-tighter">{t('favorites_title')}</h2>
      </div>

      {favoriteStations.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favoriteStations.map((station, index) => (
            <ChannelCard 
                key={station.id} 
                channel={station} 
                sourceList={favoriteStations} 
                index={index}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground p-8 rounded-2xl bg-white/5 border border-white/10">
          <Music className="w-16 h-16 mb-4 text-purple-400" />
          <h3 className="text-xl font-semibold text-white mb-2">{t('no_favorites_title')}</h3>
          <p className="max-w-xs">{t('no_favorites_desc')}</p>
        </div>
      )}
    </div>
  );
}