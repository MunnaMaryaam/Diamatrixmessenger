import React, { useEffect, useState, useRef } from 'react';
import { Contact, Language } from '../types';
import { I18N } from '../data/mockData';
import { sound } from '../utils/audio';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  contact: Contact;
  type: 'audio' | 'video';
  isIncoming?: boolean;
  onEndCall: () => void;
  lang: Language;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  contact,
  type,
  isIncoming = false,
  onEndCall,
  lang,
}) => {
  const t = I18N[lang];
  const [callState, setCallState] = useState<'ringing' | 'connected'>(isIncoming ? 'ringing' : 'ringing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(type === 'video');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      sound.stopRingtone();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setSeconds(0);
      setCallState('ringing');
      return;
    }

    // Play ringing tone
    sound.startRingtone();

    // Auto connect after 2.8s for simulation
    const connectTimer = window.setTimeout(() => {
      sound.stopRingtone();
      setCallState('connected');
    }, 2800);

    return () => {
      sound.stopRingtone();
      clearTimeout(connectTimer);
    };
  }, [isOpen]);

  // Handle call timer when connected
  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  // Request actual camera if video call
  useEffect(() => {
    if (!isOpen || !isVideoEnabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setCameraActive(false);
      }
      return;
    }

    navigator.mediaDevices?.getUserMedia?.({ video: true, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      })
      .catch(() => {
        setCameraActive(false);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, isVideoEnabled]);

  if (!isOpen) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    sound.stopRingtone();
    sound.playCallEnd();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onEndCall();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-full max-w-none' : 'max-w-xl h-[85vh] max-h-[700px]'
        } bg-[#111b21] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/10 transition-all`}
      >
        {/* Top bar */}
        <div className="relative z-20 flex items-center justify-between p-6 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium">
              Zovril {type === 'video' ? t.videoCall : t.audioCall}
            </span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-white/70 hover:text-white rounded-full bg-white/10 backdrop-blur-sm"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Center content / Video or Profile display */}
        <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
          {type === 'video' && isVideoEnabled ? (
            <div className="absolute inset-0 w-full h-full bg-[#1e293b] flex items-center justify-center overflow-hidden">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-emerald-950">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    referrerPolicy="no-referrer"
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500 shadow-2xl mb-4"
                  />
                  <div className="text-emerald-400 text-sm font-medium animate-pulse">
                    {callState === 'ringing' ? t.calling : t.connected}
                  </div>
                </div>
              )}

              {/* Picture-in-picture simulated participant */}
              <div className="absolute top-6 right-6 w-28 h-40 rounded-xl overflow-hidden shadow-2xl border-2 border-white/30 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover mb-2 border border-emerald-400"
                />
                <span className="text-white text-[11px] font-medium truncate max-w-[90px] px-1">
                  {contact.name.split(' ')[0]}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center z-10">
              <div className="relative mb-6">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  referrerPolicy="no-referrer"
                  className="w-36 h-36 rounded-full object-cover border-4 border-emerald-500/80 shadow-2xl"
                />
                {callState === 'ringing' && (
                  <div className="absolute -inset-2 rounded-full border-2 border-emerald-400 animate-ping opacity-60" />
                )}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{contact.name}</h3>
              <p className="text-emerald-400 text-sm font-medium tracking-wide">
                {callState === 'ringing' ? (isIncoming ? t.incomingCall : t.calling) : formatDuration(seconds)}
              </p>
              <p className="text-slate-400 text-xs mt-1">{contact.phone}</p>
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="relative z-20 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-6">
          {/* Mute button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-transform active:scale-95 ${
              isMuted ? 'bg-rose-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Video toggle button */}
          <button
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className={`p-4 rounded-full transition-transform active:scale-95 ${
              !isVideoEnabled ? 'bg-rose-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title={isVideoEnabled ? 'Turn off video' : 'Turn on video'}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* End Call button (Red) */}
          <button
            onClick={handleEnd}
            className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-900/40 transition-transform active:scale-90"
            title={t.endCall}
          >
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};
