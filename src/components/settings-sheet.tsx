
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useApp } from "@/context/app-context";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const timerOptions = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "60 minutes" },
];

export function SettingsSheet() {
  const { sleepTimerDuration, setSleepTimer, t } = useApp();
  const [customMinutes, setCustomMinutes] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleTimerChange = (value: string) => {
    setCustomMinutes("");
    const duration = parseInt(value, 10);
    setSleepTimer(duration);
    setIsSheetOpen(false);
  };

  const handleCustomTimer = () => {
    const duration = parseInt(customMinutes, 10);
    if (duration > 0) {
      setSleepTimer(duration);
      setIsSheetOpen(false);
    }
  };
  
  const handleCancelTimer = () => {
    setSleepTimer(null);
    setIsSheetOpen(false);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Timer className="h-6 w-6" />
          <span className="sr-only">Open Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('settings_title')}</SheetTitle>
        </SheetHeader>
        <div className="py-4 grid gap-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Timer className="w-5 h-5"/>{t('sleep_timer_title')}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                    {t('sleep_timer_desc')}
                </p>
                <RadioGroup
                    onValueChange={handleTimerChange}
                    value={
                    sleepTimerDuration && !customMinutes
                        ? String(sleepTimerDuration)
                        : ""
                    }
                >
                    {timerOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(option.value)} id={`timer-${option.value}`} />
                        <Label htmlFor={`timer-${option.value}`}>{t(`timer_${option.value}m`)}</Label>
                    </div>
                    ))}
                </RadioGroup>
                <div className="flex items-center gap-2 mt-4">
                    <Input
                    type="number"
                    placeholder={t('custom_minutes_placeholder')}
                    value={customMinutes}
                    onChange={(e) => {
                        setCustomMinutes(e.target.value);
                        // Clear radio selection when typing custom
                        if (sleepTimerDuration) setSleepTimer(null);
                    }}
                    className="flex-1"
                    />
                    <Button onClick={handleCustomTimer} disabled={!customMinutes}>{t('set_button')}</Button>
                </div>
                {sleepTimerDuration && (
                    <div className="text-center mt-4">
                        <p className="text-sm text-primary">{t('timer_active_desc', {duration: sleepTimerDuration})}</p>
                        <Button variant="destructive" className="mt-2" onClick={handleCancelTimer}>{t('cancel_timer_button')}</Button>
                    </div>
                )}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
