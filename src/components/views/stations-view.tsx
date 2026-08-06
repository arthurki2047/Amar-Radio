
"use client";

import { useApp } from "@/context/app-context";
import Image from 'next/image';
import { Play, Star, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import type { Station } from "@/types";

export function StationsView() {
  const { allStations, playStation, toggleFavorite, favorites, recentlyPlayed } = useApp();
  const recentlyPlayedStations = recentlyPlayed.map(id => allStations.find(s => s.id === id)).filter(Boolean) as Station[];

  return (
    <div className="p-4 space-y-6">
      {recentlyPlayedStations.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-6 h-6" />
            <h2 className="text-2xl font-headline font-bold">Recently Played</h2>
          </div>
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2">
              {recentlyPlayedStations.map((station) => station && (
                <CarouselItem key={`recent-${station.id}`} className="pl-2 basis-1/3 md:basis-1/5 lg:basis-1/6">
                   <button onClick={() => playStation(station, recentlyPlayedStations)} className="w-full text-left group">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <Image
                          src={station.logoUrl}
                          alt={station.name}
                          width={150}
                          height={150}
                          className="aspect-square object-cover w-full h-full transition-transform group-hover:scale-110"
                          unoptimized
                           data-ai-hint={station.id === 's12' ? 'Hazarduari Palace' : undefined}
                        />
                      </CardContent>
                    </Card>
                    <p className="text-sm font-semibold truncate mt-2">{station.name}</p>
                   </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </section>
      )}

      {recentlyPlayedStations.length > 0 && <Separator />}

      <section>
        <h2 className="text-2xl font-headline font-bold mb-4">All Stations</h2>
        <ul className="space-y-2">
          {allStations.map((station, index) => (
            <li
              key={station.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-card"
            >
               <span className="text-muted-foreground font-mono text-sm w-6 text-center">{index + 1}</span>
              <Image
                  src={station.logoUrl}
                  alt={station.name}
                  width={48}
                  height={48}
                  className="rounded-md"
                  unoptimized
                  data-ai-hint={station.id === 's12' ? 'Hazarduari Palace' : undefined}
              />
              <span className="font-semibold flex-1 truncate">{station.name}</span>
              <Button size="icon" variant="ghost" onClick={() => toggleFavorite(station.id)}>
                <Star className={`w-5 h-5 ${favorites.includes(station.id) ? 'text-amber-400 fill-current' : 'text-muted-foreground'}`} />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => playStation(station, allStations)}>
                <Play className="w-5 h-5" />
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
