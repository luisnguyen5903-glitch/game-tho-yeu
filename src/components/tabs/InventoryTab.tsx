import React, { useState } from 'react';
import { NailPolish, NailCharm } from '../../types/game';
import { NAIL_POLISHES, NAIL_CHARMS } from '../../data/initialData';
import { soundManager } from '../../utils/audio';
import { GemstoneGraphic } from '../GemstoneGraphic';
import { Sparkles, ShoppingBag, Eye, Check, Lock } from 'lucide-react';

interface InventoryTabProps {
  inventory: Record<string, number>;
  money: number;
  currentDay: number;
  hagglingDiscount: number;
  onBuyItem: (itemId: string, cost: number, quantity?: number) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  inventory,
  money,
  currentDay,
  hagglingDiscount,
  onBuyItem,
}) => {
  const [filter, setFilter] = useState<'polish' | 'charm'>('polish');
  const [previewItem, setPreviewItem] = useState<NailPolish | NailCharm | null>(NAIL_POLISHES[0]);

  const calculatePrice = (basePrice: number) => {
    if (hagglingDiscount > 0) {
      return Math.round(basePrice * (1 - hagglingDiscount / 100));
    }
    return basePrice;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-[#FFFBF8] rounded-2xl border border-rose-100 shadow-xs select-none">
      {/* Category selector */}
      <div className="flex items-center justify-between pb-2 border-b border-rose-100">
        <div className="flex items-center gap-1.5 p-1 bg-rose-100/60 rounded-xl">
          <button
            onClick={() => {
              setFilter('polish');
              setPreviewItem(NAIL_POLISHES[0]);
              soundManager.playTap();
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              filter === 'polish'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-900/80 hover:text-rose-900 hover:bg-rose-200/50'
            }`}
          >
            💅 Sơn Gel ({NAIL_POLISHES.length})
          </button>
          <button
            onClick={() => {
              setFilter('charm');
              setPreviewItem(NAIL_CHARMS[0]);
              soundManager.playTap();
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              filter === 'charm'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-900/80 hover:text-rose-900 hover:bg-rose-200/50'
            }`}
          >
            💎 Đá & Charm ({NAIL_CHARMS.length})
          </button>
        </div>

        {hagglingDiscount > 0 && (
          <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
            Giảm {hagglingDiscount}% sỉ!
          </span>
        )}
      </div>

      {/* Preview Section on Nail (Section XCIII: "XEM TRÊN MÓNG") */}
      {previewItem && (
        <div className="relative p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200/70 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3 h-3" /> Xem Thử Trên Móng Mẫu
            </span>
            <span className="text-sm font-extrabold text-rose-950 font-display">
              {previewItem.name}
            </span>
            <span className="text-xs text-rose-800/70">{previewItem.description}</span>
          </div>

          {/* Interactive Mini Nail Preview */}
          <div className="relative w-14 h-24 bg-[#F9D5D3] rounded-t-full border-2 border-rose-300 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
            {'hex' in previewItem ? (
              <div
                className="absolute inset-0 rounded-t-full"
                style={{ backgroundColor: previewItem.hex }}
              >
                <div className="absolute top-1 left-1.5 w-2 h-14 bg-white/40 rounded-full blur-[0.5px]" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#F9D5D3] rounded-t-full flex items-center justify-center">
                <div className="absolute top-1 left-1.5 w-2 h-14 bg-white/40 rounded-full blur-[0.5px]" />
                <div className="z-10 animate-bounce">
                  <GemstoneGraphic category={previewItem.category} color={previewItem.color} size={28} sparkle />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Item List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
        {filter === 'polish' ? (
          NAIL_POLISHES.map((polish) => {
            const isUnlocked = currentDay >= polish.unlockedAtDay;
            const qty = inventory[polish.id] || 0;
            const price = calculatePrice(polish.price);
            const canAfford = money >= price;

            return (
              <div
                key={polish.id}
                onClick={() => setPreviewItem(polish)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                  !isUnlocked
                    ? 'bg-slate-50 opacity-60 border-slate-200'
                    : previewItem?.id === polish.id
                    ? 'bg-rose-50 border-rose-400 shadow-sm ring-1 ring-rose-400'
                    : 'bg-white border-rose-100 hover:border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg shadow-sm border border-black/10 relative flex-shrink-0"
                    style={{ backgroundColor: polish.hex }}
                  >
                    <div className="absolute top-0.5 left-1 w-1.5 h-4 bg-white/40 rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-950">{polish.name}</h4>
                    <div className="text-[11px] text-rose-800/70 font-mono">
                      {isUnlocked ? (
                        <>
                          {formatMoney(price)}{' '}
                          {hagglingDiscount > 0 && (
                            <span className="line-through text-slate-400 text-[10px]">
                              {formatMoney(polish.price)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400 font-sans flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Mở Ngày {polish.unlockedAtDay}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isUnlocked ? (
                    <>
                      <span className="text-xs font-semibold text-rose-900 bg-rose-100/60 px-2 py-0.5 rounded-md">
                        Còn {qty}
                      </span>
                      <button
                        disabled={!canAfford}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBuyItem(polish.id, price, 5);
                          soundManager.playCashRegister();
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1 ${
                          canAfford
                            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-3 h-3" />
                        +5
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded">
                      Khóa
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          NAIL_CHARMS.map((charm) => {
            const isUnlocked = currentDay >= charm.unlockedAtDay;
            const qty = inventory[charm.id] || 0;
            const price = calculatePrice(charm.price);
            const canAfford = money >= price;

            return (
              <div
                key={charm.id}
                onClick={() => setPreviewItem(charm)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                  !isUnlocked
                    ? 'bg-slate-50 opacity-60 border-slate-200'
                    : previewItem?.id === charm.id
                    ? 'bg-rose-50 border-rose-400 shadow-sm ring-1 ring-rose-400'
                    : 'bg-white border-rose-100 hover:border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-center flex-shrink-0">
                    <GemstoneGraphic category={charm.category} color={charm.color} size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-950 truncate max-w-[120px]">{charm.name}</h4>
                    <div className="text-[11px] text-rose-800/70 font-mono">
                      {isUnlocked ? (
                        <>
                          {formatMoney(price)}{' '}
                          {hagglingDiscount > 0 && (
                            <span className="line-through text-slate-400 text-[10px]">
                              {formatMoney(charm.price)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400 font-sans flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Mở Ngày {charm.unlockedAtDay}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isUnlocked ? (
                    <>
                      <span className="text-xs font-semibold text-rose-900 bg-rose-100/60 px-2 py-0.5 rounded-md">
                        Còn {qty}
                      </span>
                      <button
                        disabled={!canAfford}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBuyItem(charm.id, price, 5);
                          soundManager.playCashRegister();
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition active:scale-95 flex items-center gap-1 ${
                          canAfford
                            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-3 h-3" />
                        +5
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded">
                      Khóa
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
