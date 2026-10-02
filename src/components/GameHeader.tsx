import React from 'react';
import { Volume2, VolumeX, Sparkles, Sun, Moon } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface GameHeaderProps {
  day: number;
  dayPhase: 'prep' | 'serving' | 'ended';
  timeOfDay: string;
  money: number;
  rating: number;
  reviewCount: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  day,
  dayPhase,
  money,
  rating,
  reviewCount,
  level,
  xp,
  xpToNextLevel,
  soundEnabled,
  onToggleSound,
}) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const xpPercent = Math.min(100, Math.round((xp / xpToNextLevel) * 100));

  return (
    <header className="relative w-full bg-gradient-to-r from-[#501D29] via-[#632030] to-[#501D29] text-white px-3 py-2.5 shadow-md border-b border-rose-950/40 select-none">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Day & Phase indicator */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200">
            {dayPhase === 'prep' ? (
              <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '15s' }} />
            ) : (
              <Moon className="w-3.5 h-3.5 text-rose-300" />
            )}
            <span className="font-display tracking-wide text-sm font-extrabold text-amber-100">
              Ngày {day}
            </span>
            <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-700/50">
              {dayPhase === 'prep' ? 'Chuẩn bị' : dayPhase === 'serving' ? 'Mở cửa' : 'Tổng kết'}
            </span>
          </div>

          {/* Level & XP Mini Bar */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-bold text-rose-200/90 tracking-tight">
              Cấp {level}
            </span>
            <div className="w-16 h-1.5 bg-rose-950/80 rounded-full overflow-hidden border border-rose-800/60">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-[9px] text-amber-200/70 font-mono">
              {xp}/{xpToNextLevel}
            </span>
          </div>
        </div>

        {/* Center: Cash Register (KÉT) */}
        <div className="flex flex-col items-center justify-center bg-rose-950/50 px-3 py-1 rounded-xl border border-rose-800/40 shadow-inner">
          <span className="text-[9px] font-bold tracking-widest text-amber-300/80 uppercase">
            KÉT TIỀN
          </span>
          <div className="text-base sm:text-lg font-black font-display text-amber-300 tracking-tight flex items-center gap-1">
            <span>{formatMoney(money)}</span>
          </div>
        </div>

        {/* Right: Rating, Audio Toggle, PWA */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-amber-400 font-bold text-xs">★</span>
            <span className="font-bold text-amber-200">{rating.toFixed(1)}</span>
            <span className="text-[10px] text-rose-200/70">· {reviewCount} đánh giá</span>
          </div>

          <div className="flex items-center gap-1.5">
            <PWAInstallButton />
            
            <button
              onClick={() => {
                onToggleSound();
                soundManager.playTap();
              }}
              className="p-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 hover:text-white transition active:scale-90"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
              aria-label="Âm thanh"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-300" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
