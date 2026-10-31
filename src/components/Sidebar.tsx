import React, { useState } from 'react';
import {
  Chat,
  Contact,
  StatusStory,
  CallRecord,
  AppTab,
  Language,
} from '../types';
import { I18N } from '../data/mockData';
import {
  MessageSquare,
  CircleDashed,
  Phone,
  Settings,
  Search,
  Plus,
  Pin,
  Check,
  CheckCheck,
  Mic,
  Image as ImageIcon,
  Sun,
  Moon,
  Globe,
  MoreVertical,
  Volume2,
  VolumeX,
  Sparkles,
  PhoneCall,
  Video,
  ArrowDownLeft,
  ArrowUpRight,
  PhoneMissed,
  Smartphone,
  LogIn,
  Briefcase,
  Lock,
  User,
  Heart,
  Layers,
} from 'lucide-react';
import { EnvironmentWorkspace } from '../types';

interface SidebarProps {
  currentUser: Contact;
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  statuses: StatusStory[];
  onOpenStatusViewer: (index: number) => void;
  onOpenAddStatus: () => void;
  calls: CallRecord[];
  onStartCallWithContact: (contactId: string, type: 'audio' | 'video') => void;
  onOpenNewChat: () => void;
  onOpenSettings: () => void;
  onOpenSpecials: () => void;
  onOpenLoginPortal: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onTogglePinChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  chats,
  activeChatId,
  onSelectChat,
  activeTab,
  onChangeTab,
  statuses,
  onOpenStatusViewer,
  onOpenAddStatus,
  calls,
  onStartCallWithContact,
  onOpenNewChat,
  onOpenSettings,
  onOpenSpecials,
  onOpenLoginPortal,
  isDarkMode,
  onToggleTheme,
  lang,
  onToggleLang,
  onTogglePinChat,
  onDeleteChat,
}) => {
  const t = I18N[lang];
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'personal' | 'work' | 'groups' | 'channels'>('all');
  const [workspaceFilter, setWorkspaceFilter] = useState<EnvironmentWorkspace>('all');

  const unviewedStatusCount = statuses.filter((s) => !s.viewed).length;

  // Filtered chat list by smart tabs and environment workspaces
  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      (chat.lastMessage?.text || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Environment Workspace Isolation filter
    if (workspaceFilter !== 'all') {
      if (chat.workspace && chat.workspace !== workspaceFilter) return false;
      if (!chat.workspace && workspaceFilter !== 'personal') return false;
    }

    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'personal') return chat.category === 'personal';
    if (categoryFilter === 'work') return chat.category === 'work';
    if (categoryFilter === 'groups') return chat.isGroup || chat.category === 'groups';
    if (categoryFilter === 'channels') return chat.isChannel || chat.category === 'channels';
    return true;
  });

  // Sort pinned chats to top
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <aside className="w-full lg:w-96 xl:w-105 h-full bg-white dark:bg-[#111b21] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 select-none">
      {/* Top Header Bar */}
      <header className="h-16 px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-10">
        {/* User profile avatar */}
        <div
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 cursor-pointer group"
          title={t.profile}
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-emerald-500 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#202c33]" />
          </div>
          <span className="text-sm font-semibold text-slate-800 dark:text-[#e9edef] hidden sm:inline max-w-[100px] truncate">
            {currentUser.name.split(' ')[0]}
          </span>
        </div>

        {/* Tab & Utility icons */}
        <div className="flex items-center gap-1 sm:gap-2 text-slate-600 dark:text-[#aebac1]">
          {/* Chats Tab */}
          <button
            onClick={() => onChangeTab('chats')}
            className={`p-2 rounded-full transition-colors relative ${
              activeTab === 'chats'
                ? 'bg-slate-200 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400'
                : 'hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
            }`}
            title={t.chats}
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Status Tab */}
          <button
            onClick={() => onChangeTab('status')}
            className={`p-2 rounded-full transition-colors relative ${
              activeTab === 'status'
                ? 'bg-slate-200 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400'
                : 'hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
            }`}
            title={t.status}
          >
            <CircleDashed className="w-5 h-5" />
            {unviewedStatusCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#202c33]" />
            )}
          </button>

          {/* Calls Tab */}
          <button
            onClick={() => onChangeTab('calls')}
            className={`p-2 rounded-full transition-colors relative ${
              activeTab === 'calls'
                ? 'bg-slate-200 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400'
                : 'hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
            }`}
            title={t.calls}
          >
            <Phone className="w-5 h-5" />
          </button>

          {/* New Chat Button */}
          <button
            onClick={onOpenNewChat}
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-700/50 rounded-full transition-colors"
            title={t.newChat}
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Language Toggle quick switch */}
          <button
            onClick={() => onToggleLang(lang === 'bn' ? 'en' : 'bn')}
            className="px-2 py-1 text-xs font-semibold rounded-md hover:bg-slate-200/70 dark:hover:bg-slate-700/50 text-emerald-600 dark:text-emerald-400"
            title={t.language}
          >
            {lang === 'bn' ? 'EN' : 'বাং'}
          </button>

          {/* Theme Toggle quick switch */}
          <button
            onClick={onToggleTheme}
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-700/50 rounded-full transition-colors"
            title={isDarkMode ? t.lightMode : t.darkMode}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Zovril Specials / Unique Features */}
          <button
            onClick={onOpenSpecials}
            className="p-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-500 dark:text-amber-400 rounded-full transition-colors relative"
            title={lang === 'bn' ? 'Zovril স্পেশালস (Unique Features)' : 'Zovril Specials'}
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </button>

          {/* Login Portal Trigger */}
          <button
            onClick={onOpenLoginPortal}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-[#aebac1] hover:text-emerald-600 rounded-full transition-colors"
            title={lang === 'bn' ? 'লগইন পোর্টাল (Login Portal)' : 'Switch Account / Login Portal'}
          >
            <LogIn className="w-4.5 h-4.5" />
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 hover:bg-slate-200/70 dark:hover:bg-slate-700/50 rounded-full transition-colors"
            title={t.settings}
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Main Tab Views */}
      {activeTab === 'chats' && (
        <>
          {/* Search bar & filter pills */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2.5">
            {/* Environment Workspace Isolation Selector */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 uppercase tracking-wider text-[10px]">
                <Layers className="w-3 h-3 text-emerald-500" />
                {lang === 'bn' ? 'ওয়ার্কস্পেস এনভায়রনমেন্ট' : 'Workspace Environment'}
              </span>
              {workspaceFilter !== 'all' && (
                <button
                  onClick={() => setWorkspaceFilter('all')}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline text-[10px]"
                >
                  {lang === 'bn' ? 'সব দেখুন' : 'Show All'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-[#182229] rounded-xl text-xs">
              {[
                { id: 'personal', icon: User, label: lang === 'bn' ? 'ব্যক্তিগত' : 'Personal' },
                { id: 'work', icon: Briefcase, label: lang === 'bn' ? 'অফিস' : 'Work' },
                { id: 'family', icon: Heart, label: lang === 'bn' ? 'ফ্যামিলি' : 'Family' },
                { id: 'vault', icon: Lock, label: lang === 'bn' ? 'ভল্ট' : 'Vault' },
              ].map((ws) => {
                const IconComponent = ws.icon;
                const isActive = workspaceFilter === ws.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => setWorkspaceFilter(isActive ? 'all' : (ws.id as EnvironmentWorkspace))}
                    className={`py-1.5 px-1 rounded-lg flex flex-col items-center gap-0.5 transition-all font-medium text-[11px] ${
                      isActive
                        ? ws.id === 'vault'
                          ? 'bg-rose-600 text-white shadow-xs font-bold'
                          : 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#202c33]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="truncate">{ws.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 bg-[#f0f2f5] dark:bg-[#202c33] px-3.5 py-2 rounded-xl">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="bg-transparent text-xs w-full outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            {/* Segmented Smart Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {[
                { id: 'all', label: lang === 'bn' ? 'সকল' : 'All' },
                { id: 'personal', label: lang === 'bn' ? 'ব্যক্তিগত' : 'Personal' },
                { id: 'work', label: lang === 'bn' ? 'অফিস / কাজ' : 'Work' },
                { id: 'groups', label: lang === 'bn' ? 'গ্রুপ' : 'Groups' },
                { id: 'channels', label: lang === 'bn' ? 'চ্যানেল' : 'Channels' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCategoryFilter(f.id as typeof categoryFilter)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all shrink-0 ${
                    categoryFilter === f.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#202c33] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {sortedChats.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                {lang === 'bn' ? 'কোনো চ্যাট পাওয়া যায়নি' : 'No chats found'}
              </div>
            ) : (
              sortedChats.map((chat) => {
                const isSelected = activeChatId === chat.id;

                return (
                  <div
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer transition-colors relative group ${
                      isSelected
                        ? 'bg-[#f0f2f5] dark:bg-[#2a3942]'
                        : 'hover:bg-slate-50 dark:hover:bg-[#202c33]/70'
                    }`}
                  >
                    {/* Avatar with indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.isMetaAI ? (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-[#111b21]">
                          <Sparkles className="w-2.5 h-2.5" />
                        </div>
                      ) : (
                        chat.phone && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#111b21]" />
                        )
                      )}
                    </div>

                    {/* Chat Name & Message Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-sm font-semibold text-slate-900 dark:text-[#e9edef] truncate">
                            {chat.name}
                          </span>
                          {chat.workspace === 'vault' && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-rose-500/10 text-rose-500 rounded font-bold border border-rose-500/20 shrink-0 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Vault
                            </span>
                          )}
                          {chat.workspace === 'work' && !chat.isMetaAI && !chat.isChannel && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-blue-500/10 text-blue-500 rounded font-semibold border border-blue-500/20 shrink-0">
                              Work
                            </span>
                          )}
                          {chat.workspace === 'family' && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-purple-500/10 text-purple-500 rounded font-semibold border border-purple-500/20 shrink-0">
                              Family
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 dark:text-[#8696a0] shrink-0 ml-1">
                          {chat.lastMessage?.timestamp || ''}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#8696a0] truncate">
                          {chat.isTyping ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              {t.typing}
                            </span>
                          ) : (
                            <>
                              {chat.lastMessage?.senderId === currentUser.id && (
                                <span className="shrink-0">
                                  {chat.lastMessage.status === 'read' ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                </span>
                              )}
                              {chat.lastMessage?.type === 'voice' ? (
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                  <Mic className="w-3.5 h-3.5" /> {t.voiceMessage}
                                </span>
                              ) : chat.lastMessage?.type === 'image' ? (
                                <span className="flex items-center gap-1">
                                  <ImageIcon className="w-3.5 h-3.5" /> {t.photo}
                                </span>
                              ) : (
                                <span className="truncate">{chat.lastMessage?.text || chat.about}</span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Badges / Pin icons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {chat.isPinned && (
                            <Pin className="w-3.5 h-3.5 text-slate-400 -rotate-45" />
                          )}
                          {chat.unreadCount > 0 && (
                            <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Status / Updates Tab View */}
      {activeTab === 'status' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* My Status Card */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#202c33]/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <button
                  onClick={onOpenAddStatus}
                  className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white dark:ring-[#111b21] hover:scale-110 transition-transform"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {t.myStatus}
                </h4>
                <p className="text-xs text-slate-400">{t.addStatus}</p>
              </div>
            </div>
            <button
              onClick={onOpenAddStatus}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              + {lang === 'bn' ? 'যুক্ত করুন' : 'Add'}
            </button>
          </div>

          {/* Recent Updates */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
              {t.recentUpdates}
            </h4>
            <div className="space-y-2">
              {statuses.map((story, index) => (
                <div
                  key={story.id}
                  onClick={() => onOpenStatusViewer(index)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202c33] cursor-pointer transition-colors"
                >
                  <div className="p-0.5 rounded-full border-2 border-emerald-500">
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {story.userName}
                    </h5>
                    <p className="text-xs text-slate-400 truncate">{story.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calls Tab View */}
      {activeTab === 'calls' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'bn' ? 'সাম্প্রতিক কল' : 'Recent Calls'}
            </h4>
          </div>

          <div className="space-y-2">
            {calls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202c33] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={call.contactAvatar}
                    alt={call.contactName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {call.contactName}
                    </h5>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      {call.direction === 'incoming' && (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      {call.direction === 'outgoing' && (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                      )}
                      {call.direction === 'missed' && (
                        <PhoneMissed className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span>{call.timestamp}</span>
                      {call.duration && <span>· {call.duration}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartCallWithContact(call.contactId, call.type)}
                    className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-full transition-colors"
                    title={`Call ${call.contactName}`}
                  >
                    {call.type === 'video' ? <Video className="w-4.5 h-4.5" /> : <PhoneCall className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
