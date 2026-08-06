"use client";

import { useApp } from "@/context/app-context";
import { History, LayoutGrid, Search, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import type { Station } from "@/types";
import ChannelCard from "../channel-card";
import { UpdatePanel } from "../update-panel";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export function HomeView() {
  const { allStations, playStation, recentlyPlayed, t, isUpdatePanelVisible, searchTerm, handleSearch, filteredStations } = useApp();
  const recentlyPlayedStations = recentlyPlayed.map(id => allStations.find(s => s.id === id)).filter(Boolean) as Station[];

  const isSearching = searchTerm.length > 0;

  return (
    <div className="space-y-8">

      <AnimatePresence>
        {isUpdatePanelVisible && <UpdatePanel />}
      </AnimatePresence>

      <section className="px-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-3 pl-12 h-14 text-base bg-white/5 border-white/10 rounded-xl focus:bg-white/10 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
        </div>
      </section>
      
      {isSearching ? (
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4"
        >
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold tracking-tight">
              {t('search_results')} {searchTerm && `"${searchTerm}"`}
            </h2>
          </div>

          {filteredStations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredStations.map((station, index) => (
                <ChannelCard 
                    key={station.id} 
                    channel={station} 
                    sourceList={filteredStations} 
                    index={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-white/5 rounded-2xl border border-white/10">
              <Wind className="w-12 h-12 mb-4 text-purple-400 opacity-50" />
              <h3 className="text-lg font-semibold text-white">{t('no_results_for', { term: searchTerm })}</h3>
              <p className="max-w-xs text-sm">{t('try_searching_something_else')}</p>
            </div>
          )}
        </motion.section>
      ) : (
        <>
          {recentlyPlayedStations.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4 px-4">
                <History className="w-6 h-6 text-purple-300" />
                <h2 className="text-xl font-bold tracking-tight">{t('recently_played')}</h2>
              </div>
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent className="-ml-2 px-4">
                  {recentlyPlayedStations.map((station) => station && (
                    <CarouselItem key={`recent-${station.id}`} className="pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                       <button onClick={() => playStation(station, recentlyPlayedStations)} className="w-full text-left group">
                        <Card className="overflow-hidden border-none bg-transparent shadow-none">
                          <CardContent className="p-0">
                            <div className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-purple-500/50 transition-all">
                                <Image
                                src={station.logoUrl}
                                alt={station.name}
                                width={150}
                                height={150}
                                className="object-cover w-full h-full transition-transform group-hover:scale-110"
                                unoptimized
                                />
                            </div>
                          </CardContent>
                        </Card>
                        <p className="text-[11px] font-medium truncate mt-2 text-center text-gray-400 group-hover:text-white transition-colors">{station.name}</p>
                       </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </section>
          )}

          <section>
            <div className="px-4 flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="w-6 h-6 text-purple-300" />
                    <h2 className="text-xl font-bold tracking-tight animate-glow">{t('all_stations')}</h2>
                </div>
            </div>

            <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {allStations.map((station, index) => (
                    <ChannelCard 
                        key={station.id} 
                        channel={station} 
                        sourceList={allStations} 
                        index={index}
                    />
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}