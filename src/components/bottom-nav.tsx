
"use client";

import { useApp } from "@/context/app-context";
import type { View } from "@/types";
import { Home, ListMusic, Search, Star, Grid3X3 } from "lucide-react";

function NavButton({ label, icon, isActive, onClick }: { label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors ${
        isActive ? 'text-blue-800 font-bold bg-white/50' : 'text-slate-800 hover:text-black'
      }`}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
}


export function BottomNav() {
  const { view, setView, t } = useApp();

  const navItems: { view: View; labelKey: string; icon: React.ReactNode }[] = [
    { view: "HOME", labelKey: "nav_home", icon: <Home /> },
    { view: "FAVORITES", labelKey: "nav_favorites", icon: <Star /> },
    { view: "CATEGORIES", labelKey: "nav_categories", icon: <Grid3X3 /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-orange-400 via-white to-green-500 z-40">
       <div className="flex justify-around items-center h-full max-w-md mx-auto">
          {navItems.map((item) => (
            <NavButton
              key={item.view}
              label={t(item.labelKey)}
              icon={item.icon}
              isActive={view === item.view}
              onClick={() => setView(item.view)}
            />
          ))}
       </div>
    </nav>
  );
}
