import React, { useState } from 'react';
import { TodoTask, ChatNote, Language, Chat } from '../types';
import {
  X,
  CheckSquare,
  FileEdit,
  Bell,
  Plus,
  Trash2,
  Check,
  Calendar,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ProductivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
  tasks: TodoTask[];
  onAddTask: (title: string, priority: 'high' | 'normal') => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  note: string;
  onSaveNote: (content: string) => void;
  lang: Language;
}

export const ProductivityDrawer: React.FC<ProductivityDrawerProps> = ({
  isOpen,
  onClose,
  chat,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  note,
  onSaveNote,
  lang,
}) => {
  const [tab, setTab] = useState<'todo' | 'note' | 'reminder'>('todo');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'normal'>('normal');
  const [localNote, setLocalNote] = useState(note);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('15m');
  const [reminderActive, setReminderActive] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  if (!isOpen) return null;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskPriority);
    setNewTaskTitle('');
    sound.playSent();
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalNote(e.target.value);
    onSaveNote(e.target.value);
  };

  const handleSetReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) return;
    setReminderActive(true);
    sound.playSent();
    setTimeout(() => {
      sound.playReceived();
      alert(`🔔 রিমাইন্ডার (${chat.name}): ${reminderTitle}`);
      setReminderActive(false);
    }, reminderTime === '5s' ? 5000 : reminderTime === '15m' ? 15000 : 30000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white dark:bg-[#111b21] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 select-none">
      {/* Header */}
      <div className="h-16 px-4 bg-emerald-600 dark:bg-[#202c33] text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/20">
            <CheckSquare className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h3 className="font-bold text-sm">
              {lang === 'bn' ? 'প্রোডাক্টিভিটি টুলস' : 'Productivity Suite'}
            </h3>
            <p className="text-[11px] text-emerald-100">
              {chat.name} · {lang === 'bn' ? 'টাস্ক, নোট ও রিমাইন্ডার' : 'Tasks, Notes & Alerts'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-white/80 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#182229]">
        <button
          onClick={() => setTab('todo')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            tab === 'todo'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#111b21]'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          {lang === 'bn' ? 'টু-ডু লিস্ট' : 'To-Do'}
        </button>
        <button
          onClick={() => setTab('note')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            tab === 'note'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#111b21]'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" />
          {lang === 'bn' ? 'নোটপ্যাড' : 'Scratchpad'}
        </button>
        <button
          onClick={() => setTab('reminder')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            tab === 'reminder'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#111b21]'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          {lang === 'bn' ? 'রিমাইন্ডার' : 'Reminder'}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs select-text">
        {/* TO-DO TAB */}
        {tab === 'todo' && (
          <div className="space-y-4">
            <form onSubmit={handleCreateTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={lang === 'bn' ? 'নতুন টাস্ক লিখুন...' : 'Add a new action item...'}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#182229] outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Task Items */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p>{lang === 'bn' ? 'কোনো টাস্ক নেই। চ্যাট থেকে গুরুত্বপূর্ণ কাজ নোট করুন।' : 'No tasks yet.'}</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      task.isDone
                        ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                        : 'bg-white dark:bg-[#182229] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div
                      onClick={() => onToggleTask(task.id)}
                      className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
                    >
                      <div
                        className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-colors ${
                          task.isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {task.isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs">{task.title}</span>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SCRATCHPAD TAB */}
        {tab === 'note' && (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'bn' ? 'চ্যাট সম্পর্কিত নোট' : 'Contact Scratchpad'}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(localNote);
                  setCopiedNote(true);
                  setTimeout(() => setCopiedNote(false), 2000);
                }}
                className="text-[11px] text-slate-400 hover:text-emerald-600 flex items-center gap-1"
              >
                {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNote ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>

            <textarea
              value={localNote}
              onChange={handleNoteChange}
              placeholder={
                lang === 'bn'
                  ? 'এই ব্যক্তির সাথে জরুরি তথ্য, কোড, পাসওয়ার্ড বা আইডি এখানে সেভ রাখুন (স্বয়ংক্রিয়ভাবে সংরক্ষিত হবে)...'
                  : 'Write persistent notes, ideas, or meeting logs with this contact...'
              }
              className="flex-1 w-full h-80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#182229] outline-none focus:border-emerald-500 resize-none leading-relaxed text-slate-800 dark:text-slate-200"
            />
          </div>
        )}

        {/* REMINDER TAB */}
        {tab === 'reminder' && (
          <form onSubmit={handleSetReminder} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300">
              <span className="font-semibold block mb-0.5">
                {lang === 'bn' ? '⏰ স্মার্ট রিমাইন্ডার সেট করুন' : '⏰ Smart Reminder'}
              </span>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                {lang === 'bn'
                  ? 'চ্যাটের মধ্যে যেকোনো গুরুত্বপূর্ণ কাজের জন্য নোটিফিকেশন সেট করুন।'
                  : 'Get an in-app reminder ping for this discussion.'}
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'bn' ? 'রিমাইন্ডার বিষয়' : 'Reminder Title'}
              </label>
              <input
                type="text"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: বিকেলে ৩টায় প্রজেক্ট ডেলিভারি' : 'e.g. Call at 3:00 PM'}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#182229] outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                {lang === 'bn' ? 'কখন মনে করিয়ে দেবে?' : 'When to remind?'}
              </label>
              <select
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#182229] outline-none focus:border-emerald-500"
              >
                <option value="5s">{lang === 'bn' ? 'টেস্ট: ৫ সেকেন্ড পর' : 'Test: In 5 seconds'}</option>
                <option value="15m">{lang === 'bn' ? '১৫ মিনিট পর' : 'In 15 minutes'}</option>
                <option value="1h">{lang === 'bn' ? '১ ঘণ্টা পর' : 'In 1 hour'}</option>
                <option value="tomorrow">{lang === 'bn' ? 'আগামীকাল সকাল ৯:০০' : 'Tomorrow 9:00 AM'}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={reminderActive}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <Bell className="w-4 h-4" />
              <span>
                {reminderActive
                  ? lang === 'bn'
                    ? 'রিমাইন্ডার সক্রিয় আছে...'
                    : 'Reminder Active...'
                  : lang === 'bn'
                  ? 'রিমাইন্ডার সেট করুন'
                  : 'Set Reminder'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
