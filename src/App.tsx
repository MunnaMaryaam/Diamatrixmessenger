/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Chat,
  Message,
  Contact,
  StatusStory,
  CallRecord,
  AppTab,
  Language,
} from './types';
import {
  CURRENT_USER,
  INITIAL_CONTACTS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_STATUSES,
  INITIAL_CALLS,
  I18N,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ContactInfoDrawer } from './components/ContactInfoDrawer';
import { StatusViewerModal } from './components/StatusViewerModal';
import { AddStatusModal } from './components/AddStatusModal';
import { CallModal } from './components/CallModal';
import { NewChatModal } from './components/NewChatModal';
import { SettingsModal } from './components/SettingsModal';
import { MediaViewerModal } from './components/MediaViewerModal';
import { LoginPortal } from './components/LoginPortal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { ProductivityDrawer } from './components/ProductivityDrawer';
import { LosslessShareModal } from './components/LosslessShareModal';
import { StorageManagerModal } from './components/StorageManagerModal';
import { ZovrilSpecialsModal } from './components/ZovrilSpecialsModal';
import { TodoTask } from './types';
import { sound } from './utils/audio';
import { MessageSquare, ShieldCheck, Sparkles, Phone, CircleDashed } from 'lucide-react';

export default function App() {
  // Theme & Language State with localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('zovril_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('zovril_logged_in');
    return saved === null ? false : saved === 'true'; // Open login portal so user can see and test it!
  });

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('zovril_lang');
    return (saved as Language) || 'bn';
  });

  const [wallpaperClass, setWallpaperClass] = useState<string>(() => {
    return localStorage.getItem('zovril_wallpaper') || 'wa-chat-bg-default';
  });

  // User & Chats State
  const [currentUser, setCurrentUser] = useState<Contact>(() => {
    const saved = localStorage.getItem('zovril_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('zovril_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('zovril_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('zovril_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [statuses, setStatuses] = useState<StatusStory[]>(() => {
    const saved = localStorage.getItem('zovril_statuses');
    return saved ? JSON.parse(saved) : INITIAL_STATUSES;
  });

  const [calls, setCalls] = useState<CallRecord[]>(() => {
    const saved = localStorage.getItem('zovril_calls');
    return saved ? JSON.parse(saved) : INITIAL_CALLS;
  });

  // Navigation & Modals State
  const [activeTab, setActiveTab] = useState<AppTab>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>('tanvir');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddStatusModalOpen, setIsAddStatusModalOpen] = useState(false);
  const [isSpecialsOpen, setIsSpecialsOpen] = useState(false);
  const [statusViewerIndex, setStatusViewerIndex] = useState<number | null>(null);

  // Unique Breakthrough Features States
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isProductivityOpen, setIsProductivityOpen] = useState(false);
  const [isLosslessModalOpen, setIsLosslessModalOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [selfDestructTimer, setSelfDestructTimer] = useState(0);
  const [antiScreenshot, setAntiScreenshot] = useState(false);

  const [chatTasks, setChatTasks] = useState<Record<string, TodoTask[]>>(() => {
    const saved = localStorage.getItem('zovril_chat_tasks');
    return saved
      ? JSON.parse(saved)
      : {
          tanvir: [
            { id: 't1', chatId: 'tanvir', title: 'ফ্রন্টএন্ড ডিজাইন রিভিউ সম্পন্ন করা', isDone: true, createdAt: '১০:০০ AM' },
            { id: 't2', chatId: 'tanvir', title: 'বিকেলে ধানমন্ডি লেকে কফি মিটিং', isDone: false, createdAt: '১০:৩০ AM', priority: 'high' },
          ],
        };
  });

  const [chatNotes, setChatNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('zovril_chat_notes');
    return saved
      ? JSON.parse(saved)
      : {
          tanvir: 'প্রোজেক্টের গিট রিপোজিটরি ব্রাঞ্চ: main, রিলিজ ভার্সন: 2.0',
        };
  });

  // Call Modal State
  const [activeCall, setActiveCall] = useState<{
    contact: Contact;
    type: 'audio' | 'video';
    isIncoming?: boolean;
  } | null>(null);

  // Media Viewer State
  const [mediaViewer, setMediaViewer] = useState<{
    url: string;
    sender: string;
    time: string;
  } | null>(null);

  // Sync dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('zovril_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('zovril_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('zovril_wallpaper', wallpaperClass);
  }, [wallpaperClass]);

  useEffect(() => {
    localStorage.setItem('zovril_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('zovril_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('zovril_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('zovril_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('zovril_statuses', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('zovril_calls', JSON.stringify(calls));
  }, [calls]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  // Helper: Send a message
  const handleSendMessage = (
    text: string,
    type: Message['type'] = 'text',
    mediaUrl?: string,
    replyTo?: Message['replyTo'],
    isLossless?: boolean,
    fileName?: string,
    fileSize?: string,
    selfDestructSeconds?: number
  ) => {
    if (!activeChatId) return;

    sound.playSent();

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: timeString,
      status: 'sent',
      type,
      mediaUrl,
      replyTo,
      isLossless,
      fileName,
      fileSize,
      selfDestructSeconds,
    };

    // Update messages
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }));

    // Update chat lastMessage
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              lastMessage: newMsg,
              unreadCount: 0,
            }
          : c
      )
    );

    // If self-destruct timer is active on this message, auto-burn it
    if (selfDestructSeconds && selfDestructSeconds > 0) {
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: (prev[activeChatId] || []).filter((m) => m.id !== newMsg.id),
        }));
      }, selfDestructSeconds * 1000);
    }

    // Simulate delivery tick
    setTimeout(() => {
      setMessages((prev) => {
        const chatMsgs = prev[activeChatId] || [];
        return {
          ...prev,
          [activeChatId]: chatMsgs.map((m) => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m)),
        };
      });
    }, 600);

    // Handle automated simulated reply
    handleAutomatedResponse(activeChatId, text);
  };

  // Productivity Handlers (To-Do & Notes)
  const handleAddTask = (title: string, priority: 'high' | 'normal' = 'normal') => {
    if (!activeChatId) return;
    const newTask: TodoTask = {
      id: `task_${Date.now()}`,
      chatId: activeChatId,
      title,
      isDone: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority,
    };
    setChatTasks((prev) => {
      const list = prev[activeChatId] || [];
      const updated = { ...prev, [activeChatId]: [newTask, ...list] };
      localStorage.setItem('zovril_chat_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleTask = (taskId: string) => {
    if (!activeChatId) return;
    setChatTasks((prev) => {
      const list = prev[activeChatId] || [];
      const updated = {
        ...prev,
        [activeChatId]: list.map((t) => (t.id === taskId ? { ...t, isDone: !t.isDone } : t)),
      };
      localStorage.setItem('zovril_chat_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!activeChatId) return;
    setChatTasks((prev) => {
      const list = prev[activeChatId] || [];
      const updated = {
        ...prev,
        [activeChatId]: list.filter((t) => t.id !== taskId),
      };
      localStorage.setItem('zovril_chat_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveNote = (text: string) => {
    if (!activeChatId) return;
    setChatNotes((prev) => {
      const updated = { ...prev, [activeChatId]: text };
      localStorage.setItem('zovril_chat_notes', JSON.stringify(updated));
      return updated;
    });
  };

  // Automated simulated intelligent response
  const handleAutomatedResponse = (chatId: string, userText: string) => {
    const targetChat = chats.find((c) => c.id === chatId);
    if (!targetChat) return;

    // Show typing indicator
    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, isTyping: true } : c))
      );
    }, 800);

    // Generate intelligent response
    setTimeout(() => {
      let replyText = '';
      if (targetChat.isMetaAI) {
        // Smart Meta AI reply
        const lower = userText.toLowerCase();
        if (lower.includes('হাই') || lower.includes('hello') || lower.includes('কেমন আছ')) {
          replyText = lang === 'bn'
            ? 'হ্যালো! আমি Meta AI, আপনার ব্যক্তিগত স্মার্ট সহকারী। আপনার দিনটি কেমন কাটছে? কোনো তথ্য জানতে চাইলে আমাকে জিজ্ঞাসা করতে পারেন।'
            : 'Hello! I am Meta AI, your personal intelligent assistant. How can I help you today?';
        } else if (lower.includes('zovril') || lower.includes('Zovril') || lower.includes('অ্যাপ')) {
          replyText = lang === 'bn'
            ? 'এটি একটি সম্পূর্ণ কার্যকরী এবং আধুনিক Zovril ওয়েব ও মেসেঞ্জার অ্যাপ। এখানে আপনি রিয়েল-টাইম চ্যাট, ভয়েস নোট, ফটো শেয়ারিং, অডিও/ভিডিও কল এবং স্ট্যাটাস দেখতে পারবেন!'
            : 'This is a complete, modern Zovril Web clone! You can experience real-time messaging, voice notes, media sharing, calls, and status updates.';
        } else {
          replyText = lang === 'bn'
            ? `আপনার প্রশ্নটি দারুণ! "${userText}" সম্পর্কে আমি আরও বিস্তারিত তথ্য অনুসন্ধান করতে পারি। আপনার কি এ বিষয়ে কোনো নির্দিষ্ট সহায়তা প্রয়োজন?`
            : `That’s a great question! Regarding "${userText}", I can help you with insights, code, translation, or ideas.`;
        }
      } else if (targetChat.id === 'tanvir') {
        const replies = [
          'মুন্না ভাই, ডিজাইনটা একদম অসাধারণ লাগছে! নিখুঁত কাজ হয়েছে। 👌',
          'আলহামদুলিল্লাহ! আমিও একটু পর অনলাইনে এসে কোডটা পুল করছি।',
          'দারুণ আইডিয়া! চলুন বিকেলে দেখা হলে এই নিয়ে বিস্তারিত কথা বলি। ☕',
          'ঠিক আছে ভাইয়া, আমি ফাইলগুলো চেক করে আপনাকে কনফার্ম করছি। 👍',
        ];
        replyText = replies[Math.floor(Math.random() * replies.length)];
      } else if (targetChat.id === 'nusrat') {
        replyText = 'অনেক ধন্যবাদ মুন্না! আমি নতুন ভেক্টর আইকনগুলোর সেট ড্রাইভ ফোল্ডারে আপলোড করে দিয়েছি। 🎨✨';
      } else if (targetChat.isGroup) {
        replyText = 'বন্ধুরা, সবাই সময়মতো চলে এসো কিন্তু! কেউ লেট করলে তার জরিমানা হবে 😂';
      } else {
        replyText = lang === 'bn'
          ? 'মেসেজ পেয়েছি! একটু ব্যস্ত আছি, কিছুক্ষণ পর কল দিচ্ছি।'
          : 'Got your message! A bit tied up right now, will call you soon.';
      }

      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const replyMsg: Message = {
        id: `reply_${Date.now()}`,
        senderId: chatId,
        text: replyText,
        timestamp: timeString,
        status: 'read',
        type: 'text',
      };

      // Play incoming sound
      sound.playReceived();

      // Update messages & set user previous messages to read
      setMessages((prev) => {
        const currentMsgs = prev[chatId] || [];
        const updatedMsgs = currentMsgs.map((m) =>
          m.senderId === currentUser.id ? { ...m, status: 'read' as const } : m
        );
        return {
          ...prev,
          [chatId]: [...updatedMsgs, replyMsg],
        };
      });

      // Stop typing & update chat list
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                isTyping: false,
                lastMessage: replyMsg,
                unreadCount: activeChatId === chatId ? 0 : c.unreadCount + 1,
              }
            : c
        )
      );
    }, 2400);
  };

  // Delete message
  const handleDeleteMessage = (msgId: string) => {
    if (!activeChatId) return;
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).filter((m) => m.id !== msgId),
    }));
  };

  // Add emoji reaction
  const handleReaction = (msgId: string, emoji: string) => {
    if (!activeChatId) return;
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).map((m) => {
        if (m.id !== msgId) return m;
        const currentReactions = { ...(m.reactions || {}) };
        const users = currentReactions[emoji] || [];
        if (users.includes(currentUser.id)) {
          // Toggle off
          const filtered = users.filter((u) => u !== currentUser.id);
          if (filtered.length === 0) {
            delete currentReactions[emoji];
          } else {
            currentReactions[emoji] = filtered;
          }
        } else {
          currentReactions[emoji] = [...users, currentUser.id];
        }
        return { ...m, reactions: currentReactions };
      }),
    }));
  };

  // Star / unstar message
  const handleStarMessage = (msgId: string) => {
    if (!activeChatId) return;
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).map((m) =>
        m.id === msgId ? { ...m, isStarred: !m.isStarred } : m
      ),
    }));
  };

  // Start Call
  const handleStartCall = (type: 'audio' | 'video') => {
    if (!activeChat) return;
    const contact = contacts.find((c) => c.id === activeChat.id) || {
      id: activeChat.id,
      name: activeChat.name,
      phone: activeChat.phone || '+880 1700-000000',
      avatar: activeChat.avatar,
      about: activeChat.about || '',
      isOnline: true,
      lastSeen: 'online',
    };

    setActiveCall({
      contact,
      type,
      isIncoming: false,
    });

    // Add to call history
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newCall: CallRecord = {
      id: `call_${Date.now()}`,
      contactId: contact.id,
      contactName: contact.name,
      contactAvatar: contact.avatar,
      type,
      direction: 'outgoing',
      timestamp: `${lang === 'bn' ? 'আজ' : 'Today'} ${timeString}`,
      duration: '০১:১২',
    };
    setCalls((prev) => [newCall, ...prev]);
  };

  // Start call from sidebar call log or contact
  const handleStartCallWithContact = (contactId: string, type: 'audio' | 'video') => {
    const contact = contacts.find((c) => c.id === contactId) || {
      id: contactId,
      name: 'Contact',
      phone: '+880 1700-000000',
      avatar: '/src/assets/images/avatar_bangladeshi_man_1793440459229.jpg',
      about: '',
      isOnline: true,
      lastSeen: 'online',
    };
    setActiveCall({
      contact,
      type,
      isIncoming: false,
    });
  };

  // Add new custom contact & chat
  const handleAddNewContact = (name: string, phone: string) => {
    const newContactId = `contact_${Date.now()}`;
    const newContact: Contact = {
      id: newContactId,
      name,
      phone,
      avatar: '/src/assets/images/avatar_bangladeshi_man_1793440459229.jpg',
      about: 'Hey there! I am using Zovril.',
      isOnline: true,
      lastSeen: 'online',
    };

    const newChat: Chat = {
      id: newContactId,
      isGroup: false,
      name,
      phone,
      avatar: newContact.avatar,
      about: newContact.about,
      category: 'personal',
      unreadCount: 0,
    };

    setContacts((prev) => [newContact, ...prev]);
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newContactId);
  };

  // Clear single chat
  const handleClearChat = () => {
    if (!activeChatId) return;
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [],
    }));
    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, lastMessage: undefined } : c))
    );
    setShowContactInfo(false);
  };

  // Reset all chats to default
  const handleClearAllChats = () => {
    localStorage.clear();
    setChats(INITIAL_CHATS);
    setMessages(INITIAL_MESSAGES);
    setStatuses(INITIAL_STATUSES);
    setCalls(INITIAL_CALLS);
    setContacts(INITIAL_CONTACTS);
    setCurrentUser(CURRENT_USER);
  };

  // Add new status story
  const handleAddStatus = (newStory: Omit<StatusStory, 'id' | 'viewed'>) => {
    const story: StatusStory = {
      ...newStory,
      id: `story_${Date.now()}`,
      viewed: false,
    };
    setStatuses((prev) => [story, ...prev]);
  };

  // Reply to status story
  const handleReplyToStory = (story: StatusStory, text: string) => {
    setActiveChatId(story.userId);
    handleSendMessage(`[Status Reply: ${story.userName}]: ${text}`);
  };

  // If user is not logged in, show the Zovril Login Portal
  if (!isLoggedIn) {
    return (
      <LoginPortal
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          localStorage.setItem('zovril_logged_in', 'true');
        }}
        lang={lang}
        onToggleLang={setLang}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#eef1f4] dark:bg-[#0c1317]">
      {/* Zovril Web desktop application frame */}
      <div className="relative w-full h-full flex overflow-hidden">
        {/* Sidebar: Chats, Status, Calls, Settings */}
        <div
          className={`${
            activeChatId ? 'hidden lg:flex' : 'flex'
          } w-full lg:w-96 xl:w-105 h-full flex-col z-10 shrink-0`}
        >
          <Sidebar
            currentUser={currentUser}
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={(id) => {
              setActiveChatId(id);
              // Mark as read
              setChats((prev) =>
                prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
              );
            }}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            statuses={statuses}
            onOpenStatusViewer={(idx) => setStatusViewerIndex(idx)}
            onOpenAddStatus={() => setIsAddStatusModalOpen(true)}
            calls={calls}
            onStartCallWithContact={handleStartCallWithContact}
            onOpenNewChat={() => setIsNewChatModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenSpecials={() => setIsSpecialsOpen(true)}
            onOpenLoginPortal={() => {
              setIsLoggedIn(false);
              localStorage.setItem('zovril_logged_in', 'false');
            }}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            lang={lang}
            onToggleLang={setLang}
            onTogglePinChat={(id) => {
              setChats((prev) =>
                prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
              );
            }}
            onDeleteChat={(id) => {
              setChats((prev) => prev.filter((c) => c.id !== id));
              if (activeChatId === id) setActiveChatId(null);
            }}
          />
        </div>

        {/* Right Active Chat Workspace or Welcome Empty State */}
        <main
          className={`${
            activeChatId ? 'flex' : 'hidden lg:flex'
          } flex-1 h-full flex-col relative z-10 min-w-0`}
        >
          {activeChat ? (
            <div className="flex-1 flex h-full overflow-hidden">
              <ChatArea
                chat={activeChat}
                messages={activeMessages}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                onDeleteMessage={handleDeleteMessage}
                onReaction={handleReaction}
                onStarMessage={handleStarMessage}
                onStartCall={handleStartCall}
                onOpenContactInfo={() => setShowContactInfo(!showContactInfo)}
                onBackToChatList={() => setActiveChatId(null)}
                wallpaperClass={wallpaperClass}
                lang={lang}
                onViewImage={(url, sender, time) =>
                  setMediaViewer({ url, sender, time })
                }
                onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
                onOpenProductivity={() => setIsProductivityOpen(true)}
                onOpenLosslessShare={() => setIsLosslessModalOpen(true)}
                selfDestructTimer={selfDestructTimer}
                onSetSelfDestructTimer={setSelfDestructTimer}
                antiScreenshot={antiScreenshot}
                onToggleAntiScreenshot={() => setAntiScreenshot(!antiScreenshot)}
              />

              {/* Contact Info Drawer if open */}
              {showContactInfo && (
                <ContactInfoDrawer
                  isOpen={showContactInfo}
                  onClose={() => setShowContactInfo(false)}
                  chat={activeChat}
                  messages={activeMessages}
                  onStartCall={handleStartCall}
                  onClearChat={handleClearChat}
                  lang={lang}
                />
              )}
            </div>
          ) : (
            /* Zovril Web Welcome Screen when no chat is open */
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f0f2f5] dark:bg-[#111b21] border-b-6 border-emerald-500 text-center select-none">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg mb-6 bg-[#ff00ff] flex items-center justify-center">
                <img src="/src/assets/images/zovril_logo.png" alt="Zovril" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Zovril
              </h2>
              <p className="text-sm text-slate-500 dark:text-[#8696a0] max-w-md leading-relaxed">
                {lang === 'bn'
                  ? 'আপনার বন্ধুদের সাথে চ্যাট করুন, ভয়েস নোট পাঠান, ভিডিও কল করুন এবং স্ট্যাটাস শেয়ার করুন।'
                  : 'Send and receive messages, make audio and video calls, and share status stories across devices.'}
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>
                  {lang === 'bn'
                    ? 'এন্ড-টু-এন্ড এনক্রিপ্টেড'
                    : 'End-to-end encrypted'}
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <StatusViewerModal
        isOpen={statusViewerIndex !== null}
        initialIndex={statusViewerIndex || 0}
        stories={statuses}
        onClose={() => setStatusViewerIndex(null)}
        onReply={handleReplyToStory}
        lang={lang}
      />

      <AddStatusModal
        isOpen={isAddStatusModalOpen}
        onClose={() => setIsAddStatusModalOpen(false)}
        onAddStatus={handleAddStatus}
        lang={lang}
      />

      {activeCall && (
        <CallModal
          isOpen={!!activeCall}
          contact={activeCall.contact}
          type={activeCall.type}
          isIncoming={activeCall.isIncoming}
          onEndCall={() => setActiveCall(null)}
          lang={lang}
        />
      )}

      <NewChatModal
        isOpen={isNewChatModalOpen}
        contacts={contacts}
        onClose={() => setIsNewChatModalOpen(false)}
        onSelectContact={(c) => {
          setActiveChatId(c.id);
          setIsNewChatModalOpen(false);
        }}
        onAddNewContact={handleAddNewContact}
        lang={lang}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={currentUser}
        onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
        wallpaper={wallpaperClass}
        onSelectWallpaper={setWallpaperClass}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        lang={lang}
        onToggleLang={setLang}
        onClearAllChats={handleClearAllChats}
        onLogout={() => {
          setIsLoggedIn(false);
          localStorage.setItem('zovril_logged_in', 'false');
        }}
        onOpenStorageManager={() => setIsStorageModalOpen(true)}
      />

      <StorageManagerModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        lang={lang}
      />

      {mediaViewer && (
        <MediaViewerModal
          isOpen={!!mediaViewer}
          imageUrl={mediaViewer.url}
          senderName={mediaViewer.sender}
          timestamp={mediaViewer.time}
          onClose={() => setMediaViewer(null)}
        />
      )}

      <ZovrilSpecialsModal
        isOpen={isSpecialsOpen}
        onClose={() => setIsSpecialsOpen(false)}
        lang={lang}
        onOpenLossless={() => setIsLosslessModalOpen(true)}
        onOpenAi={() => setIsAiAssistantOpen(true)}
        onOpenProductivity={() => setIsProductivityOpen(true)}
        onOpenStorage={() => setIsStorageModalOpen(true)}
      />

      {activeChat && (
        <>
          <AiAssistantDrawer
            isOpen={isAiAssistantOpen}
            onClose={() => setIsAiAssistantOpen(false)}
            chat={activeChat}
            messages={activeMessages}
            onInsertDraft={(draft) => {
              handleSendMessage(draft);
              setIsAiAssistantOpen(false);
            }}
            lang={lang}
          />

          <ProductivityDrawer
            isOpen={isProductivityOpen}
            onClose={() => setIsProductivityOpen(false)}
            chat={activeChat}
            tasks={chatTasks[activeChat.id] || []}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            note={chatNotes[activeChat.id] || ''}
            onSaveNote={handleSaveNote}
            lang={lang}
          />

          <LosslessShareModal
            isOpen={isLosslessModalOpen}
            onClose={() => setIsLosslessModalOpen(false)}
            onSendLossless={(fileName, fileSize, fileType) => {
              handleSendMessage(
                `📎 [True Lossless File]: ${fileName} (${fileSize})`,
                'lossless_file',
                undefined,
                undefined,
                true,
                fileName,
                fileSize
              );
            }}
            lang={lang}
          />
        </>
      )}
    </div>
  );
}
