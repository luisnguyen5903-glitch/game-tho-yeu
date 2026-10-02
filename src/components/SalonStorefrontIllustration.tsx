import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Sparkles, Sun, Sunset, Moon, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SalonStorefrontProps {
  level: number;
  shopName: string;
}

type TimeOfDay = 'day' | 'sunset' | 'night';

export const SalonStorefrontIllustration: React.FC<SalonStorefrontProps> = ({ level, shopName }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [bunnyHop, setBunnyHop] = useState(false);
  const [bunnySpeech, setBunnySpeech] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number; char: string }[]>([]);
  const [lightsOn, setLightsOn] = useState(true);

  const getTierTitle = (lvl: number) => {
    if (lvl === 1) return 'Cấp 1 · Tiệm Thỏ Xinh Vỉa Hè';
    if (lvl === 2) return 'Cấp 2 · Tiệm Phố Hoa & Đèn Thỏ';
    if (lvl === 3) return 'Cấp 3 · Salon Thỏ Phong Cách Pastel';
    if (lvl === 4) return 'Cấp 4 · Tiệm Mặt Phố Hàn Quốc';
    if (lvl === 5) return 'Cấp 5 · Boutique Thỏ Xinh Sang Trọng';
    if (lvl === 6) return 'Cấp 6 · Luxury Nail Studio';
    return `Cấp ${lvl} · Hoàng Gia Nail Palace`;
  };

  const bunnyQuotes = [
    'Chào chị iu! Em là Thỏ Bông, chúc tiệm mình hôm nay đông khách nha~ 🐰💖',
    'Tai thỏ nhúc nhích là sắp có khách sộp ghé tiệm nè! 🥕✨',
    'Thỏ đã chuẩn bị sẵn các chai sơn pastel bóng loáng cho chị rồi đó! 💅🌸',
    'Nắng đẹp thế này làm một bộ móng đính đá lấp lánh là mê ly luôn~ 💕',
    'Vuốt tai thỏ nhận 100% may mắn & khách tip thật nhiều nha! 🍀🐰',
    'Chị chủ tiệm ơi, em vừa tỉa xong mấy cành hoa tulip ngoài cửa đó! 🌷',
  ];

  const handleBunnyClick = (e: React.MouseEvent) => {
    soundManager.playBunnySqueak();
    setBunnyHop(true);
    setTimeout(() => setBunnyHop(false), 600);

    const randomQuote = bunnyQuotes[Math.floor(Math.random() * bunnyQuotes.length)];
    setBunnySpeech(randomQuote);

    // Spawn floating cute icons
    const chars = ['💖', '🐰', '✨', '🥕', '🌸', '💅'];
    const newHearts = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + i,
      x: 18 + Math.random() * 20,
      y: 60 - Math.random() * 15,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
    setFloatingHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
    }, 1400);
  };

  const handleWindchimeClick = () => {
    soundManager.playChime();
    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.35, x: 0.5 },
      colors: ['#FFB6C1', '#FFE4E1', '#FFF0F5', '#E6E6FA'],
    });
  };

  const handleCycleTime = () => {
    soundManager.playTap();
    if (timeOfDay === 'day') setTimeOfDay('sunset');
    else if (timeOfDay === 'sunset') setTimeOfDay('night');
    else setTimeOfDay('day');
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-rose-200/90 shadow-2xl select-none flex flex-col justify-end p-2 bg-[#FFF4ED]">
      {/* ---------------- 1. HIGH-RESOLUTION GENERATED STOREFRONT ARTWORK ---------------- */}
      <img
        src="/src/assets/images/salon_storefront_1790917913848.jpg"
        alt="Mặt tiền tiệm nail thỏ xinh"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
      />

      {/* Time-of-Day Lighting Overlay Filter */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          timeOfDay === 'day'
            ? 'bg-amber-100/10'
            : timeOfDay === 'sunset'
            ? 'bg-gradient-to-t from-rose-900/40 via-amber-600/20 to-purple-900/30'
            : 'bg-indigo-950/50 backdrop-brightness-75'
        }`}
      />

      {/* Floating Cherry Blossom Petals (Chill vibe) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {[
          { left: '10%', delay: '0s', dur: '7s' },
          { left: '30%', delay: '2s', dur: '8.5s' },
          { left: '55%', delay: '1s', dur: '6s' },
          { left: '75%', delay: '3.5s', dur: '9s' },
          { left: '88%', delay: '0.5s', dur: '7.5s' },
        ].map((petal, i) => (
          <div
            key={i}
            className="absolute -top-4 text-xs select-none opacity-70 animate-petal-slow drop-shadow-xs"
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.dur,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* Floating cute tap reaction particles */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute z-30 pointer-events-none animate-float-up text-sm font-bold drop-shadow-sm"
          style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
        >
          {heart.char}
        </div>
      ))}

      {/* ---------------- 2. DYNAMIC SIGNBOARD OVERLAY ---------------- */}
      <div className="absolute top-[18%] left-[50%] -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-[#FFF5F2]/95 via-[#FFFDF9]/95 to-[#FFF5F2]/95 backdrop-blur-md border-2 border-[#D98A7B] shadow-lg flex items-center gap-1.5 animate-cozy-breathe">
          <span className="text-sm">🐰</span>
          <span className="text-xs sm:text-sm font-black font-display text-[#8B263E] tracking-wide whitespace-nowrap">
            {shopName.toUpperCase()}
          </span>
          <span className="text-xs">💅</span>
        </div>
      </div>

      {/* ---------------- 3. INTERACTIVE HOTSPOTS ON STOREFRONT ---------------- */}
      {/* (A) Interactive Bunny Mascot Hotspot (Right Doorway) */}
      <div
        onClick={handleBunnyClick}
        className={`absolute bottom-[18%] right-[14%] sm:right-[18%] z-25 cursor-pointer flex flex-col items-center group transition-transform ${
          bunnyHop ? 'animate-bunny-hop' : 'hover:scale-105'
        }`}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/90 shadow-xl overflow-hidden bg-rose-100 ring-2 ring-rose-400/60">
          <img
            src="/src/assets/images/bunny_mascot_1790917940969.jpg"
            alt="Thỏ Bé Bông"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="mt-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[9px] font-bold text-rose-950 border border-rose-300 shadow-xs flex items-center gap-1 whitespace-nowrap">
          <span>Chạm em 🐰</span>
        </span>
      </div>

      {/* (B) Windchime Bell Hotspot */}
      <button
        onClick={handleWindchimeClick}
        className="absolute top-[28%] left-[50%] -translate-x-1/2 z-20 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs border border-amber-300 shadow-sm text-[9px] font-bold text-amber-900 hover:bg-white active:scale-95 transition flex items-center gap-1"
      >
        <span>🔔</span> Rung Chuông Gió
      </button>

      {/* ---------------- 4. TOP CONTROLS & STATUS BADGES ---------------- */}
      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-30">
        {/* Tier status badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-rose-200/90 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-rose-950 font-display">
            {getTierTitle(level)}
          </span>
        </div>

        {/* Chill time-of-day switch button */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-0.5 rounded-full border border-rose-200 shadow-sm">
          <button
            onClick={handleCycleTime}
            title="Đổi thời gian / Chill mode"
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-rose-800 hover:bg-rose-100 transition active:scale-95"
          >
            {timeOfDay === 'day' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {timeOfDay === 'sunset' && <Sunset className="w-3.5 h-3.5 text-rose-500" />}
            {timeOfDay === 'night' && <Moon className="w-3.5 h-3.5 text-indigo-500" />}
            <span className="hidden sm:inline">
              {timeOfDay === 'day' ? 'Nắng sớm' : timeOfDay === 'sunset' ? 'Hoàng hôn' : 'Đêm chill'}
            </span>
          </button>
          <button
            onClick={() => {
              setLightsOn(!lightsOn);
              soundManager.playTap();
            }}
            className={`p-1 rounded-full text-[10px] transition ${
              lightsOn ? 'text-amber-500' : 'text-gray-400'
            }`}
            title="Bật/tắt đèn tiệm"
          >
            <Sparkles className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Bunny Greeter Speech Bubble */}
      {bunnySpeech && (
        <div
          onClick={() => setBunnySpeech(null)}
          className="absolute top-12 left-3 right-3 bg-white/95 backdrop-blur-md text-rose-950 text-xs font-semibold px-3 py-2.5 rounded-2xl border-2 border-rose-200 shadow-xl z-30 flex items-start gap-2.5 cursor-pointer animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-rose-300">
            <img
              src="/src/assets/images/bunny_mascot_1790917940969.jpg"
              alt="Mascot"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="flex-1 leading-snug">{bunnySpeech}</p>
          <span className="text-[10px] text-rose-400 font-bold self-center">✕</span>
        </div>
      )}

      {/* Bottom Hint / Chill status bar */}
      <div className="relative z-20 mt-1 flex items-center justify-between px-2.5 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-rose-200/80 text-[10px] text-rose-900 font-medium shadow-sm">
        <span className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>Chạm vào <b>Thỏ Bông</b> hoặc <b>Chuông Gió</b> để tương tác!</span>
        </span>
        <span className="font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-lg">
          {level >= 5 ? '👑 Tiệm Đỉnh Cao' : `⭐ Cấp ${level}`}
        </span>
      </div>
    </div>
  );
};
