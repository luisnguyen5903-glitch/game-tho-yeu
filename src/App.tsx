import React, { useState, useEffect } from 'react';
import { GameState, Customer, CustomerRequest, EvaluationReport, PlacedCharm, NailShape } from './types/game';
import { INITIAL_GAME_STATE, INITIAL_CUSTOMERS, NAIL_POLISHES, NAIL_CHARMS } from './data/initialData';
import { loadSavedGame, saveGame } from './utils/storage';
import { soundManager } from './utils/audio';
import { GameHeader } from './components/GameHeader';
import { SalonShopView } from './components/SalonShopView';
import { WorkstationView } from './components/WorkstationView';
import { CustomerBriefModal } from './components/modals/CustomerBriefModal';
import { CompletionResultModal } from './components/modals/CompletionResultModal';
import { HagglingModal } from './components/modals/HagglingModal';
import { RenameShopModal } from './components/modals/RenameShopModal';
import { CustomerBookModal } from './components/modals/CustomerBookModal';
import { DaySummaryModal } from './components/modals/DaySummaryModal';
import { UnlockRoadmapModal } from './components/UnlockRoadmapModal';
import { MarketingAndCompetitorsModal } from './components/modals/MarketingAndCompetitorsModal';
import { AchievementsModal } from './components/modals/AchievementsModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadSavedGame());
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active serving state
  const [activeCustomerIndex, setActiveCustomerIndex] = useState<number>(0);
  const [currentRequest, setCurrentRequest] = useState<CustomerRequest | null>(null);

  // Modals
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isHagglingModalOpen, setIsHagglingModalOpen] = useState(false);
  const [isCustomerBookModalOpen, setIsCustomerBookModalOpen] = useState(false);
  const [isDaySummaryModalOpen, setIsDaySummaryModalOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);

  const [lastReport, setLastReport] = useState<EvaluationReport | null>(null);
  const [lastServedCustomer, setLastServedCustomer] = useState<Customer | null>(null);
  const [lastServedRequest, setLastServedRequest] = useState<CustomerRequest | null>(null);

  // Auto-save whenever gameState changes
  useEffect(() => {
    saveGame(gameState);
  }, [gameState]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
  };

  // Generate authentic, data-driven Customer Request (Section 2 & 4)
  const generateCustomerRequest = (customer: Customer): CustomerRequest => {
    const availablePolishes = NAIL_POLISHES.filter(
      (p) => p.unlockedAtDay <= gameState.day || gameState.unlockedPolishes.includes(p.id)
    );
    const targetPolish =
      availablePolishes.find((p) => p.id === customer.favoriteColorId) ||
      availablePolishes[Math.floor(Math.random() * availablePolishes.length)] ||
      NAIL_POLISHES[0];

    const shapes: NailShape[] = ['almond', 'oval', 'square', 'round'];
    if (gameState.day >= 8) shapes.push('coffin');
    if (gameState.day >= 20) shapes.push('stiletto');

    const targetShape = customer.favoriteShape || shapes[Math.floor(Math.random() * shapes.length)];
    const targetLength: 'short' | 'medium' | 'long' =
      targetShape === 'square' || targetShape === 'round' ? 'short' : targetShape === 'almond' ? 'medium' : 'long';

    // Charm requirement
    const requiresGems = Math.random() > 0.35 || customer.role === 'Khách VIP';
    const requestedCharmCount = requiresGems ? (customer.role === 'Khách VIP' ? 3 : 2) : 0;
    const requiresSymmetry = requestedCharmCount >= 2;

    // Tolerance error margin based on customer strictness (Section 4)
    // 1 (easy) -> 0.15, 2 -> 0.10, 3 -> 0.05, 4 (strict) -> 0.03, 5 (VIP) -> 0.02
    const toleranceMap: Record<number, number> = { 1: 0.15, 2: 0.1, 3: 0.05, 4: 0.03, 5: 0.02 };
    const toleranceErrorMargin = toleranceMap[customer.strictness || 2] || 0.1;

    // Base reward
    let baseReward = gameState.servicePrices.gelColor + gameState.servicePrices.basicCutCare;
    if (requiresGems) baseReward += requestedCharmCount * gameState.servicePrices.stonePerPiece;

    const specialConstraints: string[] = ['Sơn sát viền nhưng không được chạm vào da khóe', 'Dũa form hai bên cân đối'];
    if (customer.nailCondition.hasOldPolish) {
      specialConstraints.push('Phải tẩy sạch hoàn toàn lớp sơn cũ trước khi sơn mới');
    }
    if (customer.nailCondition.dirtLevel > 20) {
      specialConstraints.push('Dùng cồn lau sạch bụi bẩn khóe da');
    }
    if (requiresSymmetry) {
      specialConstraints.push(`Đính ${requestedCharmCount} viên đá đối xứng hai bên`);
    }

    return {
      id: `req_${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      customerRole: customer.role,
      avatarSeed: customer.avatarSeed,
      greetingDialogue: customer.dialogueGreeting,
      targetShape,
      targetLength,
      targetColorId: targetPolish.id,
      targetColorName: targetPolish.name,
      targetFinish: 'glossy',
      requiresFrench: false,
      requiresGems,
      requestedCharmCount,
      requiresSymmetry,
      requestedStyle: customer.role === 'Khách VIP' ? 'Dự Tiệc Sang Trọng' : 'Hàn Quốc Tối Giản',
      specialConstraints,
      toleranceErrorMargin,
      deadlineSeconds: customer.patienceMax || 90,
      baseReward,
    };
  };

  // Step A: Trigger customer brief modal first (Section 3)
  const handleOpenCustomerBrief = () => {
    const currentCustomer = gameState.activeCustomers[activeCustomerIndex] || INITIAL_CUSTOMERS[0];
    const req = generateCustomerRequest(currentCustomer);
    setCurrentRequest(req);
    setIsBriefModalOpen(true);
  };

  // Step B: User confirms brief -> Transition into workstation gameplay
  const handleStartWorkstation = () => {
    setIsBriefModalOpen(false);
    setGameState((prev) => ({ ...prev, dayPhase: 'serving' }));
  };

  // Step C: Workstation completed -> Evaluator generated report
  const handleFinishService = (report: EvaluationReport) => {
    const currentCustomer = gameState.activeCustomers[activeCustomerIndex] || INITIAL_CUSTOMERS[0];
    const totalCashEarned = report.earnedBaseMoney + report.earnedTipMoney;

    // Level up calculation
    let newXp = gameState.xp + report.earnedXp;
    let newLevel = gameState.level;
    let newXpToNext = gameState.xpToNextLevel;

    if (newXp >= newXpToNext) {
      newXp = newXp - newXpToNext;
      newLevel += 1;
      newXpToNext = Math.round(newXpToNext * 1.5);
    }

    // New review based directly on customer reaction dialogue (Zero fake feedback!)
    const newReview = {
      id: `rev_${Date.now()}`,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      avatarSeed: currentCustomer.avatarSeed,
      rating: report.stars,
      comment: report.customerReactionDialogue,
      dayNumber: gameState.day,
      profit: totalCashEarned,
      replyOptions: [
        {
          text: 'Dạ em cảm ơn chị nhiều ạ ❤️ Lần sau ghé em làm tặng thêm voucher nhé!',
          affinityBonus: 10,
          reputationBonus: 5,
        },
        {
          text: 'Em rất vui vì chị ưng ý bộ móng! Chúc chị có những bức ảnh thật xinh lung linh!',
          affinityBonus: 8,
          reputationBonus: 6,
        },
      ],
      isReplied: false,
    };

    // Update quest progress
    const updatedQuests = gameState.dailyQuests.map((q) => {
      if (q.id === 'q_serve_3') {
        const nextCur = q.current + 1;
        return { ...q, current: nextCur, isCompleted: nextCur >= q.target };
      }
      if (q.id === 'q_gem_master' && report.breakdown.gemScore >= 80) {
        const nextCur = q.current + 1;
        return { ...q, current: nextCur, isCompleted: nextCur >= q.target };
      }
      if (q.id === 'q_no_overflow' && report.breakdown.paintScore >= 85) {
        const nextCur = q.current + 1;
        return { ...q, current: nextCur, isCompleted: nextCur >= q.target };
      }
      return q;
    });

    // Update achievements
    const updatedAchievements = gameState.achievements.map((ach) => {
      if (ach.id === 'ach_golden_hands' && report.totalScore >= 95) {
        const nextP = ach.currentProgress + 1;
        return { ...ach, currentProgress: nextP, isUnlocked: nextP >= ach.targetProgress };
      }
      if (ach.id === 'ach_loyal_guests' && currentCustomer.visitCount >= 2) {
        const nextP = ach.currentProgress + 1;
        return { ...ach, currentProgress: nextP, isUnlocked: nextP >= ach.targetProgress };
      }
      return ach;
    });

    // Update active customers visit count & affinity
    const updatedCustomers = gameState.activeCustomers.map((c) =>
      c.id === currentCustomer.id
        ? {
            ...c,
            visitCount: c.visitCount + 1,
            affinity: Math.max(0, Math.min(100, c.affinity + report.affinityDelta)),
          }
        : c
    );

    const nextCompletedCount = gameState.completedCustomerCountToday + 1;

    setGameState((prev) => ({
      ...prev,
      money: prev.money + totalCashEarned,
      totalRevenue: prev.totalRevenue + totalCashEarned,
      totalCustomersServed: prev.totalCustomersServed + 1,
      xp: newXp,
      level: newLevel,
      xpToNextLevel: newXpToNext,
      completedCustomerCountToday: nextCompletedCount,
      activeCustomers: updatedCustomers,
      reviews: [newReview, ...prev.reviews],
      dailyQuests: updatedQuests,
      achievements: updatedAchievements,
      reputation: Math.max(0, Math.min(100, prev.reputation + (report.stars >= 4 ? 3 : -4))),
    }));

    setLastReport(report);
    setLastServedCustomer(currentCustomer);
    setLastServedRequest(currentRequest);
    setIsCompletionModalOpen(true);
  };

  const handleCloseCompletionModal = () => {
    setIsCompletionModalOpen(false);

    // If completed daily customer target, day ends!
    const dailyTarget = 3 + (gameState.activeMarketing.find((m) => m.isActive)?.customerBoost || 0);
    if (gameState.completedCustomerCountToday >= dailyTarget) {
      setGameState((prev) => ({ ...prev, dayPhase: 'ended' }));
      setIsDaySummaryModalOpen(true);
    } else {
      setActiveCustomerIndex((prev) => (prev + 1) % gameState.activeCustomers.length);
      setGameState((prev) => ({ ...prev, dayPhase: 'prep' }));
    }
  };

  const handleNextDay = () => {
    setIsDaySummaryModalOpen(false);

    const nextDay = gameState.day + 1;
    const dayBonus = 50000;

    let unlockedItem = '';
    const newUnlockedPolishes = [...gameState.unlockedPolishes];
    const newUnlockedCharms = [...gameState.unlockedCharms];

    const newPolish = NAIL_POLISHES.find((p) => p.unlockedAtDay === nextDay);
    if (newPolish && !newUnlockedPolishes.includes(newPolish.id)) {
      newUnlockedPolishes.push(newPolish.id);
      unlockedItem = `Sơn Gel: ${newPolish.name}`;
    }

    const newCharm = NAIL_CHARMS.find((c) => c.unlockedAtDay === nextDay);
    if (newCharm && !newUnlockedCharms.includes(newCharm.id)) {
      newUnlockedCharms.push(newCharm.id);
      unlockedItem = `Phụ kiện: ${newCharm.name}`;
    }

    const nextMarketing = gameState.activeMarketing.map((m) => {
      if (m.isActive) {
        const remaining = m.daysRemaining - 1;
        return { ...m, daysRemaining: remaining, isActive: remaining > 0 };
      }
      return m;
    });

    const nextCompetitors = gameState.competitors.map((c) => ({
      ...c,
      trolledToday: false,
    }));

    setGameState((prev) => ({
      ...prev,
      day: nextDay,
      dayPhase: 'prep',
      money: prev.money + dayBonus,
      completedCustomerCountToday: 0,
      hasHaggledToday: false,
      hagglingDiscount: 0,
      unlockedPolishes: newUnlockedPolishes,
      unlockedCharms: newUnlockedCharms,
      activeMarketing: nextMarketing,
      competitors: nextCompetitors,
      dailyQuests: prev.dailyQuests.map((q) => ({
        ...q,
        current: 0,
        isCompleted: false,
        isClaimed: false,
      })),
    }));
  };

  const handleBuyItem = (itemId: string, cost: number, quantity: number = 5) => {
    if (gameState.money < cost) return;
    setGameState((prev) => ({
      ...prev,
      money: prev.money - cost,
      inventory: {
        ...prev.inventory,
        [itemId]: (prev.inventory[itemId] || 0) + quantity,
      },
    }));
  };

  const handleUpgrade = (upgradeId: string, cost: number) => {
    if (gameState.money < cost) return;
    setGameState((prev) => {
      const currentLvl = prev.upgrades[upgradeId] || 1;
      const nextLvl = currentLvl + 1;
      const nextUpgrades = { ...prev.upgrades, [upgradeId]: nextLvl };

      let nextLevel = prev.level;
      if (upgradeId === 'upg_salon_tier') {
        nextLevel = Math.max(prev.level, nextLvl);
      }

      return {
        ...prev,
        money: prev.money - cost,
        upgrades: nextUpgrades,
        level: nextLevel,
        xp: prev.xp + 60,
      };
    });
  };

  const handleStartMarketingCampaign = (campaignId: string, cost: number) => {
    if (gameState.money < cost) return;
    setGameState((prev) => ({
      ...prev,
      money: prev.money - cost,
      activeMarketing: prev.activeMarketing.map((m) =>
        m.id === campaignId ? { ...m, isActive: true, daysRemaining: m.durationDays } : m
      ),
    }));
  };

  const handleTrollCompetitor = (competitorId: string, cost: number, successText: string) => {
    if (gameState.money < cost) return;
    setGameState((prev) => ({
      ...prev,
      money: prev.money - cost,
      reputation: Math.min(100, prev.reputation + 4),
      competitors: prev.competitors.map((c) =>
        c.id === competitorId ? { ...c, trolledToday: true } : c
      ),
    }));
  };

  const handleClaimAchievement = (achievementId: string) => {
    const ach = gameState.achievements.find((a) => a.id === achievementId);
    if (!ach || ach.isClaimed || !ach.isUnlocked) return;

    setGameState((prev) => ({
      ...prev,
      money: prev.money + ach.rewardMoney,
      xp: prev.xp + ach.rewardXp,
      achievements: prev.achievements.map((a) =>
        a.id === achievementId ? { ...a, isClaimed: true } : a
      ),
    }));
  };

  const handleReplyReview = (
    reviewId: string,
    replyText: string,
    affinityBonus: number,
    reputationBonus: number
  ) => {
    setGameState((prev) => ({
      ...prev,
      reputation: Math.min(100, prev.reputation + reputationBonus),
      reviews: prev.reviews.map((r) => (r.id === reviewId ? { ...r, replyText, isReplied: true } : r)),
    }));
  };

  const handleUpdateServicePrice = (key: string, value: number) => {
    setGameState((prev) => ({
      ...prev,
      servicePrices: {
        ...prev.servicePrices,
        [key]: value,
      },
    }));
  };

  const handleClaimQuest = (questId: string) => {
    const quest = gameState.dailyQuests.find((q) => q.id === questId);
    if (!quest || quest.isClaimed || !quest.isCompleted) return;

    setGameState((prev) => ({
      ...prev,
      money: prev.money + quest.rewardMoney,
      xp: prev.xp + quest.rewardXp,
      dailyQuests: prev.dailyQuests.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q)),
    }));
  };

  return (
    <div className="min-h-screen w-full bg-[#351119] flex justify-center items-center p-0 md:p-4 select-none">
      {/* MOBILE DEVICE CONTAINER */}
      <div className="w-full max-w-[480px] md:max-w-4xl min-h-screen md:min-h-[820px] md:max-h-[92vh] bg-[#FFF8F5] md:rounded-3xl shadow-2xl md:border-4 md:border-[#7A2A3A] flex flex-col overflow-hidden relative">
        <GameHeader
          day={gameState.day}
          dayPhase={gameState.dayPhase}
          timeOfDay={gameState.timeOfDay}
          money={gameState.money}
          rating={gameState.averageRating}
          reviewCount={gameState.reviews.length}
          level={gameState.level}
          xp={gameState.xp}
          xpToNextLevel={gameState.xpToNextLevel}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />

        <main className="flex-1 flex flex-col overflow-y-auto">
          {gameState.dayPhase === 'serving' && currentRequest ? (
            <WorkstationView
              customer={gameState.activeCustomers[activeCustomerIndex] || INITIAL_CUSTOMERS[0]}
              request={currentRequest}
              inventory={gameState.inventory}
              trendBonus={gameState.currentTrend ? gameState.currentTrend.bonusPercent : 0}
              onFinishService={handleFinishService}
              onExit={() => setGameState((prev) => ({ ...prev, dayPhase: 'prep' }))}
            />
          ) : (
            <SalonShopView
              state={gameState}
              onOpenRenameModal={() => setIsRenameModalOpen(true)}
              onOpenHagglingModal={() => setIsHagglingModalOpen(true)}
              onOpenCustomerBookModal={() => setIsCustomerBookModalOpen(true)}
              onOpenRoadmapModal={() => setIsRoadmapModalOpen(true)}
              onOpenMarketingModal={() => setIsMarketingModalOpen(true)}
              onOpenAchievementsModal={() => setIsAchievementsModalOpen(true)}
              onStartServiceCustomer={handleOpenCustomerBrief}
              onBuyItem={handleBuyItem}
              onUpgrade={handleUpgrade}
              onReplyReview={handleReplyReview}
              onUpdateServicePrice={handleUpdateServicePrice}
              onClaimQuest={handleClaimQuest}
            />
          )}
        </main>
      </div>

      {/* 1. Customer Brief Modal (Section 3) */}
      <CustomerBriefModal
        isOpen={isBriefModalOpen}
        request={currentRequest}
        onStart={handleStartWorkstation}
      />

      {/* 2. Completion Result & Showcase Modal (Section 18 & 19) */}
      {lastReport && lastServedCustomer && lastServedRequest && (
        <CompletionResultModal
          isOpen={isCompletionModalOpen}
          customer={lastServedCustomer}
          request={lastServedRequest}
          report={lastReport}
          onClose={handleCloseCompletionModal}
        />
      )}

      {/* 3. Utility Modals */}
      <RenameShopModal
        isOpen={isRenameModalOpen}
        currentName={gameState.shopName}
        onClose={() => setIsRenameModalOpen(false)}
        onSaveName={(newName) => setGameState((prev) => ({ ...prev, shopName: newName }))}
      />

      <HagglingModal
        isOpen={isHagglingModalOpen}
        onClose={() => setIsHagglingModalOpen(false)}
        onSuccessDiscount={(discount) =>
          setGameState((prev) => ({
            ...prev,
            hasHaggledToday: true,
            hagglingDiscount: discount,
          }))
        }
      />

      <CustomerBookModal
        isOpen={isCustomerBookModalOpen}
        onClose={() => setIsCustomerBookModalOpen(false)}
        activeCustomers={gameState.activeCustomers}
      />

      <UnlockRoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={() => setIsRoadmapModalOpen(false)}
        currentDay={gameState.day}
      />

      <MarketingAndCompetitorsModal
        isOpen={isMarketingModalOpen}
        onClose={() => setIsMarketingModalOpen(false)}
        money={gameState.money}
        currentDay={gameState.day}
        marketingList={gameState.activeMarketing}
        competitors={gameState.competitors}
        onStartCampaign={handleStartMarketingCampaign}
        onTrollCompetitor={handleTrollCompetitor}
      />

      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        achievements={gameState.achievements}
        onClaimAchievement={handleClaimAchievement}
      />

      <DaySummaryModal
        isOpen={isDaySummaryModalOpen}
        day={gameState.day}
        customersServedToday={gameState.completedCustomerCountToday}
        revenueToday={gameState.totalRevenue}
        onNextDay={handleNextDay}
      />
    </div>
  );
}
