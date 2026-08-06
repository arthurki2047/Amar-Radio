"use client";

import React from "react";
import { useApp } from "@/context/app-context";
import { Station } from "@/types";
import { ListMusic, Newspaper, VenetianMask, MicVocal, Library } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import ChannelCard from "../channel-card";

type CategoryDef = {
  id: 'music' | 'news' | 'bhakti' | 'artist' | 'bangla_music';
  labelKey: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
};

const categoriesDef: CategoryDef[] = [
  { id: 'music', labelKey: 'category_music', icon: <ListMusic />, color: 'text-sky-300', gradient: 'from-sky-500/20 to-blue-500/10' },
  { id: 'bangla_music', labelKey: 'category_bangla_music', icon: <Library />, color: 'text-rose-300', gradient: 'from-rose-500/20 to-red-500/10' },
  { id: 'news', labelKey: 'category_news', icon: <Newspaper />, color: 'text-emerald-300', gradient: 'from-emerald-500/20 to-green-500/10' },
  { id: 'bhakti', labelKey: 'category_bhakti', icon: <VenetianMask />, color: 'text-amber-300', gradient: 'from-amber-500/20 to-orange-500/10' },
  { id: 'artist', labelKey: 'category_artists', icon: <MicVocal />, color: 'text-fuchsia-300', gradient: 'from-fuchsia-500/20 to-purple-500/10' },
];

export function CategoriesView() {
  const { allStations, playStation, setView, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<CategoryDef | null>(null);

  const categories = categoriesDef.map(cat => ({...cat, name: t(cat.labelKey)}));

  const stationsForCategory = useMemo(() => {
    if (!selectedCategory) return [];
    return allStations.filter(station => station.category === selectedCategory.id);
  }, [selectedCategory, allStations]);


  const handleCategoryClick = (category: CategoryDef) => {
    if (category.id === 'artist') {
        setView('ARTISTS');
        return;
    }
    setSelectedCategory(category);
  };

  if (selectedCategory) {
    return (
      <div className="p-4">
        <button onClick={() => setSelectedCategory(null)} className="mb-6 text-primary font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          {t('back_to_categories')}
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-purple-400/20 ${selectedCategory.color}`}>
              {selectedCategory.icon}
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">{t(selectedCategory.labelKey)}</h1>
        </div>

        {stationsForCategory.length > 0 ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {stationsForCategory.map((station, index) => (
              <ChannelCard 
                key={station.id} 
                channel={station} 
                sourceList={stationsForCategory} 
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10">{t('no_stations_for_category')}</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 tracking-tighter">{t('browse_categories')}</h1>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className={`
              relative p-6 rounded-2xl cursor-pointer transition-all duration-300
              flex flex-col items-center justify-center gap-3 text-center
              bg-gradient-to-br ${cat.gradient}
              border border-white/10 shadow-lg
              hover:scale-105 hover:shadow-xl hover:border-white/20
            `}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-black/20 ${cat.color}`}>
              {React.cloneElement(cat.icon as React.ReactElement, { className: 'w-6 h-6'})}
            </div>
            <span className="font-semibold text-white mt-1">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}