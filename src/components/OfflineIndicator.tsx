import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';
import { AppLanguage } from '../types';

interface OfflineIndicatorProps {
  language?: AppLanguage;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language = 'ml' }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 text-slate-950 text-xs font-bold shadow-lg backdrop-blur-md border border-amber-300 animate-bounce">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        {language === 'ml'
          ? 'ഓഫ്‌ലൈൻ മോഡ് — ഫിസിക്സ് ക്ലാസ്സും ക്വിസ്സും ലഭ്യമാണ്'
          : 'Offline Mode — Physics Class & Quiz available'}
      </span>
    </div>
  );
};
