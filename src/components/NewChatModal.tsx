import React, { useState } from 'react';
import { Contact, Language } from '../types';
import { I18N } from '../data/mockData';
import { X, Search, UserPlus, Users, MessageSquare } from 'lucide-react';

interface NewChatModalProps {
  isOpen: boolean;
  contacts: Contact[];
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
  onAddNewContact: (name: string, phone: string) => void;
  lang: Language;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  contacts,
  onClose,
  onSelectContact,
  onAddNewContact,
  lang,
}) => {
  const t = I18N[lang];
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  if (!isOpen) return null;

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    onAddNewContact(newName.trim(), newPhone.trim());
    setNewName('');
    setNewPhone('');
    setShowAddForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 dark:bg-[#202c33] text-white">
          <h3 className="font-semibold text-lg">{t.newChat}</h3>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#202c33] px-3 py-2 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'bn' ? 'নাম বা নম্বর দিয়ে খুঁজুন...' : 'Search name or number...'}
              className="bg-transparent text-sm w-full outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-1">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#202c33] text-emerald-600 dark:text-emerald-400 font-medium text-sm transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <span>{lang === 'bn' ? 'নতুন কন্ট্যাক্ট যুক্ত করুন' : 'New Contact'}</span>
          </button>
        </div>

        {/* New Contact Form Slide-in */}
        {showAddForm && (
          <form onSubmit={handleCreateContact} className="p-4 bg-slate-50 dark:bg-[#202c33]/50 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={lang === 'bn' ? 'পুরো নাম (যেমন: শাকিল আহমেদ)' : 'Full Name (e.g. Shakil)'}
              required
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111b21] outline-none focus:border-emerald-500"
            />
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder={lang === 'bn' ? 'ফোন নম্বর (+880 17...)' : 'Phone (+880 17...)'}
              required
              className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111b21] outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                {lang === 'bn' ? 'সংরক্ষণ ও চ্যাট' : 'Save & Chat'}
              </button>
            </div>
          </form>
        )}

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">
              {lang === 'bn' ? 'কোনো কন্ট্যাক্ট পাওয়া যায়নি' : 'No contacts found'}
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectContact(c);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202c33] transition-colors text-left"
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {c.name}
                    </span>
                    {c.isOnline && (
                      <span className="text-[11px] text-emerald-500 font-medium">
                        {t.online}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {c.about}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
