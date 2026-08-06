"use client";

import { useApp } from '@/context/app-context';
import { FavoritesView } from '@/components/views/favorites-view';
import { BottomNav } from '@/components/bottom-nav';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/loading-screen';
import { HomeView } from '@/components/views/home-view';
import { CategoriesView } from '@/components/views/categories-view';
import { ArtistsView } from '@/components/views/artists-view';
import { AdminView } from '@/components/views/admin-view';
import { StatusBar } from '@/components/status-bar';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PlayerControl from '@/components/player-control';
import DailyUpdate from '@/components/daily-update';
import { ExpandedPlayer } from '@/components/expanded-player';
import { NowPlayingBar } from '@/components/now-playing-bar';
import { LanguageSwitcher } from '@/components/language-switcher';
import { AuthButton } from '@/components/auth-button';

function AppContent() {
  const { view, setView, isPlayerExpanded, t } = useApp();
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: t('app_title'),
      text: t('share_text'),
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Share was cancelled, do nothing.
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: t('link_copied_title'),
          description: t('link_copied_desc'),
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: t('failed_to_copy_title'),
          description: t('failed_to_copy_desc'),
        });
      }
    }
  };


  const renderView = () => {
    switch (view) {
      case 'HOME':
        return <HomeView />;
      case 'FAVORITES':
        return <FavoritesView />;
      case 'CATEGORIES':
        return <CategoriesView />;
      case 'ARTISTS':
        return <ArtistsView />;
      case 'ADMIN':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  };
  
  return (
    <div className="h-screen w-screen flex flex-col bg-background font-sans text-foreground">
      <AnimatePresence>
        {isPlayerExpanded && <ExpandedPlayer />}
      </AnimatePresence>
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-background/80 backdrop-blur-sm z-10 sticky top-0 border-b border-white/10">
        <AnimatePresence mode="wait">
            <motion.div
              key="title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <h1 className="text-2xl font-bold tracking-tighter" onClick={() => setView('HOME')} style={{ cursor: 'pointer' }}>
                Amar <span className="text-purple-400">Radio</span>
              </h1>
            </motion.div>
          </AnimatePresence>

        <div className="flex items-center gap-2">
            <DailyUpdate />
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Button onClick={handleShare} variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share App</span>
            </Button>
            <AuthButton />
            <StatusBar />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pt-6 pb-48">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <NowPlayingBar />
      <PlayerControl />
      <BottomNav />
    </div>
  );
}


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);


  return (
    <AnimatePresence>
      {isLoading ? (
        <LoadingScreen key="loader" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AppContent />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
