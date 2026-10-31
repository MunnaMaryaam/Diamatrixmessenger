import React from 'react';
import { X, Download } from 'lucide-react';

interface MediaViewerModalProps {
  isOpen: boolean;
  imageUrl: string;
  senderName: string;
  timestamp: string;
  onClose: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  imageUrl,
  senderName,
  timestamp,
  onClose,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white">
        <div>
          <h4 className="font-semibold text-sm">{senderName}</h4>
          <p className="text-xs text-white/70">{timestamp}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={imageUrl}
            download={`zovril_media_${Date.now()}.jpg`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main image */}
      <div className="relative max-w-4xl max-h-[85vh] flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Media viewer"
          referrerPolicy="no-referrer"
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};
