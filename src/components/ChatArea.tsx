import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message, Language, Contact } from '../types';
import { I18N } from '../data/mockData';
import { sound } from '../utils/audio';
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Send,
  Check,
  CheckCheck,
  Play,
  Pause,
  Reply,
  Trash2,
  Copy,
  Star,
  Image as ImageIcon,
  FileText,
  MapPin,
  X,
  Sparkles,
  ChevronDown,
  CheckSquare,
  HardDrive,
  ShieldAlert,
  EyeOff,
  Flame,
  Lock,
  ShieldCheck,
} from 'lucide-react';

interface ChatAreaProps {
  chat: Chat;
  messages: Message[];
  currentUser: Contact;
  onSendMessage: (
    text: string,
    type?: Message['type'],
    mediaUrl?: string,
    replyTo?: Message['replyTo'],
    isLossless?: boolean,
    fileName?: string,
    fileSize?: string,
    selfDestructSeconds?: number
  ) => void;
  onDeleteMessage: (msgId: string) => void;
  onReaction: (msgId: string, emoji: string) => void;
  onStarMessage: (msgId: string) => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onOpenContactInfo: () => void;
  onBackToChatList?: () => void;
  wallpaperClass: string;
  lang: Language;
  onViewImage: (url: string, sender: string, time: string) => void;
  onOpenAiAssistant: () => void;
  onOpenProductivity: () => void;
  onOpenLosslessShare: () => void;
  selfDestructTimer: number;
  onSetSelfDestructTimer: (sec: number) => void;
  antiScreenshot: boolean;
  onToggleAntiScreenshot: () => void;
}

