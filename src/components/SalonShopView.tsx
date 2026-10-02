import React, { useState } from 'react';
import { GameState } from '../types/game';
import { SalonStorefrontIllustration } from './SalonStorefrontIllustration';
import { SalonInteriorScene } from './SalonInteriorScene';
import { GemstoneShowcaseTray } from './GemstoneShowcaseTray';
import { InventoryTab } from './tabs/InventoryTab';
import { UpgradesTab } from './tabs/UpgradesTab';
import { ReviewsTab } from './tabs/ReviewsTab';
import { ServicePricingTab } from './tabs/ServicePricingTab';
import { AccountingTab } from './tabs/AccountingTab';
import { soundManager } from '../utils/audio';
import {
  Sparkles,
  ShoppingBag,
  Store,
  MessageSquare,
  BookOpen,
  DollarSign,
  Tag,
  Gift,
  Users,
  Check,
  Play,
  ArrowRight,
  Calendar,
  Megaphone,
  Trophy,
  Flame,
  Home,
  Armchair,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SalonShopViewProps {
  state: GameState;
  onOpenRenameModal: () => void;
  onOpenHagglingModal: () => void;
  onOpenCustomerBookModal: () => void;
  onOpenRoadmapModal: () => void;
  onOpenMarketingModal: () => void;
  onOpenAchievementsModal: () => void;
  onStartServiceCustomer: () => void;
  onBuyItem: (itemId: string, cost: number, quantity?: number) => void;
  onUpgrade: (upgradeId: string, cost: number) => void;
  onReplyReview: (reviewId: string, replyText: string, affinityBonus: number, reputationBonus: number) => void;
  onUpdateServicePrice: (key: string, value: number) => void;
  onClaimQuest: (questId: string) => void;
}

type MainTab = 'kho' | 'keda' | 'gia' | 'nangcap' | 'danhgia' | 'sosach';
type SceneViewMode = 'interior' | 'exterior';

export const SalonShopView: React.FC<SalonShopViewProps> = ({
  state,
  onOpenRenameModal,
  onOpenHagglingModal,
  onOpenCustomerBookModal,
  onOpenRoadmapModal,
  onOpenMarketingModal,
  onOpenAchievementsModal,
  onStartServiceCustomer,
  onBuyItem,
  onUpgrade,
  onReplyReview,
  onUpdateServicePrice,
  onClaimQuest,
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>('kho');
  const [sceneMode, setSceneMode] = useState<SceneViewMode>('interior');

  const tabs: { key: MainTab; label: string; icon: string; subtitle: string }[] = [
    { key: 'kho', label: 'Kho Vật Tư', icon: '🛍️', subtitle: 'Sơn & Phụ Kiện' },
    { key: 'keda', label: 'Kệ Đá Quý', icon: '💎', subtitle: 'Pha Lê & Charm' },
    { key: 'gia', label: 'Giá Menu', icon: '🏷️', subtitle: 'Bảng Giá Dịch Vụ' },
    { key: 'nangcap', label: 'Nâng Cấp', icon: '⭐', subtitle: 'Nội Thất & Đồ Nghề' },
    { key: 'danhgia', label: 'Đánh Giá', icon: '💬', subtitle: 'Phản Hồi Của Khách' },
    { key: 'sosach', label: 'Sổ Sách', icon: '📊', subtitle: 'Doanh Thu & Lãi' },
  ];

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const xpPercent = Math.min(100, Math.round((state.xp / state.xpToNextLevel) * 100));

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4 max-w-5xl mx-auto w-full select-none">
      {/* ---------------- 1. SALON HEADER HUD & QUICK ACTIONS ---------------- */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-[#B9384E] via-[#CD435B] to-[#B9384E] text-white rounded-3xl shadow-md border border-rose-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 shadow-md flex-shrink-0 bg-rose-200">
              <img
                src="/src/assets/images/bunny_mascot_1790917940969.jpg"
                alt="Thỏ Bông"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-display tracking-tight flex items-center gap-1.5">
                  <span>💅 {state.shopName}</span>
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950/40 text-rose-200 border border-rose-400/30 flex items-center gap-1 font-bold">
                  🐰 Thỏ Bông
                </span>
              </div>
              <span className="text-xs text-rose-100 font-medium">
                Cấp {state.level} · {state.level === 1 ? 'Tiệm Thỏ Xinh vỉa hè' : state.level === 2 ? 'Tiệm phố hoa & đèn thỏ' : state.level === 3 ? 'Salon thỏ pastel Hàn Quốc' : 'Boutique Thỏ Spa'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Scene Mode Switcher */}
            <div className="flex items-center bg-rose-950/60 p-0.5 rounded-2xl border border-rose-800">
              <button
                onClick={() => {
                  setSceneMode('interior');
                  soundManager.playTap();
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 ${
                  sceneMode === 'interior'
                    ? 'bg-white text-rose-950 shadow-sm'
                    : 'text-rose-200 hover:text-white'
                }`}
              >
                <Armchair className="w-3.5 h-3.5" />
                <span>Nội Thất Tiệm</span>
              </button>
              <button
                onClick={() => {
                  setSceneMode('exterior');
                  soundManager.playTap();
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 ${
                  sceneMode === 'exterior'
                    ? 'bg-white text-rose-950 shadow-sm'
                    : 'text-rose-200 hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Mặt Tiền Phố</span>
              </button>
            </div>

            <span className="text-xs font-mono font-bold text-amber-200 bg-rose-950/70 px-2.5 py-1 rounded-xl border border-rose-800">
              {state.xp}/{state.xpToNextLevel} XP
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full h-2 bg-rose-950/80 rounded-full mt-2.5 overflow-hidden border border-rose-800/80">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300 rounded-full"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-rose-800/60 text-xs">
          <button
            onClick={() => {
              onOpenRenameModal();
              soundManager.playTap();
            }}
            className="py-1.5 px-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-100 font-semibold transition active:scale-95 text-center truncate"
          >
            Đổi tên tiệm
          </button>
          <button
            onClick={() => {
              onOpenCustomerBookModal();
              soundManager.playTap();
            }}
            className="py-1.5 px-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-100 font-semibold transition active:scale-95 text-center truncate"
          >
            Sổ khách
          </button>
          <button
            onClick={() => {
              onOpenAchievementsModal();
              soundManager.playTap();
            }}
            className="py-1.5 px-2 rounded-xl bg-amber-500/90 hover:bg-amber-500 text-rose-950 font-bold transition active:scale-95 text-center truncate flex items-center justify-center gap-1"
          >
            <Trophy className="w-3.5 h-3.5" /> Thành tựu
          </button>
          <button
            onClick={() => {
              onOpenMarketingModal();
              soundManager.playTap();
            }}
            className="py-1.5 px-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-100 font-semibold transition active:scale-95 text-center truncate flex items-center justify-center gap-1"
          >
            <Megaphone className="w-3.5 h-3.5" /> Quảng cáo
          </button>
        </div>
      </div>

      {/* ---------------- 2. COZY ILLUSTRATED SCENE (HERO CENTERPIECE) ---------------- */}
      {sceneMode === 'interior' ? (
        <SalonInteriorScene
          state={state}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onStartServiceCustomer={onStartServiceCustomer}
          onOpenHagglingModal={onOpenHagglingModal}
          onOpenMarketingModal={onOpenMarketingModal}
          onOpenAchievementsModal={onOpenAchievementsModal}
        />
      ) : (
        <div className="w-full">
          <SalonStorefrontIllustration level={state.level} shopName={state.shopName} />
          {/* Action button below storefront */}
          <button
            onClick={() => {
              onStartServiceCustomer();
              soundManager.playSuccessFanfare();
            }}
            className="w-full mt-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#E11D48] text-white font-black text-sm font-display shadow-lg hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 border-2 border-rose-300"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>🐰 MỞ CỬA ĐÓN KHÁCH · BẮT ĐẦU LÀM NAIL ✨</span>
          </button>
        </div>
      )}

      {/* ---------------- 3. DAILY EVENTS & QUESTS CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* (A) Weekly Trend Banner */}
        {state.currentTrend && (
          <div className="p-3 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 rounded-2xl border border-rose-200/90 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                  XU HƯỚNG TUẦN NÀY (+{state.currentTrend.bonusPercent}% Thưởng)
                </span>
                <span className="text-xs font-black text-rose-950 font-display">
                  {state.currentTrend.title}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenRoadmapModal();
                soundManager.playTap();
              }}
              className="px-2.5 py-1.5 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 rounded-xl border border-rose-300 shadow-2xs whitespace-nowrap flex items-center gap-1 transition active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>Lộ Trình</span>
            </button>
          </div>
        )}

        {/* (B) Daily Event: "Đi chợ trả giá" Card */}
        {!state.hasHaggledToday ? (
          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-base flex-shrink-0 shadow-2xs">
                👩‍💼
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">Ghé Chợ Kim Biên Trả Giá</h4>
                <p className="text-[11px] text-amber-800/80 leading-tight">
                  Bớt tới 25% tiền nhập sơn & đá hôm nay!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenHagglingModal();
                soundManager.playTap();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-xs hover:brightness-105 active:scale-95 whitespace-nowrap"
            >
              Trả giá ➜
            </button>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2.5">
            <span className="text-lg">🛍️</span>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">Đã Nhập Hàng Ưu Đãi Hôm Nay</h4>
              <p className="text-[11px] text-emerald-800/80">
                Đã áp dụng giảm -{state.hagglingDiscount}% giá vật tư hôm nay!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- 4. DAILY QUESTS CONTAINER ---------------- */}
      <div className="p-3 bg-[#FFFBF8] rounded-2xl border border-rose-100 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-rose-100">
          <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
            <span>📋</span> Nhiệm Vụ Hôm Nay
          </h4>
          <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Hoàn thành nhận tiền & XP
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2.5">
          {state.dailyQuests.map((quest) => {
            const isFinished = quest.current >= quest.target;

            return (
              <div
                key={quest.id}
                className="p-2.5 bg-white rounded-xl border border-rose-100 flex items-center justify-between gap-2 shadow-2xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-950 truncate">{quest.title}</span>
                    <span className="font-mono text-rose-600 font-bold ml-1 flex-shrink-0">
                      {quest.current}/{quest.target}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-amber-700 font-semibold truncate">
                      +{formatMoney(quest.rewardMoney)} · +{quest.rewardXp} XP
                    </span>
                  </div>
                </div>

                {quest.isClaimed ? (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg flex-shrink-0">
                    Đã nhận ✓
                  </span>
                ) : isFinished ? (
                  <button
                    onClick={() => {
                      onClaimQuest(quest.id);
                      soundManager.playCashRegister();
                      confetti({ particleCount: 40, spread: 50 });
                    }}
                    className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-lg shadow-xs hover:brightness-105 active:scale-95 animate-bounce flex-shrink-0"
                  >
                    Nhận
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                    Đang làm
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- 5. INTERACTIVE SALON WORKSTATION & MANAGEMENT TABS ---------------- */}
      <div className="flex flex-col gap-3">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F9ECE7] rounded-2xl border border-rose-200/80 overflow-x-auto shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                soundManager.playTap();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                activeTab === tab.key
                  ? 'bg-white text-rose-900 shadow-sm border border-rose-200'
                  : 'text-rose-800/80 hover:text-rose-950 hover:bg-white/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="transition-all duration-300">
          {activeTab === 'kho' && (
            <InventoryTab
              inventory={state.inventory}
              money={state.money}
              currentDay={state.day}
              hagglingDiscount={state.hagglingDiscount}
              onBuyItem={onBuyItem}
            />
          )}

          {activeTab === 'keda' && (
            <GemstoneShowcaseTray
              currentDay={state.day}
              unlockedCharms={state.unlockedCharms}
              inventory={state.inventory}
            />
          )}

          {activeTab === 'gia' && (
            <ServicePricingTab
              prices={state.servicePrices}
              onUpdatePrice={onUpdateServicePrice}
            />
          )}

          {activeTab === 'nangcap' && (
            <UpgradesTab
              upgrades={state.upgrades}
              money={state.money}
              onUpgrade={onUpgrade}
            />
          )}

          {activeTab === 'danhgia' && (
            <ReviewsTab
              reviews={state.reviews}
              averageRating={state.averageRating}
              reputation={state.reputation}
              onReplyReview={onReplyReview}
            />
          )}

          {activeTab === 'sosach' && (
            <AccountingTab
              totalRevenue={state.totalRevenue}
              totalCustomers={state.totalCustomersServed}
              averageRating={state.averageRating}
              day={state.day}
            />
          )}
        </div>
      </div>
    </div>
  );
};
