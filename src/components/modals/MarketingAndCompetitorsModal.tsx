import React, { useState } from 'react';
import { MarketingCampaign, CompetitorSalon } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { Megaphone, Swords, Sparkles, X, Check, TrendingUp, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MarketingAndCompetitorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: number;
  currentDay: number;
  marketingList: MarketingCampaign[];
  competitors: CompetitorSalon[];
  onStartCampaign: (campaignId: string, cost: number) => void;
  onTrollCompetitor: (competitorId: string, cost: number, successText: string) => void;
}

export const MarketingAndCompetitorsModal: React.FC<MarketingAndCompetitorsModalProps> = ({
  isOpen,
  onClose,
  money,
  currentDay,
  marketingList,
  competitors,
  onStartCampaign,
  onTrollCompetitor,
}) => {
  const [activeTab, setActiveTab] = useState<'marketing' | 'competitors'>('marketing');
  const [trollResult, setTrollResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const handleTroll = (comp: CompetitorSalon) => {
    if (money < comp.trollCost || comp.trolledToday) return;

    soundManager.playCashRegister();
    const outcomes = [
      `Tung video nail art triệu view! ${comp.name} giật mình, 3 khách quen chuyển sang tiệm bạn!`,
      `Chạy khuyến mãi "Làm nail tặng charm", khách xếp hàng tràn qua trước cửa ${comp.name}!`,
      `Thử thách dũa móng không lem thắng áp đảo, danh tiếng tiệm tăng vùn vụt!`,
    ];
    const picked = outcomes[Math.floor(Math.random() * outcomes.length)];
    setTrollResult(picked);
    confetti({ particleCount: 50, spread: 60 });
    onTrollCompetitor(comp.id, comp.trollCost, picked);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#FFFBF8] p-5 shadow-2xl border-2 border-rose-200 relative flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-1.5 p-1 bg-rose-100/70 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('marketing');
                soundManager.playTap();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                activeTab === 'marketing'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-900/80 hover:text-rose-950'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Quảng Cáo</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('competitors');
                soundManager.playTap();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                activeTab === 'competitors'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-900/80 hover:text-rose-950'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Chọc Quán Đối Thủ</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-rose-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab 1: Marketing Campaigns */}
        {activeTab === 'marketing' && (
          <div className="mt-3 space-y-2.5 overflow-y-auto pr-1 flex-1">
            <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-100 text-xs text-rose-900 leading-relaxed">
              📣 Chạy chiến dịch để tăng lượt khách ghé tiệm và thu hút khách VIP chịu chi!
            </div>

            {marketingList.map((campaign) => {
              const isUnlocked = currentDay >= campaign.unlockedAtDay;
              const canAfford = money >= campaign.cost;

              return (
                <div
                  key={campaign.id}
                  className="p-3 bg-white rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between gap-3 hover:border-rose-200 transition"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-rose-950">{campaign.name}</h4>
                      {campaign.isActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                          Đang chạy ({campaign.daysRemaining} ngày)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-rose-800/80 mt-0.5">{campaign.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-semibold">
                      <span>+{campaign.customerBoost} khách/ngày</span>
                      <span>·</span>
                      <span className="text-rose-700 font-mono font-bold">
                        {formatMoney(campaign.cost)}
                      </span>
                    </div>
                  </div>

                  <div>
                    {!isUnlocked ? (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                        Ngày {campaign.unlockedAtDay}
                      </span>
                    ) : campaign.isActive ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                        Hoạt động
                      </span>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          onStartCampaign(campaign.id, campaign.cost);
                          soundManager.playCashRegister();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                          canAfford
                            ? 'bg-rose-600 text-white shadow-xs hover:bg-rose-700'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Chạy Ngay
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Competitor Salon Trolling */}
        {activeTab === 'competitors' && (
          <div className="mt-3 space-y-2.5 overflow-y-auto pr-1 flex-1">
            <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed">
              ⚔️ Đấu chiêu vui nhộn với các tiệm nail lân cận để giành khách và khẳng định tay nghề số 1!
            </div>

            {trollResult && (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed italic animate-in fade-in flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{trollResult}</span>
              </div>
            )}

            {competitors.map((comp) => {
              const canAfford = money >= comp.trollCost;

              return (
                <div
                  key={comp.id}
                  className="p-3 bg-white rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between gap-3 hover:border-rose-200 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-xl flex-shrink-0">
                      {comp.avatarIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-rose-950">{comp.name}</h4>
                        <span className="text-[10px] text-amber-700 font-bold">
                          ⭐ {comp.reputation}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-800/80 mt-0.5">{comp.description}</p>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Lượng khách: ~{comp.customersDaily} người/ngày
                      </span>
                    </div>
                  </div>

                  <div>
                    {comp.trolledToday ? (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                        Đã đấu hôm nay
                      </span>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => handleTroll(comp)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 whitespace-nowrap ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:brightness-105'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Đấu Chiêu · {formatMoney(comp.trollCost)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
