
export enum Rarity {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export enum StoryPhase {
  SETUP = 'SETUP',       // Pages 1-2
  ADVENTURE = 'ADVENTURE', // Pages 3-6
  CLIMAX = 'CLIMAX',     // Pages 7-8
  RESOLUTION = 'RESOLUTION' // Pages 9-10
}

export interface AvatarStyle {
  id: string;
  name: string;
  prompt: string;
  colorClass: string;
  emoji: string;
  seedPrefix: string;
}

export interface CardData {
  id: string;
  name: string;
  description: string; // The instruction for AI
  rarity: Rarity;
  phase: StoryPhase; 
  icon?: string;
  unlocksHeroId?: string; // If this card unlocks a hero
  worldId?: string; // Specific to a world (e.g., 'sky-island')
}

export interface Hero {
  id: string;
  name: string;
  power: string; // Displayed to user
  aiInstruction: string; // Internal instruction for the Story AI
  avatarUrl: string; // Used for generated avatar or custom image
  emoji: string; // For the icon display
  appearance?: string; // Visual description for the AI image prompt
  avatarStyleId?: string; // To track which style was selected (for custom heroes)
  isLocked?: boolean; // UI state
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl: string;
  userChoice?: string; // The card name that led here
  phase?: StoryPhase;
}

export interface SavedStory {
  id: string;
  timestamp: number;
  hero: Hero;
  pages: StoryPage[];
  authorName: string;
  starsCollected: number;
  // Resume functionality
  isFinished?: boolean;
  currentPhase?: StoryPhase;
  usedCardIds?: string[];
  heroEncountered?: boolean;
  activeCompanionId?: string; // Track who is with the hero
}

export interface AppState {
  phase: 'onboarding' | 'playing' | 'ending' | 'library' | 'reading';
  userHero: Hero | null;
  story: StoryPage[];
  currentPageIndex: number; // For browsing the book
  isLoading: boolean;
  loadingMessage: string;
  showGacha: boolean;
  gachaRarity: Rarity | null;
  currentPhase: StoryPhase; // Track where we are in the arc
  usedCardIds: string[]; // Track cards used in the current session
  unlockedHeroIds: string[]; // Persisted list of unlocked heroes
  goldCoins: number; // Virtual Currency
}
