
'use client';

import { useState, useEffect } from 'react';

export function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timerId = setInterval(updateClock, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>{time}</span>
    </div>
  );
}