const COMMON_EMOJIS = ['😀', '😂', '😍', '❤️', '👍', '🔥', '🙏', '🎉', '👏', '😎', '🥺', '✨', '☕', '🚀', '💯', '😊'];
const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  messages,
  currentUser,
  onSendMessage,
  onDeleteMessage,
  onReaction,
  onStarMessage,
  onStartCall,
  onOpenContactInfo,
  onBackToChatList,
  wallpaperClass,
  lang,
  onViewImage,
  onOpenAiAssistant,
  onOpenProductivity,
  onOpenLosslessShare,
  selfDestructTimer,
  onSetSelfDestructTimer,
  antiScreenshot,
  onToggleAntiScreenshot,
}) => {
  const t = I18N[lang];
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [searchInChat, setSearchInChat] = useState('');
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [activeActionMsgId, setActiveActionMsgId] = useState<string | null>(null);

  // Audio voice note recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordTimerRef = useRef<number | null>(null);

  // Voice note audio playback state
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const [audioSpeed, setAudioSpeed] = useState<1 | 1.5 | 2>(1);
  const [isProtectedMode, setIsProtectedMode] = useState<boolean>(false);
  const [customVoiceBookmarks, setCustomVoiceBookmarks] = useState<
    Record<string, { id: string; time: number; label: string }[]>
  >({});
  const voicePlayTimerRef = useRef<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, chat.isTyping]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [isRecording]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const reply = replyingTo
      ? {
          id: replyingTo.id,
          senderName: replyingTo.senderId === currentUser.id ? t.you : chat.name,
          text: replyingTo.text,
        }
      : undefined;

    onSendMessage(
      inputText.trim(),
      'text',
      undefined,
      reply,
      false,
      undefined,
      undefined,
      selfDestructTimer > 0 ? selfDestructTimer : undefined
    );
    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleSendVoiceNote = () => {
    setIsRecording(false);
    const duration = recordingSeconds || 5;
    // Generate simulated waveform
    const waveform = Array.from({ length: 18 }, () => Math.floor(Math.random() * 70) + 20);

    onSendMessage(
      t.voiceMessage,
      'voice',
      undefined,
      replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderId === currentUser.id ? t.you : chat.name,
            text: replyingTo.text,
          }
        : undefined
    );
    setReplyingTo(null);
  };

  const handleCancelVoiceNote = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleToggleVoicePlay = (msgId: string, duration: number = 10) => {
    if (playingMsgId === msgId) {
      if (voicePlayTimerRef.current) clearInterval(voicePlayTimerRef.current);
      setPlayingMsgId(null);
      return;
    }
    if (voicePlayTimerRef.current) clearInterval(voicePlayTimerRef.current);
    setPlayingMsgId(msgId);
    let currentPct = playProgress[msgId] || 0;
    if (currentPct >= 100) currentPct = 0;

    voicePlayTimerRef.current = window.setInterval(() => {
      currentPct += (100 / (duration * (10 / audioSpeed))) * 0.1;
      if (currentPct >= 100) {
        if (voicePlayTimerRef.current) clearInterval(voicePlayTimerRef.current);
        setPlayingMsgId(null);
        setPlayProgress((prev) => ({ ...prev, [msgId]: 0 }));
      } else {
        setPlayProgress((prev) => ({ ...prev, [msgId]: currentPct }));
      }
    }, 100);
  };

  const handleSeekVoice = (msgId: string, timeSec: number, totalDuration: number) => {
    if (voicePlayTimerRef.current) clearInterval(voicePlayTimerRef.current);
    const targetPct = Math.min(100, Math.max(0, (timeSec / totalDuration) * 100));
    setPlayProgress((prev) => ({ ...prev, [msgId]: targetPct }));
    setPlayingMsgId(msgId);
    let currentPct = targetPct;

    voicePlayTimerRef.current = window.setInterval(() => {
      currentPct += (100 / (totalDuration * (10 / audioSpeed))) * 0.1;
      if (currentPct >= 100) {
        if (voicePlayTimerRef.current) clearInterval(voicePlayTimerRef.current);
        setPlayingMsgId(null);
        setPlayProgress((prev) => ({ ...prev, [msgId]: 0 }));
      } else {
        setPlayProgress((prev) => ({ ...prev, [msgId]: currentPct }));
      }
    }, 100);
    sound.playSent();
  };

  const handleAddVoiceBookmark = (msgId: string, duration: number) => {
    const currentProgress = playProgress[msgId] || 0;
    const currentSec = Math.max(1, Math.floor((currentProgress / 100) * duration));
    const newBm = {
      id: `bm_${Date.now()}`,
      time: currentSec,
      label: lang === 'bn' ? `নোট @ 0:${currentSec < 10 ? `0${currentSec}` : currentSec}` : `Memo @ 0:${currentSec < 10 ? `0${currentSec}` : currentSec}`,
    };
    setCustomVoiceBookmarks((prev) => ({
      ...prev,
      [msgId]: [...(prev[msgId] || []), newBm],
    }));
    sound.playSent();
  };

  const handleSendImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSendMessage(file.name, 'image', reader.result);
          setShowAttachmentMenu(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendLocation = () => {
    onSendMessage('📍 Dhaka, Bangladesh (Gulshan 2)', 'location');
    setShowAttachmentMenu(false);
  };

  const filteredMessages = messages.filter((m) =>
    searchInChat ? m.text.toLowerCase().includes(searchInChat.toLowerCase()) : true
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative overflow-hidden select-none">
      {/* Top Chat Header */}
      <header className="h-16 px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBackToChatList && (
            <button
              onClick={onBackToChatList}
              className="lg:hidden p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full"
              title="Back"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Avatar and name */}
          <div
            onClick={onOpenContactInfo}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
          >
            <div className="relative shrink-0">
              <img
                src={chat.avatar}
                alt={chat.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
              {chat.isMetaAI ? (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[9px] ring-2 ring-white dark:ring-[#202c33]">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              ) : (
                chat.phone && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#202c33]" />
                )
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-800 dark:text-[#e9edef] text-sm truncate group-hover:underline">
                  {chat.name}
                </h3>
                {isProtectedMode && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-0.5 shrink-0">
                    <Lock className="w-2.5 h-2.5" /> {lang === 'bn' ? 'সুরক্ষিত' : 'Protected'}
                  </span>
                )}
                {chat.isMetaAI && (
                  <span className="text-[10px] font-medium text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                    AI
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8696a0] truncate">
                {chat.isTyping ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
                    {t.typing}
                  </span>
                ) : chat.isMetaAI ? (
                  'Always active · Gemini AI'
                ) : chat.phone ? (
                  t.online
                ) : (
                  chat.about || t.offline
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right header action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 text-slate-600 dark:text-[#aebac1]">
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full transition-colors relative"
            title={lang === 'bn' ? 'এআই অ্যাসিস্ট্যান্ট (সামারি ও ড্রাফট)' : 'AI Assistant (Summary & Drafter)'}
          >
            <Sparkles className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </button>

          {/* In-Chat Productivity Suite */}
          <button
            onClick={onOpenProductivity}
            className="p-2 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300 rounded-full transition-colors"
            title={lang === 'bn' ? 'টু-ডু ও নোটপ্যাড' : 'To-Do & Scratchpad'}
          >
            <CheckSquare className="w-5 h-5" />
          </button>

          {/* Advanced Privacy & Ghost Anti-Screenshot Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
              className={`p-2 rounded-full transition-colors ${
                antiScreenshot || selfDestructTimer > 0
                  ? 'bg-rose-500/10 text-rose-500'
                  : 'hover:bg-slate-200/80 dark:hover:bg-slate-700/60'
              }`}
              title={lang === 'bn' ? 'অ্যাডভান্সড প্রাইভেসি ও সেলফ-ডেস্ট্রাক্ট' : 'Privacy & Self-Destruct'}
            >
              {antiScreenshot ? <EyeOff className="w-5 h-5 text-rose-500" /> : <ShieldAlert className="w-5 h-5" />}
            </button>

            {/* Privacy Dropdown Menu */}
            {showPrivacyMenu && (
              <div className="absolute right-0 top-12 z-40 bg-white dark:bg-[#202c33] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 min-w-[260px] space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    {lang === 'bn' ? 'অ্যাডভান্সড প্রাইভেসি' : 'Ghost Privacy'}
                  </span>
                  <button onClick={() => setShowPrivacyMenu(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Anti-screenshot Watermark Shield */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
                      {lang === 'bn' ? 'স্ক্রিনশট শিল্ড (Ghost)' : 'Anti-Screenshot Shield'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lang === 'bn' ? 'ওয়াটারমার্ক দিয়ে লিক রোধ' : 'Watermark chat canvas'}
                    </span>
                  </div>
                  <button
                    onClick={onToggleAntiScreenshot}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                      antiScreenshot
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {antiScreenshot ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Forwarding & Copy Protection */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
                      {lang === 'bn' ? 'কপি ও ফরওয়ার্ড প্রতিরোধ' : 'Forward & Copy Protection'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lang === 'bn' ? 'মেসেজ এক্সপোর্ট ও কপি নিষিদ্ধ' : 'Prevent copy & export'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsProtectedMode(!isProtectedMode);
                      sound.playSent();
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                      isProtectedMode
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {isProtectedMode ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Self-Destruct Timer */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>{lang === 'bn' ? 'স্বয়ংক্রিয় মুছে ফেলা (Timer):' : 'Self-Destruct Timer:'}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 pt-1">
                    {[
                      { sec: 0, label: 'Off' },
                      { sec: 10, label: '10s' },
                      { sec: 30, label: '30s' },
                      { sec: 60, label: '1m' },
                    ].map((opt) => (
                      <button
                        key={opt.sec}
                        onClick={() => {
                          onSetSelfDestructTimer(opt.sec);
                          sound.playSent();
                        }}
                        className={`py-1 text-[11px] font-semibold rounded-md border text-center transition-colors ${
                          selfDestructTimer === opt.sec
                            ? 'border-rose-500 bg-rose-500/10 text-rose-500 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {!chat.isMetaAI && (
            <>
              <button
                onClick={() => onStartCall('video')}
                className="p-2 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 rounded-full transition-colors"
                title={t.videoCall}
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={() => onStartCall('audio')}
                className="p-2 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 rounded-full transition-colors"
                title={t.audioCall}
              >
                <Phone className="w-4.5 h-4.5" />
              </button>
            </>
          )}

          <button
            onClick={() => setShowSearchBox(!showSearchBox)}
            className={`p-2 rounded-full transition-colors ${
              showSearchBox ? 'bg-slate-200 dark:bg-slate-700 text-emerald-600' : 'hover:bg-slate-200/80 dark:hover:bg-slate-700/60'
            }`}
            title="Search in chat"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenContactInfo}
            className="p-2 hover:bg-slate-200/80 dark:hover:bg-slate-700/60 rounded-full transition-colors"
            title="Contact Info"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* In-chat search banner if toggled */}
      {showSearchBox && (
        <div className="bg-[#f0f2f5] dark:bg-[#111b21] px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 z-20">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchInChat}
            onChange={(e) => setSearchInChat(e.target.value)}
            placeholder={lang === 'bn' ? 'এই চ্যাটে খুঁজুন...' : 'Search in this chat...'}
            className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-100 outline-none"
            autoFocus
          />
          {searchInChat && (
            <button onClick={() => setSearchInChat('')} className="text-xs text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Messages Canvas */}
      <div className={`flex-1 overflow-y-auto p-4 md:px-12 space-y-3 ${wallpaperClass} transition-colors relative`}>
        {/* Anti-screenshot Watermark Shield Layer */}
        {antiScreenshot && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden flex flex-wrap items-center justify-around opacity-[0.06] dark:opacity-[0.1] select-none text-slate-900 dark:text-white font-mono text-xs uppercase -rotate-12 gap-16 p-8">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="whitespace-nowrap font-bold">
                🔒 {currentUser.name} · {currentUser.phone} · CONFIDENTIAL
              </span>
            ))}
          </div>
        )}

        {/* End-to-end Encryption disclaimer chip */}
        <div className="flex justify-center my-2 relative z-20">
          <div className="bg-[#ffeecd] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-[11px] px-3 py-1.5 rounded-lg shadow-xs max-w-sm text-center leading-relaxed">
            🔒 {lang === 'bn' ? 'এই চ্যাটের সমস্ত মেসেজ ও কল এন্ড-টু-এন্ড এনক্রিপ্টেড।' : 'Messages and calls are end-to-end encrypted. No one outside can read or listen.'}
          </div>
        </div>

        {filteredMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col group relative ${isMe ? 'items-end' : 'items-start'}`}
              onMouseEnter={() => setActiveActionMsgId(msg.id)}
              onMouseLeave={() => setActiveActionMsgId(null)}
            >
              {/* Message Bubble Container */}
              <div
                className={`relative max-w-[85%] md:max-w-[65%] rounded-2xl px-3 py-2 shadow-xs transition-shadow ${
                  isMe
                    ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-[#e9edef] rounded-tr-xs'
                    : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-[#e9edef] rounded-tl-xs'
                }`}
              >
                {/* Quoted Reply snippet if any */}
                {msg.replyTo && (
                  <div
                    className={`mb-2 p-2 rounded-lg text-xs border-l-4 ${
                      isMe
                        ? 'bg-emerald-600/10 border-emerald-600 text-slate-700 dark:text-slate-200'
                        : 'bg-slate-100 dark:bg-[#111b21] border-emerald-500 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-semibold block text-[11px] text-emerald-600 dark:text-emerald-400">
                      {msg.replyTo.senderName}
                    </span>
                    <p className="truncate line-clamp-1">{msg.replyTo.text}</p>
                  </div>
                )}

                {/* Message Content: Image */}
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="mb-1 rounded-lg overflow-hidden cursor-pointer">
                    <img
                      src={msg.mediaUrl}
                      alt="Uploaded media"
                      referrerPolicy="no-referrer"
                      onClick={() => onViewImage(msg.mediaUrl!, isMe ? t.you : chat.name, msg.timestamp)}
                      className="max-h-64 w-auto rounded-lg object-cover hover:opacity-95 transition-opacity"
                    />
                  </div>
                )}

                {/* Message Content: Voice Note */}
                {msg.type === 'voice' && (
                  <div className="flex flex-col gap-2 py-1 min-w-[220px]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleVoicePlay(msg.id, msg.voiceDuration || 10)}
                        className={`p-2.5 rounded-full text-white shadow-sm transition-transform active:scale-95 ${
                          isMe ? 'bg-emerald-700 dark:bg-emerald-600' : 'bg-emerald-600'
                        }`}
                      >
                        {playingMsgId === msg.id ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1 flex flex-col gap-1">
                        {/* Waveform visual bars */}
                        <div className="flex items-center gap-0.5 h-6">
                          {(msg.voiceWaveform || [30, 60, 45, 80, 50, 70, 90, 65, 40, 55, 75, 45, 30, 60, 85, 70, 40, 20]).map(
                            (val, idx) => {
                              const played = (playProgress[msg.id] || 0) > (idx / 18) * 100;
                              return (
                                <div
                                  key={idx}
                                  className={`w-1 rounded-full transition-colors ${
                                    played
                                      ? isMe
                                        ? 'bg-emerald-800 dark:bg-emerald-300'
                                        : 'bg-emerald-600'
                                      : 'bg-slate-300 dark:bg-slate-600'
                                  }`}
                                  style={{ height: `${val}%` }}
                                />
                              );
                            }
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                          <span>
                            {playingMsgId === msg.id
                              ? `${Math.floor(((playProgress[msg.id] || 0) / 100) * (msg.voiceDuration || 10))}s`
                              : `${msg.voiceDuration || 12}s`}
                          </span>
                          <button
                            onClick={() => setAudioSpeed(audioSpeed === 1 ? 1.5 : audioSpeed === 1.5 ? 2 : 1)}
                            className="font-semibold text-slate-600 dark:text-slate-300 px-1 hover:bg-black/5 rounded"
                          >
                            {audioSpeed}x
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Contextual Audio Memo Bookmarks & Quick Timestamp Tagging */}
                    {(() => {
                      const allBookmarks = [
                        ...(msg.voiceBookmarks || []),
                        ...(customVoiceBookmarks[msg.id] || []),
                      ];
                      return (
                        <div className="pt-1 border-t border-black/5 dark:border-white/5 space-y-1.5">
                          {allBookmarks.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {allBookmarks.map((bm) => (
                                <button
                                  key={bm.id}
                                  onClick={() => handleSeekVoice(msg.id, bm.time, msg.voiceDuration || 12)}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/25 transition-all flex items-center gap-1 cursor-pointer active:scale-95 border border-emerald-500/20"
                                  title={`Seek to 0:${bm.time < 10 ? `0${bm.time}` : bm.time}`}
                                >
                                  <span>📌 0:{bm.time < 10 ? `0${bm.time}` : bm.time}</span>
                                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[85px]">{bm.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-[10px]">
                            <button
                              onClick={() => handleAddVoiceBookmark(msg.id, msg.voiceDuration || 12)}
                              className="text-emerald-700 dark:text-emerald-300 hover:underline font-semibold flex items-center gap-0.5"
                            >
                              + {lang === 'bn' ? 'অডিও টাইমস্ট্যাম্প বুকমার্ক' : 'Add Audio Bookmark'}
                            </button>
                            <span className="text-slate-400 text-[9px]">
                              {lang === 'bn' ? 'ক্লিক করে সরাসরি শুনুন' : 'Click chip to seek'}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Message Content: Location */}
                {msg.type === 'location' && (
                  <div className="flex items-center gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-lg mb-1">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs block">{msg.text}</span>
                      <span className="text-[10px] text-slate-400">Google Maps Live Location</span>
                    </div>
                  </div>
                )}

                {/* Message Content: Lossless File */}
                {msg.type === 'lossless_file' && (
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-emerald-500/30 mb-2 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <HardDrive className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs block truncate text-slate-900 dark:text-white">
                          {msg.fileName || msg.text}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                          <span>{msg.fileSize || 'Original'}</span>
                          <span>·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> True Lossless (100% Quality)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Self-Destruct / Burn Badge if active */}
                {msg.selfDestructSeconds && (
                  <div className="flex items-center gap-1 text-[10px] text-rose-500 font-semibold mb-1 bg-rose-500/10 px-2 py-0.5 rounded-md w-fit">
                    <Flame className="w-3 h-3 animate-pulse" />
                    <span>
                      {lang === 'bn' ? `স্বয়ংক্রিয় ধ্বংস হবে: ${msg.selfDestructSeconds}s` : `Self-destructs in ${msg.selfDestructSeconds}s`}
                    </span>
                  </div>
                )}

                {/* Message Content: Standard Text */}
                {msg.type !== 'voice' && msg.type !== 'lossless_file' && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words pr-2">
                    {msg.text}
                  </p>
                )}

                {/* Footer timestamp & status indicators */}
                <div className="flex items-center justify-end gap-1 text-[11px] text-slate-500 dark:text-[#8696a0] mt-1 float-right ml-3 select-none">
                  {msg.isStarred && <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />}
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <span className="ml-0.5">
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      ) : msg.status === 'delivered' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </span>
                  )}
                </div>

                {/* Emoji reactions below message bubble */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div
                    className={`absolute -bottom-3 ${
                      isMe ? 'right-2' : 'left-2'
                    } flex items-center gap-1 bg-white dark:bg-[#202c33] border border-slate-200 dark:border-slate-700/80 px-1.5 py-0.5 rounded-full shadow-xs text-xs z-10`}
                  >
                    {Object.entries(msg.reactions).map(([emoji, users]) => (
                      <span key={emoji} className="flex items-center gap-0.5 cursor-pointer hover:scale-110">
                        <span>{emoji}</span>
                        {users.length > 1 && (
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            {users.length}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}

                {/* Floating Action Menu on hover */}
                {activeActionMsgId === msg.id && (
                  <div
                    className={`absolute -top-7 ${
                      isMe ? 'right-0' : 'left-0'
                    } z-20 flex items-center gap-1 bg-white dark:bg-[#202c33] border border-slate-200 dark:border-slate-700 rounded-full shadow-md px-2 py-0.5 animate-in fade-in zoom-in-95 duration-100`}
                  >
                    {REACTION_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onReaction(msg.id, emoji)}
                        className="hover:scale-125 transition-transform text-xs p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                    <span className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-1" />
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="p-1 hover:text-emerald-500 text-slate-500"
                      title={t.reply}
                    >
                      <Reply className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onStarMessage(msg.id)}
                      className={`p-1 hover:text-amber-500 ${msg.isStarred ? 'text-amber-500' : 'text-slate-500'}`}
                      title={t.star}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    {isProtectedMode ? (
                      <span
                        className="p-1 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        title={lang === 'bn' ? 'সুরক্ষিত চ্যাট: কপি ও ফরওয়ার্ড নিষ্ক্রিয়' : 'Protected chat: Copy & forward disabled'}
                      >
                        <Lock className="w-3.5 h-3.5 text-rose-500" />
                      </span>
                    ) : (
                      <button
                        onClick={() => navigator.clipboard?.writeText(msg.text)}
                        className="p-1 hover:text-slate-800 dark:hover:text-white text-slate-500"
                        title={t.copy}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {isMe && (
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="p-1 hover:text-rose-500 text-slate-500"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {chat.isTyping && (
          <div className="flex items-center gap-2 bg-white dark:bg-[#202c33] rounded-2xl rounded-tl-xs px-4 py-2.5 max-w-[120px] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quoted reply banner */}
      {replyingTo && (
        <div className="bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="border-l-4 border-emerald-500 pl-3">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
              {replyingTo.senderId === currentUser.id ? t.you : chat.name}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-md">
              {replyingTo.text}
            </p>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker Drawer */}
      {showEmojiPicker && (
        <div className="bg-[#f0f2f5] dark:bg-[#202c33] border-t border-slate-200 dark:border-slate-800 p-3 grid grid-cols-8 gap-2 max-h-36 overflow-y-auto">
          {COMMON_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setInputText((prev) => prev + emoji);
              }}
              className="text-xl p-1 hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Menu Popup */}
      {showAttachmentMenu && (
        <div className="absolute bottom-20 left-12 z-30 bg-white dark:bg-[#202c33] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-3 flex flex-col gap-2 min-w-[190px] animate-in fade-in slide-in-from-bottom-3 duration-150">
          <label className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 cursor-pointer text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span>{t.photoVideo}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSendImageUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              setShowAttachmentMenu(false);
              onOpenLosslessShare();
            }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">{lang === 'bn' ? 'ট্রু লসলেস ফাইল (Raw)' : 'True Lossless File'}</span>
              <span className="text-[10px] text-slate-400">0% Compression · 4K/ZIP/APK</span>
            </div>
          </button>

          <button
            onClick={handleSendLocation}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span>{t.location}</span>
          </button>
        </div>
      )}

      {/* Bottom Chat Input Bar */}
      <footer className="px-4 py-3 bg-[#f0f2f5] dark:bg-[#202c33] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 z-20">
        {isRecording ? (
          /* Live Voice Recording UI */
          <div className="flex-1 flex items-center justify-between bg-white dark:bg-[#111b21] px-4 py-2.5 rounded-2xl shadow-inner">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-semibold text-rose-500">
                {recordingSeconds}s
              </span>
              <span className="text-xs text-slate-400">
                {t.recording}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelVoiceNote}
                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                title={t.cancel}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleSendVoiceNote}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors"
                title={t.send}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Regular Message Input UI */
          <>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded-full transition-colors ${
                showEmojiPicker ? 'text-emerald-500' : 'text-slate-500 dark:text-[#8696a0] hover:text-slate-700'
              }`}
              title="Emoji"
            >
              <Smile className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className={`p-2 rounded-full transition-colors ${
                showAttachmentMenu ? 'text-emerald-500' : 'text-slate-500 dark:text-[#8696a0] hover:text-slate-700'
              }`}
              title="Attach"
            >
              <Paperclip className="w-5 h-5 rotate-45" />
            </button>

            <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.typeMessage}
                className="flex-1 bg-white dark:bg-[#2a3942] text-slate-800 dark:text-[#d1d7db] placeholder-slate-400 dark:placeholder-[#8696a0] px-4 py-2.5 rounded-xl text-sm outline-none border border-transparent focus:border-slate-300 dark:focus:border-slate-600 shadow-2xs"
              />

              {inputText.trim() ? (
                <button
                  type="submit"
                  className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-transform active:scale-95"
                  title={t.send}
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRecording(true)}
                  className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-transform active:scale-95"
                  title={t.holdToRecord}
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </form>
          </>
        )}
      </footer>
    </div>
  );
};
