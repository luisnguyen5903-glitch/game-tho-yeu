import React, { useState } from 'react';
import { NailCharm } from '../types/game';
import { NAIL_CHARMS } from '../data/initialData';
import { GemstoneGraphic } from './GemstoneGraphic';
import { Lock, Sparkles, Eye, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GemstoneShowcaseTrayProps {
  currentDay: number;
  unlockedCharms: string[];
  inventory: Record<string, number>;
  onSelectCharmForPreview?: (charm: NailCharm) => void;
}

export const GemstoneShowcaseTray: React.FC<GemstoneShowcaseTrayProps> = ({
  currentDay,
  unlockedCharms,
  inventory,
  onSelectCharmForPreview,
}) => {
  const [selectedCharm, setSelectedCharm] = useState<NailCharm>(NAIL_CHARMS[0]);

  return (
    <div className="p-3.5 bg-gradient-to-b from-[#FFFDF9] to-[#FFF5ED] rounded-2xl border-2 border-rose-200/90 shadow-md select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <h3 className="text-xs font-black font-display text-rose-950 uppercase tracking-wide">
              Kệ Đá & Phụ Kiện Salon
            </h3>
            <span className="text-[10px] text-rose-800/70">
              {unlockedCharms.length}/{NAIL_CHARMS.length} loại đã mở khóa
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          ✨ Chuẩn Swarovski
        </span>
      </div>

      {/* Gemstone Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 max-h-[260px] overflow-y-auto pr-1">
        {NAIL_CHARMS.map((charm) => {
          const isUnlocked = currentDay >= charm.unlockedAtDay || unlockedCharms.includes(charm.id);
          const stock = inventory[charm.id] || 0;
          const isSelected = selectedCharm.id === charm.id;

          return (
            <div
              key={charm.id}
              onClick={() => {
                setSelectedCharm(charm);
                if (onSelectCharmForPreview) onSelectCharmForPreview(charm);
                soundManager.playTap();
              }}
              className={`p-2.5 rounded-xl border relative transition cursor-pointer flex flex-col items-center justify-between text-center ${
                !isUnlocked
                  ? 'bg-slate-50/70 border-slate-200 opacity-60'
                  : isSelected
                  ? 'bg-rose-50/90 border-rose-400 shadow-sm ring-1 ring-rose-400'
                  : 'bg-white border-rose-100 hover:border-rose-300'
              }`}
            >
              {/* Lock Badge if locked */}
              {!isUnlocked && (
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-slate-800/80 text-white rounded text-[9px] font-bold flex items-center gap-0.5 z-10">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Ngày {charm.unlockedAtDay}</span>
                </div>
              )}

              {/* Rarity Star Pill */}
              {isUnlocked && (
                <span
                  className={`absolute top-1.5 left-1.5 text-[8px] font-bold px-1.5 py-0.2 rounded-full ${
                    charm.rarity === 'legendary'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : charm.rarity === 'epic'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {charm.rarity.toUpperCase()}
                </span>
              )}

              {/* Gemstone Artwork rendering */}
              <div className="my-2 transition-transform hover:scale-115">
                <GemstoneGraphic category={charm.category} color={charm.color} size={36} sparkle={isUnlocked} />
              </div>

              {/* Name & Stock info */}
              <div className="w-full">
                <h4 className="text-[11px] font-bold text-rose-950 truncate">{charm.name}</h4>
                <div className="text-[10px] text-rose-800/70 mt-0.5">
                  {isUnlocked ? (
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Còn {stock} viên
                    </span>
                  ) : (
                    <span className="text-slate-400">Chưa mở khóa</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
