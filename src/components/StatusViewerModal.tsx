import React, { useEffect, useState, useRef } from 'react';
import { StatusStory, Language } from '../types';
import { I18N } from '../data/mockData';
import { X, ChevronLeft, ChevronRight, Send, Heart, Pause, Play } from 'lucide-react';

interface StatusViewerModalProps {
  stories: StatusStory[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onReply: (story: StatusStory, text: string) => void;
  lang: Language;
}

export const StatusViewerModal: React.FC<StatusViewerModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  onReply,
  lang,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const t = I18N[lang];
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 50; // update every 50ms
    const totalDuration = 5000; // 5s per story
    const step = (interval / totalDuration) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused, currentIndex, stories.length, onClose]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(currentStory, replyText.trim());
    setReplyText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      {/* Top action buttons */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 text-white/80 hover:text-white transition-colors bg-black/40 rounded-full"
          title={isPaused ? 'Play' : 'Pause'}
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
        <button
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white transition-colors bg-black/40 rounded-full"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main story card */}
      <div
        className="relative w-full max-w-md h-[92vh] max-h-[820px] rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl"
        style={{
          backgroundColor: currentStory.type === 'text' ? currentStory.backgroundColor || '#075e54' : '#111b21',
        }}
      >
        {/* Progress bars header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-1.5 mb-2.5">
            {stories.map((s, idx) => (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            <img
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
            />
            <div className="flex-1 min-w-0 text-white">
              <h4 className="text-sm font-semibold truncate leading-tight">{currentStory.userName}</h4>
              <p className="text-xs text-white/75">{currentStory.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div
          className="flex-1 flex items-center justify-center p-6 text-center select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {currentStory.type === 'image' ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src={currentStory.content}
                alt="Status update"
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-md"
              />
              {currentStory.caption && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-medium">
                  {currentStory.caption}
                </div>
              )}
            </div>
          ) : (
            <div className="text-white text-2xl font-semibold leading-relaxed tracking-wide px-4 drop-shadow-md">
              {currentStory.content}
            </div>
          )}
        </div>

        {/* Navigation tap targets (left & right halves) */}
        <button
          onClick={handlePrev}
          aria-label="Previous story"
          className="absolute left-0 top-16 bottom-20 w-1/3 z-10 flex items-center justify-start pl-2 text-white/0 hover:text-white/40 transition-colors"
        >
          {currentIndex > 0 && <ChevronLeft className="w-8 h-8" />}
        </button>
        <button
          onClick={handleNext}
          aria-label="Next story"
          className="absolute right-0 top-16 bottom-20 w-1/3 z-10 flex items-center justify-end pr-2 text-white/0 hover:text-white/40 transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Bottom Reply Bar */}
        <div className="relative z-20 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onReply(currentStory, '❤️');
                onClose();
              }}
              className="p-2 text-rose-500 hover:scale-110 active:scale-95 transition-transform"
            >
              <Heart className="w-6 h-6 fill-current" />
            </button>
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={lang === 'bn' ? 'উত্তর লিখুন...' : 'Type a reply...'}
              className="flex-1 bg-white/20 text-white placeholder-white/70 px-4 py-2.5 rounded-full text-sm outline-none border border-white/20 focus:border-white/50 backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
