import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { soundManager } from '../utils/audio';
import { Sparkles, Heart, Play, ShoppingBag, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SalonInteriorSceneProps {
  state: GameState;
  activeTab: 'kho' | 'keda' | 'gia' | 'nangcap' | 'danhgia' | 'sosach';
  onSelectTab: (tab: 'kho' | 'keda' | 'gia' | 'nangcap' | 'danhgia' | 'sosach') => void;
  onStartServiceCustomer: () => void;
  onOpenHagglingModal: () => void;
  onOpenMarketingModal: () => void;
  onOpenAchievementsModal: () => void;
}

export const SalonInteriorScene: React.FC<SalonInteriorSceneProps> = ({
  state,
  activeTab,
  onSelectTab,
  onStartServiceCustomer,
  onOpenHagglingModal,
  onOpenMarketingModal,
  onOpenAchievementsModal,
}) => {
  const [bunnyHopActive, setBunnyHopActive] = useState(false);
  const [bunnySpeech, setBunnySpeech] = useState<string>('Chào chị iu! Chạm vào đồ đạc trong tiệm hoặc bấm Bàn Nail để đón khách nha~ 🐰💖');
  const [bunnyPosition, setBunnyPosition] = useState<'center' | 'shelf' | 'table' | 'counter'>('center');
  const [lampOn, setLampOn] = useState(true);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; x: number; y: number; char: string }[]>([]);

  // Trigger bunny hop on activeTab change
  useEffect(() => {
    triggerBunnyHop();
    if (activeTab === 'kho') {
      setBunnyPosition('shelf');
      setBunnySpeech('Đây là Kệ Sơn! Chị có thể mua thêm nhiều màu pastel và thạch jelly cực xinh nè~ 💅');
    } else if (activeTab === 'keda') {
      setBunnyPosition('shelf');
      setBunnySpeech('Tủ đá quý lấp lánh quá! Đính đá lên móng khách sẽ thích mê và tip đậm luôn! 💎✨');
    } else if (activeTab === 'gia') {
      setBunnyPosition('counter');
      setBunnySpeech('Bảng menu giá nè! Cân nhắc giá hợp lý để khách ghé đông nườm nượp nha chị! 🏷️');
    } else if (activeTab === 'nangcap') {
      setBunnyPosition('table');
      setBunnySpeech('Nâng cấp tiệm để tăng danh tiếng và nhận thêm nhiều tiền tip mỗi ngày nhé! ⭐');
    } else if (activeTab === 'danhgia') {
      setBunnyPosition('center');
      setBunnySpeech('Khách để lại nhiều đánh giá tích cực lắm, chị nhớ trả lời để tăng thân thiết nha! 💬');
    } else if (activeTab === 'sosach') {
      setBunnyPosition('counter');
      setBunnySpeech('Sổ thu chi hôm nay rõ ràng từng đồng luôn, tiệm mình đang làm ăn phát đạt lắm! 📊');
    }
  }, [activeTab]);

  const triggerBunnyHop = () => {
    setBunnyHopActive(true);
    setTimeout(() => setBunnyHopActive(false), 600);
  };

  const handleBunnyClick = () => {
    soundManager.playBunnySqueak();
    triggerBunnyHop();

    const tips = [
      'Chị iu ơi, bấm vào Bàn Làm Móng chính giữa để mở cửa đón khách nha! 🐰💕',
      'Đừng quên ghé Chợ Kim Biên trả giá với cô Ba để giảm 25% tiền nhập đồ nha! 🛍️',
      'Khách sộp thích móng form Almond đính đá nơ lắm đó chị! 🎀',
      'Tiệm sạch sẽ, phục vụ chu đáo là 5 sao đầy tay luôn! ⭐⭐⭐⭐⭐',
      'Thỏ Bé Bông vừa lau sạch bóng bàn làm móng rồi nè, sẵn sàng phục vụ rồi! 💅',
    ];
    setBunnySpeech(tips[Math.floor(Math.random() * tips.length)]);

    // Spawn heart particles
    const chars = ['💖', '🐰', '✨', '🥕', '🌸'];
    const newItems = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + i,
      x: 45 + Math.random() * 10,
      y: 55 - Math.random() * 15,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
    setFloatingParticles((prev) => [...prev, ...newItems]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => !newItems.find((ni) => ni.id === p.id)));
    }, 1200);
  };

  const getBunnyCoords = () => {
    switch (bunnyPosition) {
      case 'shelf':
        return { left: '25%', top: '56%' };
      case 'counter':
        return { left: '76%', top: '60%' };
      case 'table':
        return { left: '38%', top: '70%' };
      default:
        return { left: '50%', top: '65%' };
    }
  };

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] rounded-3xl overflow-hidden border-2 border-rose-200/90 shadow-2xl select-none bg-[#FDF0EA]">
      {/* ---------------- 1. ILLUSTRATED COZY SALON INTERIOR BACKGROUND ---------------- */}
      <img
        src="/src/assets/images/salon_interior_1790917928582.jpg"
        alt="Nội thất tiệm nail thỏ xinh"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      />

      {/* Ambient Lighting Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          lampOn
            ? 'bg-gradient-to-t from-black/25 via-transparent to-amber-200/20'
            : 'bg-black/35 backdrop-brightness-75'
        }`}
      />

      {/* ---------------- 2. SUBTLE DRIFTING SAKURA PETALS (PETAL-SLOW) ---------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
        {[
          { left: '10%', delay: '0s', dur: '7s' },
          { left: '28%', delay: '2.5s', dur: '8.5s' },
          { left: '50%', delay: '1s', dur: '6.5s' },
          { left: '72%', delay: '3.2s', dur: '9s' },
          { left: '88%', delay: '0.8s', dur: '7.5s' },
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

      {/* Floating Interactive Hearts/Particles */}
      {floatingParticles.map((item) => (
        <div
          key={item.id}
          className="absolute z-40 pointer-events-none animate-float-up text-base font-bold drop-shadow-sm"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          {item.char}
        </div>
      ))}

      {/* ---------------- 3. LAYERED ABSOLUTE POSITIONING: INTERACTIVE HOTSPOTS ---------------- */}
      {/* (A) KỆ SƠN GEL (Top Left Hotspot) */}
      <div
        onClick={() => {
          onSelectTab('kho');
          soundManager.playTap();
        }}
        className={`absolute top-[16%] left-[4%] sm:left-[6%] p-2 rounded-2xl backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-20 ${
          activeTab === 'kho'
            ? 'bg-white/95 border-2 border-rose-500 ring-4 ring-rose-300/50'
            : 'bg-white/85 hover:bg-white/95 border border-rose-300/80'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg">🛍️</span>
          <div>
            <div className="text-[11px] sm:text-xs font-black text-rose-950 font-display flex items-center gap-1">
              <span>Kệ Sơn Gel</span>
              <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded-full">
                {state.unlockedPolishes.length} màu
              </span>
            </div>
            <span className="text-[9.5px] font-bold text-rose-600 block">
              Bấm để xem kho & nhập hàng ➜
            </span>
          </div>
        </div>
      </div>

      {/* (B) BẢNG MENU GIÁ (Top Center-Left) */}
      <div
        onClick={() => {
          onSelectTab('gia');
          soundManager.playTap();
        }}
        className={`absolute top-[16%] left-[38%] p-2 rounded-2xl backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-20 ${
          activeTab === 'gia'
            ? 'bg-[#351614]/95 text-white border-2 border-amber-400 ring-4 ring-amber-300/50'
            : 'bg-[#351614]/85 hover:bg-[#351614]/95 text-white border border-amber-600/70'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg">🏷️</span>
          <div>
            <div className="text-[11px] sm:text-xs font-black text-amber-200 font-display">
              Bảng Menu Giá
            </div>
            <span className="text-[9.5px] font-mono text-amber-100/90 block">
              Sơn gel: {Math.round(state.servicePrices.gelColor / 1000)}k · Sửa giá ➜
            </span>
          </div>
        </div>
      </div>

      {/* (C) TỦ ĐÁ QUÝ & CHARM (Top Right Hotspot) */}
      <div
        onClick={() => {
          onSelectTab('keda');
          soundManager.playTap();
        }}
        className={`absolute top-[16%] right-[4%] sm:right-[6%] p-2 rounded-2xl backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-20 ${
          activeTab === 'keda'
            ? 'bg-white/95 border-2 border-indigo-500 ring-4 ring-indigo-300/50'
            : 'bg-white/85 hover:bg-white/95 border border-indigo-300/80'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg animate-pulse">💎</span>
          <div>
            <div className="text-[11px] sm:text-xs font-black text-indigo-950 font-display flex items-center gap-1">
              <span>Tủ Đá Quý</span>
              <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded-full">
                {state.unlockedCharms.length} loại
              </span>
            </div>
            <span className="text-[9.5px] font-bold text-indigo-600 block">
              Xem khay pha lê & charm ➜
            </span>
          </div>
        </div>
      </div>

      {/* (D) BẰNG KHEN & ĐÁNH GIÁ (Mid Right) */}
      <div
        onClick={() => {
          onSelectTab('danhgia');
          soundManager.playTap();
        }}
        className={`absolute top-[36%] right-[4%] sm:right-[6%] p-2 rounded-2xl backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-20 ${
          activeTab === 'danhgia'
            ? 'bg-white/95 border-2 border-rose-500 ring-4 ring-rose-300/50'
            : 'bg-white/85 hover:bg-white/95 border border-rose-300/80'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg">⭐</span>
          <div>
            <div className="text-[11px] sm:text-xs font-black text-rose-950 font-display flex items-center gap-1">
              <span>Bằng Khen Khách</span>
              <span className="text-[10px] font-black text-amber-500">
                {state.averageRating.toFixed(1)}★
              </span>
            </div>
            <span className="text-[9.5px] font-medium text-rose-700 block">
              {state.reviews.length} đánh giá hài lòng ➜
            </span>
          </div>
        </div>
      </div>

      {/* (E) GHẾ SOFA & NÂNG CẤP TIỆM (Mid Left Hotspot) */}
      <div
        onClick={() => {
          onSelectTab('nangcap');
          soundManager.playTap();
        }}
        className={`absolute top-[36%] left-[4%] sm:left-[6%] p-2 rounded-2xl backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-20 ${
          activeTab === 'nangcap'
            ? 'bg-white/95 border-2 border-amber-500 ring-4 ring-amber-300/50'
            : 'bg-white/85 hover:bg-white/95 border border-amber-300/80'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg">✨</span>
          <div>
            <div className="text-[11px] sm:text-xs font-black text-rose-950 font-display flex items-center gap-1">
              <span>Nâng Cấp Salon</span>
              <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full">
                Cấp {state.level}
              </span>
            </div>
            <span className="text-[9.5px] font-bold text-amber-700 block">
              Nâng cấp ghế & đèn UV ➜
            </span>
          </div>
        </div>
      </div>

      {/* (F) QUẦY THU NGÂN & SỔ SÁCH (Bottom Right) */}
      <div
        onClick={() => {
          onSelectTab('sosach');
          soundManager.playTap();
        }}
        className={`absolute bottom-[16%] right-[4%] sm:right-[6%] p-2 rounded-2xl backdrop-blur-md shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-20 ${
          activeTab === 'sosach'
            ? 'bg-white/95 border-2 border-amber-500 ring-4 ring-amber-300/50'
            : 'bg-white/85 hover:bg-white/95 border border-amber-300/80'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base sm:text-lg">📊</span>
          <div>
            <div className="text-[11px] sm:text-xs font-black text-rose-950 font-display">
              Quầy Thu Ngân
            </div>
            <span className="text-[9.5px] font-mono text-amber-800 font-bold block">
              Xem sổ sách & lãi lỗ ➜
            </span>
          </div>
        </div>
      </div>

      {/* (G) MAIN MANICURE STATION & CALL TO ACTION (Centerpiece) */}
      <div className="absolute bottom-[8%] left-[50%] -translate-x-1/2 z-25 flex flex-col items-center">
        <button
          onClick={() => {
            onStartServiceCustomer();
            soundManager.playSuccessFanfare();
            confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
          }}
          className="py-2.5 sm:py-3 px-5 sm:px-6 rounded-full bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#E11D48] text-white font-black text-xs sm:text-sm font-display shadow-2xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 border-2 border-rose-200 animate-bounce"
          style={{ animationDuration: '2.5s' }}
        >
          <Play className="w-4 h-4 fill-white" />
          <span>🐰 MỞ CỬA ĐÓN KHÁCH · BẮT ĐẦU LÀM NAIL ✨</span>
        </button>
      </div>

      {/* ---------------- 4. ANIMATED RABBIT MASCOT CHARACTER ('bunnyHop') ---------------- */}
      <div
        onClick={handleBunnyClick}
        style={{ left: getBunnyCoords().left, top: getBunnyCoords().top }}
        className={`absolute z-35 cursor-pointer transition-all duration-500 ease-out -translate-x-1/2 -translate-y-1/2 select-none ${
          bunnyHopActive ? 'animate-bunny-hop' : 'animate-cozy-breathe'
        }`}
      >
        <div className="relative flex flex-col items-center group">
          {/* High-res circular mascot badge */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-300 via-rose-300 to-pink-300 shadow-xl border-2 border-white overflow-hidden group-hover:scale-110 transition-transform">
            <img
              src="/src/assets/images/bunny_mascot_1790917940969.jpg"
              alt="Thỏ Bé Bông"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Floating Tag */}
          <div className="mt-1 px-2 py-0.5 bg-white/95 backdrop-blur-xs rounded-full border border-rose-300 text-[9px] font-black text-rose-900 shadow-sm flex items-center gap-1 whitespace-nowrap">
            <span>Thỏ Bông</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bunny Guide Speech Bubble (Bottom Floating) */}
      {bunnySpeech && (
        <div
          onClick={() => setBunnySpeech('')}
          className="absolute bottom-2 left-3 right-3 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-rose-200 p-2.5 shadow-xl z-30 flex items-center gap-2.5 cursor-pointer transition-all hover:bg-white animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-rose-300 shadow-2xs">
            <img
              src="/src/assets/images/bunny_mascot_1790917940969.jpg"
              alt="Mascot"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs font-semibold text-rose-950 flex-1 leading-snug">
            {bunnySpeech}
          </p>
          <span className="text-[10px] text-rose-400 font-bold px-1.5 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 flex-shrink-0">
            ✕
          </span>
        </div>
      )}

      {/* Top Header Controls Bar inside Interior Scene */}
      <div className="absolute top-2.5 inset-x-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-rose-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-rose-950 font-display">
            Phòng Làm Móng Thỏ Xinh · Cấp {state.level}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1">
          <button
            onClick={() => {
              setLampOn(!lampOn);
              soundManager.playTap();
            }}
            className={`p-1.5 rounded-full bg-white/95 border shadow-sm transition active:scale-95 ${
              lampOn ? 'text-amber-500 border-amber-300' : 'text-gray-400 border-gray-200'
            }`}
            title="Bật/Tắt Đèn Salon"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
