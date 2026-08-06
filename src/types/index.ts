
export interface Station {
  id: string;
  name: string;
  streamUrl: string;
  logoUrl: string;
  category?: 'music' | 'news' | 'bhakti' | 'bangla_music';
  artist?: string;
}

export type View = 'HOME' | 'STATIONS' | 'FAVORITES' | 'CATEGORIES' | 'ARTISTS' | 'ADMIN';

export type Language = 'en' | 'hi' | 'bn';

export type Translations = {
    [lang in Language]: {
        [key: string]: string;
    }
}
