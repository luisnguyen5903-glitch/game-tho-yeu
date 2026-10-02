import React from 'react';
import { UNLOCK_ROADMAP } from '../data/initialData';
import { X, Lock, CheckCircle2, Sparkles, Calendar } from 'lucide-react';

interface UnlockRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
}

export const UnlockRoadmapModal: React.FC<UnlockRoadmapModalProps> = ({
  isOpen,
  onClose,
  currentDay,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#FFFBF8] p-5 shadow-2xl border-2 border-rose-200 relative flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div>
            <h3 className="text-sm font-bold text-rose-950 font-display flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500" />
              Lộ Trình Mở Khóa (Ngày 1 - 65)
            </h3>
            <p className="text-[11px] text-rose-700/80">
              Bạn đang ở <strong>Ngày {currentDay}</strong> · Khám phá những điều bất ngờ phía trước
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-rose-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 space-y-2.5 overflow-y-auto pr-1 flex-1">
          {UNLOCK_ROADMAP.map((item) => {
            const isUnlocked = currentDay >= item.day;
            const isNext = !isUnlocked && item.day <= currentDay + 3;

            return (
              <div
                key={item.day}
                className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-emerald-50/70 border-emerald-200 shadow-2xs'
                    : isNext
                    ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-300/40 shadow-xs'
                    : 'bg-white border-rose-100 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-2xs flex-shrink-0 ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-800'
                        : isNext
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-rose-100 text-rose-900 font-mono">
                        NGÀY {item.day}
                      </span>
                      <h4 className="text-xs font-bold text-rose-950 truncate max-w-[150px]">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-rose-800/80 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã Mở
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                      <Lock className="w-3 h-3" /> Khóa
                    </span>
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
