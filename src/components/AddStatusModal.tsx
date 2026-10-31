import React, { useState } from 'react';
import { Language, StatusStory } from '../types';
import { I18N } from '../data/mockData';
import { X, Image as ImageIcon, Type, Check } from 'lucide-react';

interface AddStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStatus: (status: Omit<StatusStory, 'id' | 'viewed'>) => void;
  lang: Language;
}

const BG_COLORS = [
  '#075e54',
  '#128c7e',
  '#0d1117',
  '#833ab4',
  '#c0392b',
  '#d35400',
  '#27ae60',
  '#2980b9',
];

export const AddStatusModal: React.FC<AddStatusModalProps> = ({
  isOpen,
  onClose,
  onAddStatus,
  lang,
}) => {
  const t = I18N[lang];
  const [tab, setTab] = useState<'text' | 'image'>('text');
  const [textContent, setTextContent] = useState('');
  const [bgColor, setBgColor] = useState(BG_COLORS[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'text' && !textContent.trim()) return;
    if (tab === 'image' && !imageUrl) return;

    onAddStatus({
      userId: 'user_me',
      userName: lang === 'bn' ? 'মুন্না (আপনি)' : 'Munna (You)',
      userAvatar: '/src/assets/images/avatar_bangladeshi_man_1793440459229.jpg',
      timestamp: lang === 'bn' ? 'এইমাত্র' : 'Just now',
      type: tab,
      content: tab === 'text' ? textContent.trim() : imageUrl,
      caption: tab === 'image' ? caption.trim() : undefined,
      backgroundColor: tab === 'text' ? bgColor : undefined,
    });

    setTextContent('');
    setImageUrl('');
    setCaption('');
    onClose();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#ffffff] dark:bg-[#111b21] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
            {t.addStatus}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-white/10">
          <button
            onClick={() => setTab('text')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'text'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Type className="w-4 h-4" />
            {lang === 'bn' ? 'টেক্সট স্ট্যাটাস' : 'Text Status'}
          </button>
          <button
            onClick={() => setTab('image')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              tab === 'image'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            {lang === 'bn' ? 'ছবি স্ট্যাটাস' : 'Photo Status'}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {tab === 'text' ? (
            <>
              {/* Text canvas preview */}
              <div
                className="w-full h-52 rounded-xl flex items-center justify-center p-6 text-white text-center font-semibold text-xl shadow-inner transition-colors"
                style={{ backgroundColor: bgColor }}
              >
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder={lang === 'bn' ? 'এখানে কিছু লিখুন...' : 'Type status here...'}
                  maxLength={180}
                  className="w-full h-full bg-transparent outline-none resize-none text-center text-white placeholder-white/60 font-semibold text-lg"
                />
              </div>

              {/* Color picker circles */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'bn' ? 'রং পছন্দ করুন:' : 'Pick color:'}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {BG_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBgColor(c)}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                      style={{
                        backgroundColor: c,
                        borderColor: bgColor === c ? '#ffffff' : 'transparent',
                      }}
                    >
                      {bgColor === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Photo selector */}
              <div className="flex flex-col gap-3">
                {imageUrl ? (
                  <div className="relative w-full h-56 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="Selected preview"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-44 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer p-4 text-center group transition-colors">
                    <ImageIcon className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 mb-2 transition-colors" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {lang === 'bn' ? 'ডিভাইস থেকে ছবি আপলোড করুন' : 'Upload photo from device'}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                )}

                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={lang === 'bn' ? 'ক্যাপশন যোগ করুন...' : 'Add a caption...'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={tab === 'text' ? !textContent.trim() : !imageUrl}
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-lg shadow-sm transition-colors"
            >
              {lang === 'bn' ? 'স্ট্যাটাস শেয়ার করুন' : 'Post Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
