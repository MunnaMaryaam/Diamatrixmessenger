import React from 'react';
import { Chat, Message, Language } from '../types';
import { I18N } from '../data/mockData';
import {
  X,
  Phone,
  Video,
  Bell,
  Star,
  Image as ImageIcon,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';

interface ContactInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
  messages: Message[];
  onStartCall: (type: 'audio' | 'video') => void;
  onClearChat: () => void;
  lang: Language;
}

export const ContactInfoDrawer: React.FC<ContactInfoDrawerProps> = ({
  isOpen,
  onClose,
  chat,
  messages,
  onStartCall,
  onClearChat,
  lang,
}) => {
  const t = I18N[lang];
  if (!isOpen) return null;

  const imageMessages = messages.filter((m) => m.type === 'image' && m.mediaUrl);

  return (
    <aside className="w-80 md:w-88 border-l border-slate-200 dark:border-slate-800 bg-[#f0f2f5] dark:bg-[#111b21] h-full flex flex-col z-20 overflow-y-auto shrink-0 select-none">
      {/* Header */}
      <div className="h-15 px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={onClose}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
          {chat.isGroup ? (lang === 'bn' ? 'গ্রুপের বিবরণ' : 'Group Info') : (lang === 'bn' ? 'কন্ট্যাক্ট বিবরণ' : 'Contact Info')}
        </span>
      </div>

      <div className="p-6 flex flex-col items-center bg-white dark:bg-[#111b21] border-b border-slate-200 dark:border-slate-800">
        <img
          src={chat.avatar}
          alt={chat.name}
          referrerPolicy="no-referrer"
          className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-emerald-500/60 mb-3"
        />
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 text-center leading-snug">
          {chat.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {chat.phone || (chat.isGroup ? `${chat.members?.length || 5} members` : 'Virtual Contact')}
        </p>

        {/* Action icons */}
        {!chat.isMetaAI && (
          <div className="flex items-center gap-6 mt-4">
            <button
              onClick={() => onStartCall('audio')}
              className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium">{t.audioCall}</span>
            </button>
            <button
              onClick={() => onStartCall('video')}
              className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium">{t.videoCall}</span>
            </button>
          </div>
        )}
      </div>

      {/* About / Status */}
      <div className="p-4 bg-white dark:bg-[#111b21] mt-2 border-y border-slate-200 dark:border-slate-800">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {lang === 'bn' ? 'স্ট্যাটাস / বায়ো' : 'About'}
        </span>
        <p className="text-sm text-slate-800 dark:text-slate-200 mt-1">
          {chat.about || (chat.isGroup ? 'Group description: Let’s collaborate and stay connected.' : 'Available')}
        </p>
      </div>

      {/* Members for group */}
      {chat.isGroup && chat.members && (
        <div className="p-4 bg-white dark:bg-[#111b21] mt-2 border-y border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {lang === 'bn' ? `সদস্যবৃন্দ (${chat.members.length})` : `Members (${chat.members.length})`}
            </span>
          </div>
          <div className="space-y-2">
            {chat.members.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                  {m[0]}
                </div>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media, Links & Docs */}
      <div className="p-4 bg-white dark:bg-[#111b21] mt-2 border-y border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {lang === 'bn' ? 'মিডিয়া ও ফাইল' : 'Media, Links & Docs'}
            </span>
          </div>
          <span className="text-xs text-slate-400">{imageMessages.length}</span>
        </div>

        {imageMessages.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5">
            {imageMessages.map((msg) => (
              <div key={msg.id} className="aspect-square rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={msg.mediaUrl}
                  alt="Shared media"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            {lang === 'bn' ? 'কোনো মিডিয়া ফাইল নেই' : 'No media shared yet'}
          </p>
        )}
      </div>

      {/* Encryption badge */}
      <div className="p-4 flex items-center gap-3 bg-white dark:bg-[#111b21] mt-2 border-y border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
        <p>
          {lang === 'bn'
            ? 'মেসেজ এবং কল এন্ড-টু-এন্ড এনক্রিপ্ট করা থাকে।'
            : 'Messages and calls are end-to-end encrypted.'}
        </p>
      </div>

      {/* Danger Actions */}
      <div className="p-4 bg-white dark:bg-[#111b21] mt-2 mb-6 border-y border-slate-200 dark:border-slate-800">
        <button
          onClick={onClearChat}
          className="flex items-center gap-3 text-rose-500 hover:text-rose-600 text-xs font-semibold w-full py-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>{t.clearChat}</span>
        </button>
      </div>
    </aside>
  );
};
