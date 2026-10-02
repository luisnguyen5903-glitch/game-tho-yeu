import { GameState, Customer } from '../types/game';
import { INITIAL_GAME_STATE, INITIAL_CUSTOMERS } from '../data/initialData';

const SAVE_KEY = 'tiem_nail_cozy_save_v2';
const OLD_SAVE_KEY = 'tiem_nail_cozy_save_v1';

const defaultNailCondition = {
  dirtLevel: 30,
  excessLength: 50,
  hasOldPolish: false,
  hasOvergrownCuticles: true,
  isFragile: false,
};

function normalizeCustomer(c: Partial<Customer>): Customer {
  const match = INITIAL_CUSTOMERS.find((init) => init.id === c.id);
  return {
    id: c.id || match?.id || `cust_${Date.now()}`,
    name: c.name || match?.name || 'Khách Hàng',
    avatarSeed: c.avatarSeed || match?.avatarSeed || 'pi_teen',
    role: c.role || match?.role || 'Khách mới',
    favoriteShape: c.favoriteShape || match?.favoriteShape || 'almond',
    favoriteColorId: c.favoriteColorId || match?.favoriteColorId || 'p_nude_milky',
    patienceMax: c.patienceMax || match?.patienceMax || 90,
    budget: c.budget || match?.budget || 180000,
    dialogueGreeting: c.dialogueGreeting || match?.dialogueGreeting || 'Em chào chị chủ!',
    dialogueSatisfaction: c.dialogueSatisfaction || match?.dialogueSatisfaction || 'Móng đẹp lắm ạ!',
    dialogueDisappointment: c.dialogueDisappointment || match?.dialogueDisappointment || 'Hơi khác ý em một chút ạ.',
    dialoguePain: c.dialoguePain || match?.dialoguePain || 'Ái... nhẹ tay một chút giúp em nha!',
    dialoguePraise: c.dialoguePraise || match?.dialoguePraise || 'Màu sơn đẹp mê ly luôn chị ơi!',
    dialogueSpill: c.dialogueSpill || match?.dialogueSpill || 'Chị ơi có chút sơn lem ra khóe tay nè.',
    affinity: c.affinity ?? match?.affinity ?? 50,
    visitCount: c.visitCount ?? match?.visitCount ?? 1,
    strictness: c.strictness ?? match?.strictness ?? 2,
    nailCondition: {
      ...defaultNailCondition,
      ...(match?.nailCondition || {}),
      ...(c.nailCondition || {}),
    },
  };
}

export function loadSavedGame(): GameState {
  try {
    let raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      raw = localStorage.getItem(OLD_SAVE_KEY);
    }
    if (!raw) return INITIAL_GAME_STATE;

    const parsed = JSON.parse(raw);

    // Normalize active customers to ensure nailCondition is never undefined
    const rawCustomers = Array.isArray(parsed.activeCustomers) && parsed.activeCustomers.length > 0
      ? parsed.activeCustomers
      : INITIAL_CUSTOMERS.slice(0, 3);

    const normalizedCustomers = rawCustomers.map(normalizeCustomer);

    return {
      ...INITIAL_GAME_STATE,
      ...parsed,
      activeCustomers: normalizedCustomers,
      inventory: { ...INITIAL_GAME_STATE.inventory, ...(parsed.inventory || {}) },
      upgrades: { ...INITIAL_GAME_STATE.upgrades, ...(parsed.upgrades || {}) },
      servicePrices: { ...INITIAL_GAME_STATE.servicePrices, ...(parsed.servicePrices || {}) },
      dailyQuests: Array.isArray(parsed.dailyQuests) && parsed.dailyQuests.length > 0
        ? parsed.dailyQuests
        : INITIAL_GAME_STATE.dailyQuests,
      achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0
        ? parsed.achievements
        : INITIAL_GAME_STATE.achievements,
      activeMarketing: Array.isArray(parsed.activeMarketing) && parsed.activeMarketing.length > 0
        ? parsed.activeMarketing
        : INITIAL_GAME_STATE.activeMarketing,
      competitors: Array.isArray(parsed.competitors) && parsed.competitors.length > 0
        ? parsed.competitors
        : INITIAL_GAME_STATE.competitors,
    };
  } catch (e) {
    console.warn('Could not load save, using initial game state', e);
    return INITIAL_GAME_STATE;
  }
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game to localStorage', e);
  }
}

export function resetGame(): GameState {
  try {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(OLD_SAVE_KEY);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_GAME_STATE;
}

