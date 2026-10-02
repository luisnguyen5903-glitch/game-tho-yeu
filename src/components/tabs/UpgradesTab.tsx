import React from 'react';
import { SalonUpgrade } from '../../types/game';
import { SALON_UPGRADES } from '../../data/initialData';
import { soundManager } from '../../utils/audio';
import { Store, Armchair, Sun, Paintbrush, Crosshair, Music, ArrowUpCircle, Check } from 'lucide-react';

interface UpgradesTabProps {
  upgrades: Record<string, number>;
  money: number;
  onUpgrade: (upgradeId: string, cost: number) => void;
}

export const UpgradesTab: React.FC<UpgradesTabProps> = ({ upgrades, money, onUpgrade }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'store':
        return <Store className="w-5 h-5 text-rose-600" />;
      case 'armchair':
        return <Armchair className="w-5 h-5 text-amber-600" />;
      case 'sun':
        return <Sun className="w-5 h-5 text-yellow-600" />;
      case 'paintbrush':
        return <Paintbrush className="w-5 h-5 text-pink-600" />;
      case 'crosshair':
        return <Crosshair className="w-5 h-5 text-indigo-600" />;
      case 'music':
        return <Music className="w-5 h-5 text-purple-600" />;
      default:
        return <Store className="w-5 h-5 text-rose-600" />;
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-[#FFFBF8] rounded-2xl border border-rose-100 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-rose-100">
        <div>
          <h3 className="text-sm font-bold text-rose-950 font-display">Nâng Cấp Salon & Dụng Cụ</h3>
          <p className="text-[11px] text-rose-800/70">
            Trang bị hiện đại giúp làm nail nhanh hơn, tăng tiền tip và thu hút khách VIP.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
        {SALON_UPGRADES.map((upgrade) => {
          const currentLvl = upgrades[upgrade.id] || 1;
          const isMax = currentLvl >= upgrade.maxLevel;
          const cost = upgrade.cost * currentLvl;
          const canAfford = money >= cost;

          return (
            <div
              key={upgrade.id}
              className="p-3 bg-white rounded-xl border border-rose-100 shadow-xs flex items-center justify-between gap-3 hover:border-rose-200 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0">
                  {getIcon(upgrade.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-rose-950">{upgrade.name}</h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded">
                      Cấp {currentLvl}/{upgrade.maxLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800/80 mt-0.5">{upgrade.benefit}</p>
                </div>
              </div>

              <div>
                {isMax ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Tối Đa
                  </span>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      onUpgrade(upgrade.id, cost);
                      soundManager.playSuccessFanfare();
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition active:scale-95 ${
                      canAfford
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-xs hover:brightness-105'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>{formatMoney(cost)}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
