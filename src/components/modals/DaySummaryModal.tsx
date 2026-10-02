import React from 'react';
import { soundManager } from '../../utils/audio';
import { Sparkles, DollarSign, Award, ArrowRight, Sun } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DaySummaryModalProps {
  isOpen: boolean;
  day: number;
  customersServedToday: number;
  revenueToday: number;
  unlockedNewItem?: string;
  onNextDay: () => void;
}

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({
  isOpen,
  day,
  customersServedToday,
  revenueToday,
  unlockedNewItem,
  onNextDay,
}) => {
  if (!isOpen) return null;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const handleAdvance = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
    });
    soundManager.playSuccessFanfare();
    onNextDay();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#FFFBF8] to-[#FFF5F2] p-6 shadow-2xl border-2 border-rose-300 text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex p-3 rounded-full bg-rose-100 text-rose-600 border border-rose-200 mb-2 animate-bounce">
          <Sun className="w-8 h-8 text-amber-500" />
        </div>

        <h3 className="text-xs font-bold uppercase tracking-widest text-rose-700">
          Tổng Kết Cuối Ngày
        </h3>
        <h2 className="text-2xl font-black font-display text-rose-950 mt-1">
          Hoàn Thành Ngày {day}!
        </h2>

        {/* Stats card */}
        <div className="mt-4 p-3.5 bg-white/90 rounded-2xl border border-rose-100 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Khách phục vụ hôm nay:</span>
            <span className="font-extrabold text-rose-950 font-mono">
              {customersServedToday} lượt khách
            </span>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-rose-50 pt-2">
            <span className="text-slate-500">Doanh thu ngày hôm nay:</span>
            <span className="font-black text-emerald-600 font-mono text-sm">
              +{formatMoney(revenueToday)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-rose-50 pt-2">
            <span className="text-slate-500">Thưởng hoàn thành ngày:</span>
            <span className="font-bold text-amber-600 font-mono">+100 XP & +50.000đ</span>
          </div>
        </div>

        {/* Unlocked new reward showcase (Section XCIX) */}
        {unlockedNewItem && (
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl border border-amber-200 text-left flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200/80 flex items-center justify-center text-lg flex-shrink-0 animate-pulse">
              ✨
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                MỞ KHÓA VẬT TƯ MỚI!
              </span>
              <span className="text-xs font-extrabold text-rose-950 block">
                {unlockedNewItem}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleAdvance}
          className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-sm font-black text-white shadow-lg hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2"
        >
          <span>Bắt Đầu Ngày {day + 1}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
