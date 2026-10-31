import React, { useState, useEffect } from 'react';
import { Language, Contact } from '../types';
import { I18N } from '../data/mockData';
import {
  Smartphone,
  QrCode,
  Shield,
  ArrowRight,
  RefreshCw,
  Check,
  ChevronDown,
  Camera,
  MessageSquare,
  Lock,
  Globe,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface LoginPortalProps {
  onLoginSuccess: (user: Contact) => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const COUNTRIES = [
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Pakistan', code: '+92', flag: '🇵🇰' },
];

export const LoginPortal: React.FC<LoginPortalProps> = ({
  onLoginSuccess,
  lang,
  onToggleLang,
  isDarkMode,
  onToggleTheme,
}) => {
  const [loginMethod, setLoginMethod] = useState<'qr' | 'phone'>('qr');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);

  // Profile setup fields
  const [name, setName] = useState('Munna');
  const [about, setAbout] = useState('Available | জরুরি প্রয়োজনে কল করুন ✨');
  const [avatarUrl, setAvatarUrl] = useState('/src/assets/images/avatar_bangladeshi_man_1793440459229.jpg');

  // QR Code refresh animation
  const [qrActive, setQrActive] = useState(true);
  const [qrCountdown, setQrCountdown] = useState(60);

  // QR countdown effect
  useEffect(() => {
    if (loginMethod !== 'qr') return;
    const interval = window.setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          setQrActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loginMethod, qrActive]);

  // OTP resend timer effect
  useEffect(() => {
    if (otpStep !== 'otp') return;
    setResendTimer(30);
    const interval = window.setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [otpStep]);

  const handleRefreshQR = () => {
    setQrActive(true);
    setQrCountdown(60);
  };

  const handleSimulateQRScan = () => {
    sound.playSent();
    const newUser: Contact = {
      id: 'user_me',
      name: name || (lang === 'bn' ? 'মুন্না' : 'Munna'),
      phone: `${selectedCountry.code} 1712-345678`,
      avatar: avatarUrl,
      about: about,
      isOnline: true,
      lastSeen: 'online',
    };
    onLoginSuccess(newUser);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    sound.playSent();
    setOtpStep('otp');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.slice(-1);
    setOtpCode(newOtp);

    // auto-focus next
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length === 6) {
      sound.playSent();
      setOtpStep('profile');
    }
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    sound.playSent();

    const newUser: Contact = {
      id: 'user_me',
      name: name.trim(),
      phone: `${selectedCountry.code} ${phoneNumber || '1712-345678'}`,
      avatar: avatarUrl,
      about: about.trim(),
      isOnline: true,
      lastSeen: 'online',
    };
    onLoginSuccess(newUser);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eef1f4] dark:bg-[#111b21] flex flex-col justify-between select-none">
      {/* Top Emerald Header Banner */}
      <header className="h-48 md:h-56 bg-[#00a884] dark:bg-[#202c33] px-6 py-6 flex items-start justify-between relative shadow-sm">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md bg-white flex items-center justify-center">
              <img src="/src/assets/images/zovril_logo.png" alt="Zovril" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
              ZOVRIL
            </span>
          </div>

          {/* Language & Theme Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-white text-xs font-semibold backdrop-blur-sm transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-black/10 hover:bg-black/20 text-white text-xs backdrop-blur-sm transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Centered Login Card */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 -mt-24 md:-mt-28 mb-12 z-10 flex flex-col">
        <div className="bg-white dark:bg-[#182229] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/5 overflow-hidden flex flex-col">
          {/* Method Selection Bar */}
          <div className="flex border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setLoginMethod('qr');
                setOtpStep('phone');
              }}
              className={`flex-1 py-4 text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                loginMethod === 'qr'
                  ? 'border-[#00a884] text-[#00a884] dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <QrCode className="w-4 h-4" />
              {lang === 'bn' ? 'কিউআর কোড দিয়ে লগইন (QR Code)' : 'Log in with QR Code'}
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-4 text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                loginMethod === 'phone'
                  ? 'border-[#00a884] text-[#00a884] dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              {lang === 'bn' ? 'ফোন নম্বর দিয়ে লগইন (Phone OTP)' : 'Log in with Phone Number'}
            </button>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-10">
            {loginMethod === 'qr' ? (
              /* QR Code Login View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Instructions */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                      {lang === 'bn' ? 'Zovril ওয়েব ব্যবহার করুন' : 'Use Zovril on your computer'}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                      {lang === 'bn'
                        ? 'আপনার মোবাইল ফোনের সাথে সরাসরি কানেক্ট করুন'
                        : 'To easily sync messages between your phone and computer'}
                    </p>
                  </div>

                  <ol className="space-y-4 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        ১
                      </span>
                      <span>
                        {lang === 'bn'
                          ? 'আপনার ফোনে Zovril খুলুন'
                          : 'Open Zovril on your phone'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        ২
                      </span>
                      <span>
                        {lang === 'bn'
                          ? 'মেনু (⋮) বা সেটিংস এ যান এবং "Linked Devices" সিলেক্ট করুন'
                          : 'Tap Menu (⋮) or Settings and select Linked Devices'}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        ৩
                      </span>
                      <span>
                        {lang === 'bn'
                          ? '"Link a Device" বাটনে ট্যাপ করুন এবং এই কিউআর কোডটি স্ক্যান করুন'
                          : 'Tap "Link a Device" and point your phone to this screen'}
                      </span>
                    </li>
                  </ol>

                  {/* Instant Demo QR Scan CTA */}
                  <div className="pt-2">
                    <button
                      onClick={handleSimulateQRScan}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold text-xs md:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{lang === 'bn' ? 'তাৎক্ষণিক স্ক্যান ও প্রবেশ করুন (Demo Login)' : 'Instant Scan & Login (Demo)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* QR Code Presentation */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative p-6 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center">
                    {/* Simulated SVG QR Code Matrix */}
                    <div className="relative w-56 h-56 bg-slate-900 rounded-lg p-2.5 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                        {/* Top-Left Finder */}
                        <rect x="5" y="5" width="28" height="28" rx="2" />
                        <rect x="10" y="10" width="18" height="18" fill="#0f172a" />
                        <rect x="14" y="14" width="10" height="10" />

                        {/* Top-Right Finder */}
                        <rect x="67" y="5" width="28" height="28" rx="2" />
                        <rect x="72" y="10" width="18" height="18" fill="#0f172a" />
                        <rect x="76" y="14" width="10" height="10" />

                        {/* Bottom-Left Finder */}
                        <rect x="5" y="67" width="28" height="28" rx="2" />
                        <rect x="10" y="72" width="18" height="18" fill="#0f172a" />
                        <rect x="14" y="76" width="10" height="10" />

                        {/* Data Modules Pattern */}
                        <rect x="38" y="10" width="6" height="6" />
                        <rect x="48" y="10" width="6" height="6" />
                        <rect x="38" y="24" width="6" height="6" />
                        <rect x="54" y="24" width="6" height="6" />
                        <rect x="10" y="38" width="6" height="6" />
                        <rect x="24" y="38" width="6" height="6" />
                        <rect x="38" y="38" width="8" height="8" />
                        <rect x="52" y="38" width="6" height="6" />
                        <rect x="64" y="38" width="6" height="6" />
                        <rect x="78" y="38" width="6" height="6" />

                        <rect x="38" y="54" width="6" height="6" />
                        <rect x="48" y="54" width="6" height="6" />
                        <rect x="60" y="54" width="6" height="6" />

                        <rect x="38" y="68" width="6" height="6" />
                        <rect x="52" y="68" width="8" height="8" />
                        <rect x="66" y="68" width="6" height="6" />
                        <rect x="78" y="68" width="8" height="8" />
                        <rect x="38" y="82" width="6" height="6" />
                        <rect x="52" y="82" width="6" height="6" />
                        <rect x="70" y="82" width="6" height="6" />
                      </svg>

                      {/* Zovril center badge */}
                      <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <MessageSquare className="w-6 h-6 fill-current" />
                      </div>

                      {/* Expired Overlay */}
                      {!qrActive && (
                        <div className="absolute inset-0 bg-slate-900/90 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-white text-xs font-semibold mb-2">
                            {lang === 'bn' ? 'কোড মেয়াদোত্তীর্ণ হয়েছে' : 'QR code expired'}
                          </p>
                          <button
                            onClick={handleRefreshQR}
                            className="px-4 py-2 bg-[#00a884] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-[#008f6f]"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            {lang === 'bn' ? 'নতুন কোড নিন' : 'Click to reload'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 font-medium">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        {qrActive
                          ? lang === 'bn'
                            ? `কোড রিলোড হতে বাকি ${qrCountdown} সেকেন্ড`
                            : `Expires in ${qrCountdown}s`
                          : lang === 'bn'
                          ? 'রিলোড করতে ক্লিক করুন'
                          : 'Reload to activate'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Phone Number & OTP Login Flow */
              <div className="max-w-md mx-auto">
                {otpStep === 'phone' && (
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {lang === 'bn' ? 'আপনার ফোন নম্বর লিখুন' : 'Enter your phone number'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {lang === 'bn'
                          ? 'Zovril আপনার নম্বরে একটি ওটিপি (OTP) কোড পাঠাবে'
                          : 'Zovril will send an SMS with a 6-digit code to verify your phone number'}
                      </p>
                    </div>

                    {/* Country Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {lang === 'bn' ? 'দেশ নির্বাচন করুন' : 'Select Country'}
                      </label>
                      <select
                        value={selectedCountry.name}
                        onChange={(e) => {
                          const c = COUNTRIES.find((cntry) => cntry.name === e.target.value);
                          if (c) setSelectedCountry(c);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111b21] text-xs font-medium outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.flag} {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phone Number Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#202c33] text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {selectedCountry.code}
                        </span>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="1712 345678"
                          required
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111b21] text-xs font-medium outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold text-xs md:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      <span>{lang === 'bn' ? 'পরবর্তী (Next)' : 'Next'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {otpStep === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {lang === 'bn' ? 'কোড যাচাইকরণ' : 'Verifying your number'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {lang === 'bn'
                          ? `${selectedCountry.code} ${phoneNumber} নম্বরে পাঠানো ৬ সংখ্যার কোড লিখুন`
                          : `Enter the 6-digit code sent to ${selectedCountry.code} ${phoneNumber}`}
                      </p>
                      <span className="inline-block mt-2 text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono">
                        Demo Code: 123456
                      </span>
                    </div>

                    {/* 6 Digit Inputs */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      {otpCode.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-input-${i}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111b21] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <button
                        type="button"
                        onClick={() => setOtpStep('phone')}
                        className="hover:underline text-slate-600 dark:text-slate-400"
                      >
                        {lang === 'bn' ? 'নম্বর পরিবর্তন করুন' : 'Wrong number?'}
                      </button>
                      <button
                        type="button"
                        disabled={resendTimer > 0}
                        onClick={() => {
                          setResendTimer(30);
                          sound.playSent();
                        }}
                        className="text-emerald-600 dark:text-emerald-400 disabled:opacity-50 font-medium"
                      >
                        {resendTimer > 0
                          ? `${lang === 'bn' ? 'পুনরায় কোড' : 'Resend code in'} ${resendTimer}s`
                          : lang === 'bn'
                          ? 'কোড আবার পাঠান'
                          : 'Resend code'}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOtpCode(['1', '2', '3', '4', '5', '6'])}
                        className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {lang === 'bn' ? 'অটো-ফিল (123456)' : 'Auto-fill (123456)'}
                      </button>
                      <button
                        type="submit"
                        disabled={otpCode.join('').length !== 6}
                        className="flex-1 py-2.5 rounded-xl bg-[#00a884] hover:bg-[#008f6f] disabled:opacity-40 text-white font-semibold text-xs transition-colors"
                      >
                        {lang === 'bn' ? 'যাচাই করুন' : 'Verify'}
                      </button>
                    </div>
                  </form>
                )}

                {otpStep === 'profile' && (
                  <form onSubmit={handleCompleteProfile} className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {lang === 'bn' ? 'প্রোফাইল তথ্য' : 'Profile info'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {lang === 'bn'
                          ? 'আপনার নাম এবং ঐচ্ছিক প্রোফাইল ছবি প্রদান করুন'
                          : 'Please provide your name and an optional profile picture'}
                      </p>
                    </div>

                    {/* Avatar Picker */}
                    <div className="flex justify-center">
                      <label className="relative cursor-pointer group">
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/80 shadow-md group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                          <Camera className="w-6 h-6" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFile}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {lang === 'bn' ? 'আপনার নাম' : 'Type your name'}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Munna"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111b21] text-xs font-medium outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    {/* About / Bio */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {lang === 'bn' ? 'স্ট্যাটাস / বায়ো' : 'About / Status'}
                      </label>
                      <input
                        type="text"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Available | Hey there!"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#111b21] text-xs font-medium outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-white font-semibold text-xs md:text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      <span>{lang === 'bn' ? 'Zovril শুরু করুন' : 'Finish & Start Zovril'}</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5 text-emerald-500" />
        <span>
          {lang === 'bn'
            ? 'আপনার ব্যক্তিগত মেসেজ ও কল সম্পূর্ণ সুরক্ষিত এবং এন্ড-টু-এন্ড এনক্রিপ্টেড।'
            : 'Your personal messages are end-to-end encrypted'}
        </span>
      </footer>
    </div>
  );
};
