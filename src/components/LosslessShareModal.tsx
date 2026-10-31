import React, { useState } from 'react';
import { Language } from '../types';
import {
  X,
  FileArchive,
  ShieldCheck,
  UploadCloud,
  Check,
  FileText,
  Video,
  Music,
  ArrowRight,
  HardDrive,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface LosslessShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendLossless: (fileName: string, fileSize: string, fileType: string) => void;
  lang: Language;
}

export const LosslessShareModal: React.FC<LosslessShareModalProps> = ({
  isOpen,
  onClose,
  onSendLossless,
  lang,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setSelectedFile({
        name: file.name,
        size: `${sizeMb} MB`,
        type: file.type || 'Raw Binary',
      });
    }
  };

  const handleSend = () => {
    if (!selectedFile) return;
    sound.playSent();
    onSendLossless(selectedFile.name, selectedFile.size, selectedFile.type);
    setSelectedFile(null);
    onClose();
  };

  const handleSelectPreset = (name: string, size: string, type: string) => {
    setSelectedFile({ name, size, type });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111b21] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-600 dark:bg-[#202c33] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/20">
              <HardDrive className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {lang === 'bn' ? 'ট্রু লসলেস ফাইল শেয়ারিং' : 'True Lossless File Share'}
              </h3>
              <p className="text-xs text-emerald-100">
                {lang === 'bn' ? 'আনলিমিটেড সাইজ · কোনো কোয়ালিটি লস নেই' : '0% Compression · 100% Original Quality'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Freedom Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                {lang === 'bn' ? 'কোনো সাইজ লিমিট বা কম্প্রেসশন নেই' : 'Lossless Byte-Accurate Transfer'}
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'bn'
                  ? 'Zovril-এ ছবি বা ভিডিওর রেজুলেশন নষ্ট হয় না। মূল Raw ভিডিও, হাই-রেজ অডিও (FLAC), জিপ (ZIP) বা বড় ফাইল পাঠানো যায়।'
                  : 'Files are delivered bit-for-bit identical to source without downscaling, audio re-encoding, or metadata stripping.'}
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <label className="w-full h-36 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer p-4 text-center group transition-colors bg-slate-50 dark:bg-[#182229]">
            <UploadCloud className="w-9 h-9 text-slate-400 group-hover:text-emerald-500 mb-2 transition-colors" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {selectedFile ? selectedFile.name : lang === 'bn' ? 'ফাইল নির্বাচন করতে ক্লিক করুন' : 'Click to browse files'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              {selectedFile ? `${selectedFile.size} · Ready to send` : 'ZIP, APK, 4K ProRes Video, RAW, ISO, PDF'}
            </span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>

          {/* Quick presets for demo */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              {lang === 'bn' ? 'দ্রুত ডেমো ফাইল নির্বাচন করুন:' : 'Or pick demo lossless package:'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('Project_Source_Code_v2.zip', '142.5 MB', 'application/zip')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2 bg-slate-50 dark:bg-[#182229]"
              >
                <FileArchive className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold truncate text-[11px] text-slate-800 dark:text-slate-200">Source_Code.zip</p>
                  <p className="text-[10px] text-slate-400">142.5 MB · Lossless</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('4K_Cinematic_Footage.mov', '1.2 GB', 'video/quicktime')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left flex items-center gap-2 bg-slate-50 dark:bg-[#182229]"
              >
                <Video className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold truncate text-[11px] text-slate-800 dark:text-slate-200">Cinematic_4K.mov</p>
                  <p className="text-[10px] text-slate-400">1.2 GB · ProRes</p>
                </div>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="button"
              disabled={!selectedFile}
              onClick={handleSend}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <span>{lang === 'bn' ? 'লসলেস পাঠান' : 'Send Lossless'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
