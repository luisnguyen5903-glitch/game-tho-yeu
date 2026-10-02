export type NailShape = 'round' | 'oval' | 'square' | 'almond' | 'coffin' | 'stiletto' | 'squoval';

export type CustomerEmotion = 'calm' | 'happy' | 'pleased' | 'surprised' | 'worried' | 'hurt' | 'annoyed';

export interface NailCondition {
  dirtLevel: number; // 0 to 100
  excessLength: number; // 0 to 100
  hasOldPolish: boolean;
  hasOvergrownCuticles: boolean;
  isFragile: boolean;
}

export interface NailPolish {
  id: string;
  name: string;
  hex: string;
  category: 'basic' | 'pastel' | 'glitter' | 'jelly' | 'luxury' | 'chrome';
  price: number;
  unlockedAtDay: number;
  description: string;
  finish: 'glossy' | 'matte' | 'shimmer' | 'metallic' | 'chrome';
}

export type CharmCategory =
  | 'crystal'
  | 'rhinestone'
  | 'pearl'
  | 'aurora'
  | 'opal'
  | 'metallic'
  | 'diamond'
  | 'bow'
  | 'butterfly'
  | 'flower'
  | 'heart'
  | 'baguette'
  | 'teardrop';

export interface NailCharm {
  id: string;
  name: string;
  category: CharmCategory;
  price: number;
  unlockedAtDay: number;
  description: string;
  iconType: string;
  color: string;
  scale: number;
  facets?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PlacedCharm {
  id: string;
  charmId: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation: number;
  scale: number;
}

export interface Customer {
  id: string;
  name: string;
  avatarSeed: string;
  role: 'Khách mới' | 'Khách quen' | 'Khách khó tính' | 'Khách VIP' | 'KOL';
  favoriteShape: NailShape;
  favoriteColorId: string;
  patienceMax: number;
  budget: number;
  dialogueGreeting: string;
  dialogueSatisfaction: string;
  dialogueDisappointment: string;
  dialoguePain: string;
  dialoguePraise: string;
  dialogueSpill: string;
  affinity: number; // 0 to 100
  visitCount: number;
  nailCondition: NailCondition;
  strictness: number; // 1 (easy: ±15%) to 5 (pro: ±2%)
}

export interface CustomerRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerRole: string;
  avatarSeed: string;
  greetingDialogue: string;
  
  // Specific targets
  targetShape: NailShape;
  targetLength: 'short' | 'medium' | 'long';
  targetColorId: string;
  targetColorName: string;
  targetFinish: 'glossy' | 'matte' | 'shimmer';
  
  requiresFrench: boolean;
  requiresGems: boolean;
  requestedCharmCount: number;
  requiresSymmetry: boolean;
  
  requestedStyle: string; // "Clean / Tự nhiên", "Hàn Quốc nhẹ nhàng", "Dự tiệc sang trọng"
  specialConstraints: string[];
  toleranceErrorMargin: number; // 0.15 (easy) to 0.02 (pro)
  deadlineSeconds: number;
  baseReward: number;
}

export interface CustomerActionLog {
  cleanedDirt: boolean;
  dirtCleanedPct: number; // 0-100
  removedOldPolish: boolean;
  oldPolishRemovedPct: number; // 0-100
  pushedCuticles: boolean;
  
  trimmedLength: boolean;
  actualLengthPct: number; // 50-100
  cutTooShort: boolean;
  
  filed: boolean;
  filingProgress: number; // 0-100
  actualShape: NailShape;
  symmetryFilingPct: number; // 0-100
  
  appliedBaseCoat: boolean;
  appliedColor: boolean;
  actualColorId: string;
  actualColorName: string;
  paintedCoveragePct: number; // 0-100
  spillCount: number;
  spillCleanedPct: number; // 0-100
  
  hasFrenchTip: boolean;
  curedInUV: boolean;
  
  charmsPlaced: PlacedCharm[];
  symmetryGemsPct: number; // 0-100
  
  appliedTopCoat: boolean;
  timeSpentSeconds: number;
}

export interface EvaluationReport {
  totalScore: number; // 0 to 100
  stars: number; // 1 to 5
  isFullPerfect: boolean;
  milestones: string[];
  
  breakdown: {
    cleanScore: number;
    trimScore: number;
    fileScore: number;
    paintScore: number;
    gemScore: number;
    complianceScore: number;
  };
  
  penalties: { reason: string; points: number }[];
  praises: string[];
  criticisms: string[];
  improvements: string[];
  
  customerReactionDialogue: string;
  customerReactionEmotion: CustomerEmotion;
  
  earnedBaseMoney: number;
  earnedTipMoney: number;
  earnedXp: number;
  affinityDelta: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardMoney: number;
  rewardXp: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface SalonUpgrade {
  id: string;
  name: string;
  category: 'interior' | 'equipment' | 'comfort' | 'premises';
  level: number;
  maxLevel: number;
  cost: number;
  benefit: string;
  iconName: string;
  unlockedAtDay?: number;
}

export interface CustomerReview {
  id: string;
  customerId: string;
  customerName: string;
  avatarSeed: string;
  rating: number; // 1-5
  comment: string;
  dayNumber: number;
  profit: number;
  replyText?: string;
  replyOptions: { text: string; affinityBonus: number; reputationBonus: number }[];
  isReplied: boolean;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  cost: number;
  durationDays: number;
  daysRemaining: number;
  customerBoost: number;
  vipChance: number;
  tier: 'flyer' | 'social' | 'micro_kol' | 'macro_kol' | 'influencer';
  description: string;
  unlockedAtDay: number;
  isActive: boolean;
}

export interface CompetitorSalon {
  id: string;
  name: string;
  reputation: number;
  customersDaily: number;
  specialty: string;
  description: string;
  avatarIcon: string;
  trollCost: number;
  trolledToday: boolean;
}

export interface WeeklyTrend {
  id: string;
  title: string;
  description: string;
  targetColorId?: string;
  targetShape?: NailShape;
  targetCategory?: string;
  bonusPercent: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'stones' | 'nails' | 'customers' | 'salon' | 'combos';
  currentProgress: number;
  targetProgress: number;
  rewardMoney: number;
  rewardXp: number;
  isUnlocked: boolean;
  isClaimed: boolean;
}

export interface UnlockRoadmapItem {
  day: number;
  title: string;
  type: 'polish' | 'charm' | 'tool' | 'upgrade' | 'marketing' | 'salon' | 'customer';
  description: string;
  icon: string;
}

export interface GameState {
  shopName: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  money: number;
  reputation: number;
  day: number;
  dayPhase: 'prep' | 'serving' | 'ended';
  timeOfDay: string;
  
  inventory: Record<string, number>;
  unlockedPolishes: string[];
  unlockedCharms: string[];
  upgrades: Record<string, number>;
  
  activeMarketing: MarketingCampaign[];
  competitors: CompetitorSalon[];
  currentTrend: WeeklyTrend;
  
  activeCustomers: Customer[];
  completedCustomerCountToday: number;
  
  dailyQuests: DailyQuest[];
  reviews: CustomerReview[];
  achievements: Achievement[];
  
  totalCustomersServed: number;
  totalRevenue: number;
  averageRating: number;
  perfectComboStreak: number;
  highestScore: number;
  
  hagglingDiscount: number;
  hasHaggledToday: boolean;
  
  servicePrices: {
    basicCutCare: number;
    gelColor: number;
    frenchNail: number;
    ombreDesign: number;
    stonePerPiece: number;
  };
}
