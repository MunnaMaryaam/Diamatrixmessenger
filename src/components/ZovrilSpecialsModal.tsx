import React from 'react';
import { Language } from '../types';
import {
  X,
  ShieldCheck,
  Sparkles,
  HardDrive,
  Layers,
  FileCheck2,
  Lock,
  Zap,
  Globe2,
  CheckCircle2,
  ArrowRight,
  Crown,
} from 'lucide-react';

interface ZovrilSpecialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenLossless?: () => void;
  onOpenAi?: () => void;
  onOpenProductivity?: () => void;
  onOpenStorage?: () => void;
}

const FEATURES = [
  {
    id: 'lossless',
    icon: FileCheck2,
    color: 'from-emerald-500 to-teal-600',
    titleBn: 'ট্রু লসলেস ফাইল শেয়ার',
    titleEn: 'True Lossless File Share',
    descBn: 'ছবি, ভিডিও, ZIP, APK বা যেকোনো ফাইল ১০০% অরিজিনাল কোয়ালিটিতে পাঠান। কোনো কম্প্রেশন নেই — WhatsApp-এর মতো রেজুলেশন নষ্ট হয় না।',
    descEn: 'Send photos, videos, ZIP, APK or any file in 100% original quality. Zero compression — no quality loss like other messengers.',
    badge: 'EXCLUSIVE',
  },
  {
    id: 'workspace',
    icon: Layers,
    color: 'from-violet-500 to-purple-600',
    titleBn: 'ওয়ার্কস্পেস এনভায়রনমেন্ট',
    titleEn: 'Isolated Workspaces',
    descBn: 'ব্যক্তিগত, অফিস, ফ্যামিলি ও ভল্ট — চারটি আলাদা ওয়ার্কস্পেস। কাজের চ্যাট আর পরিবারের চ্যাট মিশে না। ভল্টে সিক্রেট কনভারসেশন রাখুন।',
    descEn: 'Personal, Office, Family & Vault — four isolated environments. Work chats never mix with family. Keep secret conversations in Vault.',
    badge: 'UNIQUE',
  },
  {
    id: 'ai',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-600',
    titleBn: 'বিল্ট-ইন এআই অ্যাসিস্ট্যান্ট',
    titleEn: 'Built-in AI Assistant',
    descBn: 'চ্যাটের ভিতরেই স্মার্ট এআই। অনুবাদ, সারাংশ, কোডিং হেল্প, আইডিয়া জেনারেশন — সব এক জায়গায়। বাংলায়ও পারফেক্ট সাপোর্ট।',
    descEn: 'Smart AI inside every chat. Translation, summaries, coding help, idea generation — all in one place. Perfect Bangla support too.',
    badge: 'POWER',
  },
  {
    id: 'productivity',
    icon: Zap,
    color: 'from-blue-500 to-cyan-600',
    titleBn: 'ইন-চ্যাট প্রোডাক্টিভিটি',
    titleEn: 'In-Chat Productivity',
    descBn: 'কথোপকথনের সাথেই টু-ডু লিস্ট ও নোট তৈরি করুন। মিটিং থেকে সরাসরি টাস্ক বানান। আর কোনো আলাদা অ্যাপের দরকার নেই।',
    descEn: 'Create to-do lists and notes linked to conversations. Turn meeting talks into tasks instantly. No need for another app.',
    badge: 'SMART',
  },
  {
    id: 'storage',
    icon: HardDrive,
    color: 'from-rose-500 to-pink-600',
    titleBn: 'অ্যাডভান্সড স্টোরেজ ম্যানেজার',
    titleEn: 'Advanced Storage Manager',
    descBn: 'কোন চ্যাটে কত জায়গা নিচ্ছে দেখুন, বড় ফাইল খুঁজে বের করুন এবং এক ক্লিকে পরিষ্কার করুন। স্টোরেজ নিয়ন্ত্রণ আপনার হাতে।',
    descEn: 'See exactly which chat uses how much space, find large files and clean them with one click. Full control over storage.',
    badge: 'PRO',
  },
  {
    id: 'security',
    icon: ShieldCheck,
    color: 'from-green-500 to-emerald-700',
    titleBn: 'এন্ড-টু-এন্ড এনক্রিপশন + ভল্ট',
    titleEn: 'E2E Encryption + Vault',
    descBn: 'সব মেসেজ ও কল এন্ড-টু-এন্ড এনক্রিপ্টেড। ভল্ট ওয়ার্কস্পেসে অতিরিক্ত সুরক্ষা। আপনার কথা শুধু আপনি ও প্রাপক জানবেন।',
    descEn: 'All messages & calls are end-to-end encrypted. Extra protection inside Vault workspace. Only you and the recipient can read.',
    badge: 'SECURE',
  },
];

export const ZovrilSpecialsModal: React.FC<ZovrilSpecialsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenLossless,
  onOpenAi,
  onOpenProductivity,
  onOpenStorage,
}) => {
  if (!isOpen) return null;

  const handleFeatureClick = (id: string) => {
    onClose();
    if (id === 'lossless' && onOpenLossless) onOpenLossless();
    if (id === 'ai' && onOpenAi) onOpenAi();
    if (id === 'productivity' && onOpenProductivity) onOpenProductivity();
    if (id === 'storage' && onOpenStorage) onOpenStorage();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f171c] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Gradient Header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-[#00a884] via-emerald-600 to-teal-700 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {lang === 'bn' ? 'Zovril স্পেশালস' : 'Zovril Specials'}
                </h2>
                <p className="text-sm text-white/80 mt-0.5">
                  {lang === 'bn'
                    ? 'অন্য অ্যাপে যা নেই — এখানে আছে'
                    : 'What other apps don’t have — we do'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                onClick={() => handleFeatureClick(feat.id)}
                className="w-full text-left group p-4 rounded-2xl bg-slate-50 dark:bg-[#182229] border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200"
              >
                <div className="flex gap-4">
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-[15px]">
                        {lang === 'bn' ? feat.titleBn : feat.titleEn}
                      </h3>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 tracking-wide">
                        {feat.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lang === 'bn' ? feat.descBn : feat.descEn}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 self-center shrink-0 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-[#0c1317] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>
              {lang === 'bn'
                ? 'সব ফিচার ফ্রি • কোনো সাবস্ক্রিপশন নেই'
                : 'All features free • No subscription'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md shadow-emerald-600/20"
          >
            {lang === 'bn' ? 'বুঝেছি' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
