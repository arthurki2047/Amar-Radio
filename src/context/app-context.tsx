
"use client";

import { createContext, useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { Language, Station, View } from '@/types';
import { stations as staticStations } from '@/lib/stations';
import { useToast } from "@/hooks/use-toast";
import { translations } from '@/lib/translations';
import { useUser, useDoc, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const MAX_RECENTLY_PLAYED = 10;
const PUBLIC_STATION_IDS = ['s9', 's10', 's15'];
const ADMIN_EMAIL = 'arthurki2047@gmail.com';

interface AppContextType {
  view: View;
  setView: (view: View) => void;
  allStations: Station[];
  currentStation: Station | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isPlayerExpanded: boolean;
  favorites: string[];
  recentlyPlayed: string[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
  volume: number;
  setVolume: (volume: number) => void;
  playStation: (station: Station, contextList?: Station[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekForward: () => void;
  seekBackward: () => void;
  togglePlayer: () => void;
  toggleFavorite: (stationId: string) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  isUpdatePanelVisible: boolean;
  toggleUpdatePanel: () => void;
  searchTerm: string;
  handleSearch: (term: string) => void;
  filteredStations: Station[];
  syncStationsToFirestore: () => void;
  isAuthDialogOpen: boolean;
  setIsAuthDialogOpen: (open: boolean) => void;
  sleepTimerDuration: number | null;
  setSleepTimer: (minutes: number | null) => void;
  isAdmin: boolean;
  announcement: string;
  updateAnnouncement: (text: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [view, setView] = useState<View>('HOME');
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [activeQueue, setActiveQueue] = useState<Station[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const [language, setLanguageState] = useState<Language>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playIdRef = useRef(0);
  const isUserPaused = useRef(false);
  const [volume, setVolumeState] = useState(1);
  const [sleepTimerDuration, setSleepTimerDuration] = useState<number | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const isAdmin = useMemo(() => {
    return !!user && user.email === ADMIN_EMAIL;
  }, [user]);

  // Firestore sync for stations
  const stationsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'radioStations');
  }, [db]);

  const { data: dbStations } = useCollection<Station>(stationsRef);

  const allStations = useMemo(() => {
    if (dbStations && dbStations.length > 0) {
      return dbStations;
    }
    return staticStations;
  }, [dbStations]);

  // Firestore sync for global announcement
  const announcementRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'announcement');
  }, [db]);

  const { data: announcementData } = useDoc<{ value: string }>(announcementRef);
  const announcement = announcementData?.value || translations[language]['welcome_message'] || "Welcome to Amar Radio!";

  const updateAnnouncement = useCallback((text: string) => {
    if (!announcementRef || !isAdmin) return;
    setDocumentNonBlocking(announcementRef, { id: 'announcement', value: text }, { merge: true });
    toast({ title: "Announcement updated!" });
  }, [announcementRef, isAdmin, toast]);

  // User profile logic
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, 'users', user.uid);
  }, [db, user?.uid]);

  const { data: userProfile } = useDoc(userRef);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.favoriteStationIds) {
        setFavorites(userProfile.favoriteStationIds);
      }
      if (userProfile.lastPlayedStationId && !currentStation) {
        const lastStation = allStations.find(s => s.id === userProfile.lastPlayedStationId);
        if (lastStation) {
          setCurrentStation(lastStation);
        }
      }
    }
  }, [userProfile, allStations, currentStation]);

  useEffect(() => {
    if (user && userRef && !isUserLoading) {
      setDocumentNonBlocking(userRef, {
        id: user.uid,
        email: user.email,
        phoneNumber: user.phoneNumber || null,
        username: user.displayName || user.email?.split('@')[0],
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  }, [user, userRef, isUserLoading]);

  // Sync state with audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    let translation = translations[language][key] || translations['en'][key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
            translation = translation.replace(`{${k}}`, String(v));
        });
    }
    return translation;
  }, [language]);

  const playStation = useCallback((station: Station, contextList?: Station[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!user && !PUBLIC_STATION_IDS.includes(station.id)) {
      setIsAuthDialogOpen(true);
      toast({
        title: t('auth_required_title'),
        description: t('auth_required_desc'),
        variant: 'destructive',
      });
      return;
    }

    const thisPlayId = ++playIdRef.current;
    isUserPaused.current = false;
    
    setCurrentStation(station);
    setActiveQueue(contextList || allStations);

    setRecentlyPlayed(prev => {
        const newRecentlyPlayed = [station.id, ...prev.filter(id => id !== station.id)];
        return newRecentlyPlayed.slice(0, MAX_RECENTLY_PLAYED);
    });

    if (userRef && user) {
      setDocumentNonBlocking(userRef, { 
        id: user.uid,
        lastPlayedStationId: station.id 
      }, { merge: true });
    }

    if (audio.src !== station.streamUrl) {
        audio.src = station.streamUrl;
        audio.load();
    }
    
    audio.play().then(() => {
        if (playIdRef.current === thisPlayId) setIsPlaying(true);
    }).catch(() => {
        if (playIdRef.current === thisPlayId) setIsPlaying(false);
    });

  }, [allStations, userRef, user, t, toast]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!currentStation || !audio) return;
    if (isPlaying) {
      isUserPaused.current = true;
      audio.pause();
    } else {
      isUserPaused.current = false;
      playStation(currentStation, activeQueue);
    }
  }, [currentStation, isPlaying, playStation, activeQueue]);

  const playNext = useCallback(() => {
    if (!currentStation || activeQueue.length === 0) return;
    const currentIndex = activeQueue.findIndex(s => s.id === currentStation.id);
    const nextIndex = (currentIndex + 1) % activeQueue.length;
    playStation(activeQueue[nextIndex], activeQueue);
  }, [currentStation, activeQueue, playStation]);

  const playPrevious = useCallback(() => {
    if (!currentStation || activeQueue.length === 0) return;
    const currentIndex = activeQueue.findIndex(s => s.id === currentStation.id);
    const prevIndex = (currentIndex - 1 + activeQueue.length) % activeQueue.length;
    playStation(activeQueue[prevIndex], activeQueue);
  }, [currentStation, activeQueue, playStation]);

  const seekForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  }, []);

  const seekBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  }, []);

  const toggleFavorite = useCallback((stationId: string) => {
    setFavorites(currentFavorites => {
      const isFav = currentFavorites.includes(stationId);
      const newFavorites = isFav ? currentFavorites.filter(id => id !== stationId) : [...currentFavorites, stationId];

      if (userRef && user) {
        setDocumentNonBlocking(userRef, { 
          id: user.uid,
          favoriteStationIds: newFavorites 
        }, { merge: true });
      }
      
      toast({
        title: isFav ? t('favorite_removed') : t('favorite_added'),
        variant: isFav ? 'destructive' : 'default',
      });

      return newFavorites;
    });
  }, [t, toast, userRef, user]);

  const setSleepTimer = useCallback((minutes: number | null) => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }

    setSleepTimerDuration(minutes);

    if (minutes !== null) {
      timerIdRef.current = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
          toast({
            title: t('sleep_timer_finished_title'),
            description: t('sleep_timer_finished_desc'),
          });
        }
        setSleepTimerDuration(null);
      }, minutes * 60 * 1000);

      toast({
        title: t('sleep_timer_set_title'),
        description: t('sleep_timer_set_desc', { duration: minutes }),
      });
    } else {
      toast({
        title: t('sleep_timer_canceled'),
      });
    }
  }, [t, toast]);

  const syncStationsToFirestore = useCallback(() => {
    if (!db || !user || !isAdmin) {
      toast({
        title: t('auth_required_title'),
        description: t('auth_required_desc'),
        variant: 'destructive',
      });
      return;
    }

    staticStations.forEach((station) => {
      const stationDocRef = doc(db, 'radioStations', station.id);
      setDocumentNonBlocking(stationDocRef, station, { merge: true });
    });

    toast({
      title: t('catalog_sync_success_title'),
      description: t('catalog_sync_success_desc'),
    });
  }, [db, user, isAdmin, toast, t]);

  const [isUpdatePanelVisible, setIsUpdatePanelVisible] = useState(true);

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if(audioRef.current) audioRef.current.volume = newVolume;
  };

  const togglePlayer = useCallback(() => setIsPlayerExpanded(prev => !prev), []);
  const handleSearch = useCallback((term: string) => setSearchTerm(term), []);
  const toggleUpdatePanel = useCallback(() => setIsUpdatePanelVisible(prev => !prev), []);
  const setLanguage = useCallback((lang: Language) => setLanguageState(lang), []);
  
  const filteredStations = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return allStations.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.category?.toLowerCase().includes(term) ||
      s.artist?.toLowerCase().includes(term)
    );
  }, [allStations, searchTerm]);

  const value = {
    view, setView, allStations, currentStation, isPlaying, setIsPlaying,
    isPlayerExpanded, favorites, recentlyPlayed, audioRef, volume, setVolume, playStation,
    togglePlayPause, playNext, playPrevious, seekForward, seekBackward, 
    togglePlayer, toggleFavorite, 
    language, setLanguage, t, isUpdatePanelVisible, toggleUpdatePanel,
    searchTerm, handleSearch, filteredStations, syncStationsToFirestore,
    isAuthDialogOpen, setIsAuthDialogOpen,
    sleepTimerDuration, setSleepTimer, isAdmin,
    announcement, updateAnnouncement
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
