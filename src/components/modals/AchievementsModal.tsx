import React from 'react';
import { Achievement } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { Trophy, Award, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onClaimAchievement: (achievementId: string) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  onClaimAchievement,
}) => {
  if (!isOpen) return null;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#FFFBF8] p-5 shadow-2xl border-2 border-rose-200 relative flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div>
            <h3 className="text-sm font-bold text-rose-950 font-display flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Thành Tựu Bàn Tay Vàng
            </h3>
            <p className="text-[11px] text-rose-700/80">Hoàn thành các cột mốc để nhận thưởng lớn</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-rose-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 space-y-2.5 overflow-y-auto pr-1 flex-1">
          {achievements.map((ach) => {
            const isCompleted = ach.currentProgress >= ach.targetProgress;
            const percent = Math.min(100, Math.round((ach.currentProgress / ach.targetProgress) * 100));

            return (
              <div
                key={ach.id}
                className="p-3 bg-white rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between gap-3 hover:border-rose-200 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-rose-950">{ach.title}</h4>
                    <span className="text-[10px] font-mono text-rose-700 font-bold">
                      {ach.currentProgress}/{ach.targetProgress}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800/80 mt-0.5">{ach.description}</p>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-rose-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="text-[10px] text-amber-700 font-bold mt-1 inline-block">
                    Thưởng: +{formatMoney(ach.rewardMoney)} · +{ach.rewardXp} XP
                  </span>
                </div>

                <div className="flex-shrink-0">
                  {ach.isClaimed ? (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                      Đã nhận ✓
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        onClaimAchievement(ach.id);
                        soundManager.playCashRegister();
                        confetti({ particleCount: 50, spread: 60 });
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-xs hover:brightness-105 active:scale-95 animate-bounce"
                    >
                      Nhận
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Chưa xong</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
