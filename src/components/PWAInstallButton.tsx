import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Smartphone } from 'lucide-react';
import { AppLanguage } from '../types';

interface PWAInstallButtonProps {
  language?: AppLanguage;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language = 'ml' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
          title="Install Achu AI App"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{language === 'ml' ? 'ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യൂ' : 'Install App'}</span>
        </button>
      )}

      {isIOS && !isInstallable && (
        <>
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-medium transition-all cursor-pointer"
            title="Install on iPhone / iPad"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{language === 'ml' ? 'iPhone ഇൻസ്റ്റാൾ' : 'Add to Home'}</span>
          </button>

          {showIOSGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-sm rounded-2xl bg-[#062828] border border-teal-500/40 p-5 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-teal-400" />
                    <h3 className="font-bold text-base text-white">
                      {language === 'ml' ? 'iPhone-ൽ ഇൻസ്റ്റാൾ ചെയ്യാം' : 'Install on iPhone / iPad'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowIOSGuide(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <ol className="space-y-3 text-xs sm:text-sm text-slate-300 list-decimal pl-4 mb-4">
                  <li>
                    Safari ബ്രൗസറിന്റെ താഴെയുള്ള <Share2 className="w-4 h-4 inline text-teal-400 mx-1" />{' '}
                    <strong>Share</strong> ബട്ടൺ ടാപ്പ് ചെയ്യുക.
                  </li>
                  <li>താഴേക്ക് സ്ക്രോൾ ചെയ്ത് <strong>Add to Home Screen</strong> തിരഞ്ഞെടുക്കുക.</li>
                  <li>മുകളിൽ വലതുവശത്തുള്ള <strong>Add</strong> അമർത്തുക.</li>
                </ol>

                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition"
                >
                  ശരി (OK)
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
