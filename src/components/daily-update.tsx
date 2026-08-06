
"use client";

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '@/context/app-context';

const DailyUpdate = () => {
  const [isRead, setIsRead] = useState(false);
  const { toggleUpdatePanel } = useApp();

  const handleToggle = () => {
    toggleUpdatePanel();
    setIsRead(true);
  };

  return (
    <div 
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-card/50 backdrop-blur-md text-foreground shadow-lg cursor-pointer"
      onClick={handleToggle}
    >
      <div className="flex-shrink-0 relative">
          <Bell className="w-5 h-5 text-purple-300" />
          
          {!isRead && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          )}
      </div>
    </div>
  );
};

export default DailyUpdate;
