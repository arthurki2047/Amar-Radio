
"use client";

import { useApp } from "@/context/app-context";
import Image from 'next/image';
import { Play, Star, Search, Wind } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChannelCard from "../channel-card";

export function SearchView() {
  const { 
    searchTerm, 
    handleSearch, 
    filteredStations, 
    playStation,
    t
  } = useApp();

  return (
    <div className="p-4">
       <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-400/20 text-blue-400">
              <Search className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">{t('search_title')}</h1>
       </div>
       
       <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          type="text"
          placeholder={t('search_placeholder')}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 pl-12 h-14 text-base bg-white/5 border-white/10 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        />
       </div>

      {filteredStations.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredStations.map((station) => (
            <ChannelCard 
                key={station.id} 
                channel={station} 
                sourceList={filteredStations} 
            />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground p-8 rounded-2xl bg-white/5 border border-white/10">
          <Wind className="w-16 h-16 mb-4 text-purple-400" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? t('no_results_for', { term: searchTerm }) : t('find_your_vibe_title')}
          </h3>
          <p className="max-w-xs">
            {searchTerm ? t('try_searching_something_else') : t('find_your_vibe_desc')}
          </p>
        </div>
      )}
    </div>
  );
}
