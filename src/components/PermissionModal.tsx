import React from 'react';
import { MicOff, AlertCircle, X, RefreshCw } from 'lucide-react';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  errorMessage?: string;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  errorMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0c1424] border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(6,214,235,0.25)] text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <MicOff className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Microphone Access Needed</h3>
            <p className="text-xs text-slate-400">To talk with the AI voice assistant</p>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-sm text-slate-300">
          <p className="text-slate-300">
            {errorMessage ||
              'Your browser blocked microphone access. To converse in real-time, please enable your microphone:'}
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="font-bold text-cyan-400">1.</span>
              <span>Look for the <strong>tune / lock / camera-mic</strong> icon in your browser address bar.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-cyan-400">2.</span>
              <span>Set <strong>Microphone</strong> permissions to <strong>Allow</strong>.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-cyan-400">3.</span>
              <span>Click <strong>Retry Connection</strong> below.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/80 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(6,214,235,0.4)]"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
};
