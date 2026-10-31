import React, { useState } from 'react';
import { Language } from '../types';
import {
  X,
  HardDrive,
  Trash2,
  Cloud,
  Smartphone,
  ShieldCheck,
  Check,
  RefreshCw,
  Sparkles,
  Database,
  ArrowRight,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface StorageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const StorageManagerModal: React.FC<StorageManagerModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [cacheRetention, setCacheRetention] = useState<'24h' | '7d' | '30d'>('7d');
  const [autoPurgeEnabled, setAutoPurgeEnabled] = useState(true);
  const [localCacheSizeMb, setLocalCacheSizeMb] = useState(38.4);
  const [cloudStorageSizeGb, setCloudStorageSizeGb] = useState(4.85);
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushSuccess, setFlushSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFlushCache = () => {
    setIsFlushing(true);
    sound.playSent();
    setTimeout(() => {
      setIsFlushing(false);
      setLocalCacheSizeMb(2.1); // Flushed down to minimal metadata only
      setFlushSuccess(true);
      setTimeout(() => setFlushSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111b21] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-600 dark:bg-[#202c33] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/20">
              <HardDrive className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {lang === 'bn' ? 'জিরো-ফুটপ্রিন্ট স্টোরেজ ও ক্যাশ অপটিমাইজার' : 'Zero-Footprint Storage & Cache'}
              </h3>
              <p className="text-xs text-emerald-100">
                {lang === 'bn' ? 'ফোনের মেমোরি খালি রাখুন · ক্লাউডে সুরক্ষিত সব ডাটা' : 'Preserve Phone Disk · 100% Cloud Synced'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs">
          {/* Visual Storage Meter */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#182229] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'bn' ? 'স্টোরেজ বণ্টন (Storage Distribution):' : 'Storage Distribution:'}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 99.2% Offloaded to Cloud
              </span>
            </div>

            {/* Progress bar visual */}
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: '92%' }}
                title="Cloud Storage"
              />
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: '8%' }}
                title="Local Phone Cache"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <span className="block font-bold text-slate-800 dark:text-slate-200">{cloudStorageSizeGb} GB</span>
                  <span className="text-[10px] text-slate-400">{lang === 'bn' ? 'ক্লাউড স্টোরেজ' : 'Cloud Stored'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <div>
                  <span className="block font-bold text-slate-800 dark:text-slate-200">{localCacheSizeMb.toFixed(1)} MB</span>
                  <span className="text-[10px] text-slate-400">{lang === 'bn' ? 'ফোনের লোকাল ক্যাশ' : 'Local RAM/Disk'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Automated Selective Cache Flushing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                  {lang === 'bn' ? 'স্বয়ংক্রিয় ক্যাশ স্ক্রাবিং (Auto-Purge)' : 'Automated Selective Cache Flushing'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'পুরনো মিডিয়া ডিলিট হলেও ক্লাউড লিঙ্ক সুরক্ষিত থাকবে' : 'Flushes local binary assets while keeping cloud access keys'}
                </span>
              </div>
              <button
                onClick={() => setAutoPurgeEnabled(!autoPurgeEnabled)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                  autoPurgeEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {autoPurgeEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {autoPurgeEnabled && (
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#182229] border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  {lang === 'bn' ? 'কতো দিন পর লোকাল ফাইল মুছবে?' : 'Flush local media older than:'}
                </span>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: '24h', label: lang === 'bn' ? '২৪ ঘণ্টা' : '24 Hours' },
                    { id: '7d', label: lang === 'bn' ? '৭ দিন' : '7 Days' },
                    { id: '30d', label: lang === 'bn' ? '৩০ দিন' : '30 Days' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCacheRetention(opt.id as typeof cacheRetention)}
                      className={`py-1.5 rounded-lg border text-center font-medium transition-colors ${
                        cacheRetention === opt.id
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Manual Flush Button */}
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
            <div>
              <span className="font-bold text-rose-700 dark:text-rose-400 block">
                {lang === 'bn' ? 'এক ক্লিকে লোকাল ক্যাশ সাফ করুন' : '1-Click Local Cache Flush'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {lang === 'bn' ? 'আপনার কোনো মেসেজ নষ্ট হবে না' : 'Free up phone storage instantly with zero message loss'}
              </span>
            </div>

            <button
              onClick={handleFlushCache}
              disabled={isFlushing || localCacheSizeMb <= 2.5}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              {isFlushing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : flushSuccess ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>{flushSuccess ? (lang === 'bn' ? 'সাফ হয়েছে!' : 'Flushed!') : lang === 'bn' ? 'ক্যাশ মুছুন' : 'Flush'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#182229] border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {lang === 'bn' ? 'সংরক্ষণ ও বন্ধ করুন' : 'Done & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
