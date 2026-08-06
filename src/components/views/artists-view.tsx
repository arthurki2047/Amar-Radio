
"use client";

import { useApp } from "@/context/app-context";
import { Station } from "@/types";
import Image from "next/image";
import { useState, useMemo } from "react";

export function ArtistsView() {
  const { allStations, playStation, setView, t } = useApp();
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const artists = useMemo(() => {
    const artistMap = new Map<string, { station: Station }>();
    allStations.forEach(station => {
      if (station.artist && !artistMap.has(station.artist)) {
        artistMap.set(station.artist, { station });
      }
    });
    return Array.from(artistMap.entries()).map(([name, data]) => ({
      name,
      logoUrl: data.station.logoUrl, 
    }));
  }, [allStations]);

  const stationsForArtist = useMemo(() => {
    if (!selectedArtist) return [];
    return allStations.filter(station => station.artist === selectedArtist);
  }, [selectedArtist, allStations]);

  const handleArtistClick = (artistName: string) => {
    setSelectedArtist(artistName);
  };

  if (selectedArtist) {
    return (
      <div className="p-4">
        <button onClick={() => setSelectedArtist(null)} className="mb-4 text-primary font-semibold">
          &larr; {t('back_to_artists')}
        </button>
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <Image
              src={artists.find(a => a.name === selectedArtist)?.logoUrl || ''}
              alt={selectedArtist}
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
          />
          {selectedArtist}
        </h1>
        {stationsForArtist.length > 0 ? (
          <ul className="space-y-2">
            {stationsForArtist.map(station => (
              <li key={station.id} className="flex items-center gap-3 p-2 rounded-lg bg-card hover:bg-muted cursor-pointer" onClick={() => playStation(station, stationsForArtist)}>
                 <Image
                    src={station.logoUrl}
                    alt={station.name}
                    width={48}
                    height={48}
                    className="rounded-md"
                    unoptimized
                />
                <span className="font-semibold flex-1 truncate">{station.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">{t('no_stations_for_artist')}</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
       <button onClick={() => setView('CATEGORIES')} className="mb-4 text-primary font-semibold">
          &larr; {t('back_to_categories')}
        </button>
      <h1 className="text-2xl font-bold mb-6">{t('browse_artists')}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <div
            key={artist.name}
            onClick={() => handleArtistClick(artist.name)}
            className="p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-sm flex flex-col items-center justify-center gap-2 bg-card text-card-foreground"
          >
            <Image
                src={artist.logoUrl}
                alt={artist.name}
                width={80}
                height={80}
                className="rounded-full"
                unoptimized
            />
            <span className="font-semibold text-center mt-2">{artist.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
