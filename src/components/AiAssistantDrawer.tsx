import React, { useState } from 'react';
import { Message, Chat, Language } from '../types';
import {
  X,
  Sparkles,
  FileText,
  Send,
  Copy,
  Check,
  Wand2,
  Languages,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
  messages: Message[];
  onInsertDraft: (text: string) => void;
  lang: Language;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  chat,
  messages,
  onInsertDraft,
  lang,
}) => {
  const [tab, setTab] = useState<'summary' | 'draft' | 'translate'>('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftTone, setDraftTone] = useState<'professional' | 'friendly' | 'concise' | 'urgent'>('friendly');
  const [suggestedDrafts, setSuggestedDrafts] = useState<string[]>([
    'ধন্যবাদ! আমি বিষয়টি রিভিউ করেছি এবং সব ঠিক আছে।',
    'আলহামদুলিল্লাহ, কাজ অনেকটাই এগিয়েছে। বিকেলে বিস্তারিত আপডেট দিচ্ছি।',
    'ঠিক আছে, তাহলে আমরা নির্দিষ্ট সময়ে মিটিংয়ে যুক্ত হচ্ছি।',
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    sound.playSent();
    setTimeout(() => {
      setIsGenerating(false);
      const textMessages = messages.map((m) => `${m.senderId}: ${m.text}`).join(' ');
      if (lang === 'bn') {
        setSummaryResult(`📌 **আলোচনার মূল বিষয়বস্তু:**
• ${chat.name}-এর সাথে প্রোজেক্টের ফ্রন্টএন্ড ডিজাইন ও অগ্রগতি নিয়ে আলোচনা হয়েছে।
• কোড রিভিউ ও মিটিং শিডিউলের সিদ্ধান্ত চূড়ান্ত হয়েছে।

🎯 **গুরুত্বপূর্ণ সিদ্ধান্ত ও অ্যাকশন আইটেমস:**
1. ডিজাইনের স্পেক্স ও ডার্ক মোড কালার প্যালেট পর্যালোচিত হয়েছে।
2. নতুন ফিচারগুলোর ভয়েস নোট ও কলিং টেস্ট সম্পন্ন করা হয়েছে।
3. পরবর্তী আপডেট বিকেলে অথবা নির্দিষ্ট সময় অনুযায়ী জানানো হবে।

⏱️ **স্ট্যাটাস:** কার্যক্রম যথাসময়ে চলমান রয়েছে।`);
      } else {
        setSummaryResult(`📌 **Key Discussion Points:**
• Reviewed project frontend implementation and current progress with ${chat.name}.
• Addressed code styling, dark theme palette, and testing checklist.

🎯 **Action Items & Decisions:**
1. Finalized voice note recording and audio call parameters.
2. Verified that UI conforms to Zovril design principles.
3. Follow-up sync scheduled for the evening.

⏱️ **Next Steps:** Proceeding with deployment.`);
      }
    }, 1200);
  };

  const handleGenerateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftPrompt.trim()) return;
    setIsGenerating(true);
    sound.playSent();
    setTimeout(() => {
      setIsGenerating(false);
      let d1 = '';
      let d2 = '';
      let d3 = '';

      if (draftTone === 'professional') {
        d1 = `ধন্যবাদ। আপনার নির্দেশ অনুযায়ী কাজগুলো সম্পন্ন করা হয়েছে। অনুগ্রহ করে রিভিউ করে জানাবেন।`;
        d2 = `আমি আপনার প্রস্তাবটি দেখেছি। আগামী কালের মধ্যে আমরা চূড়ান্ত ফলাফল শেয়ার করতে পারব।`;
        d3 = `বিষয়টি অত্যন্ত গুরুত্বপূর্ণ। এটি সমাধানের জন্য প্রয়োজনীয় পদক্ষেপ গ্রহণ করা হয়েছে।`;
      } else if (draftTone === 'urgent') {
        d1 = `জরুরি নোটিশ: অনুগ্রহ করে মেসেজটি দেখামাত্রই আমাকে দ্রুত কল বা কনফার্ম করবেন।`;
        d2 = `ডেডলাইন আসন্ন! দয়া করে ফাইলগুলো এখনই পাঠিয়ে দিন।`;
        d3 = `এটি অত্যন্ত জরুরি, আপনার অনুমোদন ছাড়া কাজ এগোচ্ছে না।`;
      } else if (draftTone === 'concise') {
        d1 = `ঠিক আছে, সম্মতি জানাচ্ছি। কাজ শুরু করছি।`;
        d2 = `পেয়েছি। একটু পর বিস্তারিত জানাচ্ছি।`;
        d3 = `ডান! সব ঠিকঠাক আছে।`;
      } else {
        d1 = `আরে দারুণ! আইডিয়াটা চমৎকার লেগেছে, চলো এভাবেই এগিয়ে যাই! 😊`;
        d2 = `কোনো চিন্তা করো না বন্ধু, কাজটা আমি সুন্দরভাবে শেষ করে দিচ্ছি। ☕`;
        d3 = `ধন্যবাদ ভাই! তুমি সময়মতো জানালে খুব সুবিধা হতো।`;
      }
      setSuggestedDrafts([d1, d2, d3]);
    }, 1000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white dark:bg-[#111b21] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 select-none">
      {/* Drawer Header */}
      <div className="h-16 px-4 bg-emerald-600 dark:bg-[#202c33] text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm">
              {lang === 'bn' ? 'এআই চ্যাট অ্যাসিস্ট্যান্ট' : 'AI Chat Assistant'}
            </h3>
            <p className="text-[11px] text-emerald-100">
              {lang === 'bn' ? 'সামারি, স্মার্ট রিপ্লাই ও ড্রাফট' : 'Summarizer & Reply Drafter'}
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
          onClick={() => setTab('summary')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            tab === 'summary'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#111b21]'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          {lang === 'bn' ? 'চ্যাট সামারি' : 'Summary'}
        </button>
        <button
          onClick={() => setTab('draft')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            tab === 'draft'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#111b21]'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          {lang === 'bn' ? 'স্মার্ট ড্রাফটার' : 'Drafter'}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs select-text">
        {tab === 'summary' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-300">
              <span className="font-semibold block text-emerald-700 dark:text-emerald-400 mb-1">
                {lang === 'bn' ? '💡 এআই কথোপকথন বিশ্লেষণ' : '💡 Conversation Analysis'}
              </span>
              <p className="leading-relaxed">
                {lang === 'bn'
                  ? `${chat.name}-এর সাথে হওয়া সাম্প্রতিক সমস্ত বার্তার সারাংশ ও মূল করণীয়সমূহ এক ক্লিকে তৈরি করুন।`
                  : `Generate a smart executive summary and action items from your messages with ${chat.name}.`}
              </p>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {isGenerating
                  ? lang === 'bn'
                    ? 'বিশ্লেষণ করা হচ্ছে...'
                    : 'Analyzing conversation...'
                  : lang === 'bn'
                  ? 'এখনই সামারি তৈরি করুন'
                  : 'Generate Chat Summary'}
              </span>
            </button>

            {summaryResult && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#182229] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {lang === 'bn' ? 'সারসংক্ষেপ ফলাফল' : 'Executive Summary'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(summaryResult, 'sum')}
                      className="p-1 text-slate-500 hover:text-emerald-600 rounded"
                      title="Copy"
                    >
                      {copiedIndex === 'sum' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onInsertDraft(summaryResult)}
                      className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-700"
                    >
                      {lang === 'bn' ? 'চ্যাটে পাঠান' : 'Insert'}
                    </button>
                  </div>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                  {summaryResult}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'draft' && (
          <div className="space-y-4">
            <form onSubmit={handleGenerateDraft} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'bn' ? 'কী বিষয়ে রিপ্লাই দিতে চান?' : 'What do you want to reply?'}
                </label>
                <input
                  type="text"
                  value={draftPrompt}
                  onChange={(e) => setDraftPrompt(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: বলুন কাজ শেষ, ফাইল পাঠাচ্ছি...' : 'e.g. Say task done, sending file...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#182229] outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tone Selection */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  {lang === 'bn' ? 'ভাষার ধরণ (Tone):' : 'Tone:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'friendly', bn: 'বন্ধুত্বপূর্ণ', en: 'Friendly' },
                    { id: 'professional', bn: 'অফিসিয়াল', en: 'Professional' },
                    { id: 'concise', bn: 'সংক্ষিপ্ত', en: 'Concise' },
                    { id: 'urgent', bn: 'জরুরি', en: 'Urgent' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDraftTone(t.id as typeof draftTone)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition-colors font-medium ${
                        draftTone === t.id
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {lang === 'bn' ? t.bn : t.en}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !draftPrompt.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Wand2 className="w-4 h-4" />
                <span>
                  {isGenerating
                    ? lang === 'bn'
                      ? 'ড্রাফট তৈরি হচ্ছে...'
                      : 'Drafting replies...'
                    : lang === 'bn'
                    ? 'স্মার্ট ড্রাফট তৈরি করুন'
                    : 'Generate Smart Drafts'}
                </span>
              </button>
            </form>

            {/* Suggested Smart Draft Cards */}
            <div className="space-y-2.5 pt-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                {lang === 'bn' ? 'প্রস্তাবিত স্মার্ট উত্তরসমূহ:' : 'Suggested Smart Replies:'}
              </span>

              {suggestedDrafts.map((draft, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#182229] border border-slate-200 dark:border-slate-800 space-y-2 hover:border-emerald-500/60 transition-colors"
                >
                  <p className="leading-relaxed text-slate-800 dark:text-slate-200">{draft}</p>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleCopy(draft, idx)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === idx ? 'কপি হয়েছে' : 'কপি'}</span>
                    </button>
                    <button
                      onClick={() => onInsertDraft(draft)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <span>{lang === 'bn' ? 'ব্যবহার করুন' : 'Use this'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
