import React, { useState } from 'react';
import { Contact, Language } from '../types';
import { I18N } from '../data/mockData';
import {
  X,
  User,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Palette,
  Globe,
  Trash2,
  Check,
  HardDrive,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Contact;
  onUpdateUser: (updated: Partial<Contact>) => void;
  wallpaper: string;
  onSelectWallpaper: (wp: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onClearAllChats: () => void;
  onLogout: () => void;
  onOpenStorageManager?: () => void;
}

export const WALLPAPER_OPTIONS = [
  { id: 'wa-chat-bg-default', nameBn: 'ক্লাসিক ডুডল', nameEn: 'Classic Doodle', color: '#efeae2' },
  { id: 'wa-chat-bg-darkemerald', nameBn: 'ডার্ক এমারেল্ড', nameEn: 'Dark Emerald', color: '#081e1a' },
  { id: 'wa-chat-bg-midnight', nameBn: 'মিডনাইট ব্লু', nameEn: 'Midnight Blue', color: '#0d1117' },
  { id: 'wa-chat-bg-softsand', nameBn: 'সফট স্যান্ড', nameEn: 'Soft Sand', color: '#f7f3ee' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  wallpaper,
  onSelectWallpaper,
  isDarkMode,
  onToggleTheme,
  lang,
  onToggleLang,
  onClearAllChats,
  onLogout,
  onOpenStorageManager,
}) => {
  const t = I18N[lang];
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name: name.trim() || user.name, about: about.trim() || user.about });
  };

  const handleToggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      sound.playSent();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111b21] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 dark:bg-[#202c33] text-white">
          <h3 className="font-semibold text-lg">{t.settings}</h3>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Card */}
          <section className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              {t.profile}
            </h4>
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full text-base font-semibold text-slate-800 dark:text-slate-100 bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-emerald-500 outline-none pb-1"
                />
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="About / Status"
                  className="w-full text-xs text-slate-500 dark:text-slate-400 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 outline-none pt-1"
                />
              </div>
            </div>
          </section>

          {/* Zovril Unique Value Highlight */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md">
                <HardDrive className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {lang === 'bn' ? 'Zovril কেন আলাদা?' : 'Why Zovril is different'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'bn'
                    ? 'ট্রু লসলেস ফাইল • আলাদা ওয়ার্কস্পেস (ভল্ট) • বিল্ট-ইন এআই • ইন-চ্যাট টু-ডু • অ্যাডভান্সড স্টোরেজ — সব ফ্রি।'
                    : 'True Lossless files • Isolated Workspaces (Vault) • Built-in AI • In-chat To-Dos • Advanced Storage — all free.'}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Theme & Display */}
          <section className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              {t.theme} & {lang === 'bn' ? 'প্রদর্শন' : 'Display'}
            </h4>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#202c33]/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {isDarkMode ? t.darkMode : t.lightMode}
                  </span>
                  <p className="text-xs text-slate-400">
                    {isDarkMode ? 'Dark UI enabled' : 'Light UI enabled'}
                  </p>
                </div>
              </div>
              <button
                onClick={onToggleTheme}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                {lang === 'bn' ? 'পরিবর্তন করুন' : 'Toggle'}
              </button>
            </div>

            {/* Language Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#202c33]/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {t.language}
                  </span>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'বাংলা (Bangla)' : 'English'}
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5">
                <button
                  onClick={() => onToggleLang('bn')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    lang === 'bn' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => onToggleLang('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#202c33]/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                <div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {t.soundEffects}
                  </span>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'মেসেজ ও কল সাউন্ড' : 'Message & call audio'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleSound}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  soundEnabled
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {soundEnabled ? (lang === 'bn' ? 'চালু' : 'ON') : (lang === 'bn' ? 'বন্ধ' : 'OFF')}
              </button>
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Chat Wallpaper Selection */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                {t.chatWallpaper}
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {WALLPAPER_OPTIONS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => onSelectWallpaper(wp.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    wallpaper === wp.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full border border-black/10 shadow-sm shrink-0"
                      style={{ backgroundColor: wp.color }}
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {lang === 'bn' ? wp.nameBn : wp.nameEn}
                    </span>
                  </div>
                  {wallpaper === wp.id && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Storage & Zero-Footprint Cache Optimizer */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                  {lang === 'bn' ? 'জিরো-ফুটপ্রিন্ট স্টোরেজ ও ক্যাশ' : 'Zero-Footprint Storage & Cache'}
                </h4>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#202c33]/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {lang === 'bn' ? 'স্মার্ট ক্লাউড ক্যাশ ও স্টোরেজ ম্যানেজার' : 'Cloud Cache & Storage Optimizer'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'ফোনের মেমোরি খালি রাখুন ও ক্লাউড সিঙ্ক পরিচালনা করুন' : 'Keep 0 local footprint & manage cloud-first cache'}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenStorageManager?.();
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                {lang === 'bn' ? 'ম্যানেজ করুন' : 'Manage'}
              </button>
            </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Reset / Clear Data */}
          <section className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-rose-500">
              {lang === 'bn' ? 'অ্যাকাউন্ট ও ডেটা' : 'Account & Session'}
            </h4>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center gap-2 text-xs font-semibold text-rose-500 hover:text-rose-600 py-1.5 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors w-full text-left"
              >
                <span>🚪 {lang === 'bn' ? 'লগআউট করুন (Login Portal এ যান)' : 'Log out (Return to Login Portal)'}</span>
              </button>

              {showClearConfirm ? (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl space-y-2">
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {lang === 'bn'
                      ? 'আপনি কি নিশ্চিত? এটি আপনার সব চ্যাট মুছে ডিফল্ট অবস্থায় নিয়ে আসবে।'
                      : 'Are you sure? This will reset all messages and chats to initial default.'}
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-3 py-1 text-xs text-slate-600 dark:text-slate-300"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => {
                        onClearAllChats();
                        setShowClearConfirm(false);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs font-semibold bg-rose-600 text-white rounded-md hover:bg-rose-700"
                    >
                      {lang === 'bn' ? 'হ্যাঁ, রিসেট করুন' : 'Yes, Reset'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-rose-600 py-1 px-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সব চ্যাট হিস্ট্রি রিসেট করুন' : 'Reset all chats to default'}</span>
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#202c33]/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => {
              onUpdateUser({ name, about });
              onClose();
            }}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
          >
            {lang === 'bn' ? 'সম্পন্ন করুন' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
