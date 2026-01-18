
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Hero, CardData, Rarity, StoryPage, SavedStory, StoryPhase } from './types';
import { DEFAULT_HEROES, UNLOCKABLE_HEROES, SUPERPOWERS, GACHA_TRIGGER_PAGES, TOTAL_PAGES, WORLDS, ALL_CARDS } from './constants';
import { generateStoryPage, generateIllustration, analyzeCharacterImage, generateAvatarFromDescription } from './services/geminiService';
import { generateStoryPDF } from './services/pdfService';
import { Button } from './components/Button';
import { BookView } from './components/BookView';
import { GachaOverlay } from './components/GachaOverlay';
import { Library } from './components/Library';
import { LoadingOverlay } from './components/LoadingOverlay';

const STORAGE_KEY = 'sky_island_stories_v1';
const HERO_UNLOCKS_KEY = 'sky_island_hero_unlocks_v1';
const FIRST_TIME_USER_KEY = 'sky_island_has_played_v1';
const WALLET_KEY = 'sky_island_wallet_v1'; // New key for currency

interface ExtendedAppState extends AppState {
    heroEncountered: boolean;
    isGenerating: boolean;
    showLoadingOverlay: boolean;
    authorName: string;
    totalStarsCollected: number;
    activeCompanion: Hero | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<ExtendedAppState>({
    phase: 'onboarding',
    userHero: null,
    story: [],
    currentPageIndex: 0,
    isLoading: false,
    isGenerating: false,
    showLoadingOverlay: false,
    loadingMessage: '',
    showGacha: false,
    gachaRarity: null,
    currentPhase: StoryPhase.SETUP,
    usedCardIds: [],
    unlockedHeroIds: [],
    heroEncountered: false,
    authorName: '',
    totalStarsCollected: 0,
    activeCompanion: null,
    goldCoins: 3 // Default starting coins for new users
  });

  const [isNightMode, setIsNightMode] = useState(false); // Default to Sun version (false)
  const [onboardingStep, setOnboardingStep] = useState<number>(0); 
  const [createName, setCreateName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState<string>('sky-island');
  const [showCustomHeroForm, setShowCustomHeroForm] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false); // New state for info modal
  const [lowBalanceAlert, setLowBalanceAlert] = useState(false);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageAnalysisError, setImageAnalysisError] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);

  useEffect(() => {
    try {
      const storedStories = localStorage.getItem(STORAGE_KEY);
      if (storedStories) setSavedStories(JSON.parse(storedStories));
      
      const storedUnlocks = localStorage.getItem(HERO_UNLOCKS_KEY);
      const unlockedIds = storedUnlocks ? JSON.parse(storedUnlocks) : [];
      
      const storedCoins = localStorage.getItem(WALLET_KEY);
      const coins = storedCoins ? parseInt(storedCoins, 10) : 3; // Default 3 coins

      setState(prev => ({ 
          ...prev, 
          unlockedHeroIds: unlockedIds,
          goldCoins: coins 
      }));
      
      const hasPlayed = localStorage.getItem(FIRST_TIME_USER_KEY);
      if (hasPlayed) setIsFirstTimeUser(false);
    } catch (e) {
      console.error("Failed to load storage", e);
    }
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = isNightMode ? '#3a548c' : '#FFFBF0';
  }, [isNightMode]);

  // Persist Coins whenever they change
  useEffect(() => {
      localStorage.setItem(WALLET_KEY, state.goldCoins.toString());
  }, [state.goldCoins]);

  const getPhaseForPage = (pageNumber: number): StoryPhase => {
    if (pageNumber <= 2) return StoryPhase.SETUP;
    if (pageNumber <= 6) return StoryPhase.ADVENTURE;
    if (pageNumber <= 8) return StoryPhase.CLIMAX;
    return StoryPhase.RESOLUTION;
  };

  const getCollectedCards = (): CardData[] => {
      return state.usedCardIds
        .map(id => ALL_CARDS.find(c => c.id === id))
        .filter((c): c is CardData => !!c);
  };

  const saveStory = (hero: Hero, pages: StoryPage[], isFinished: boolean = true) => {
    const newStory: SavedStory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      hero,
      pages,
      authorName: state.authorName || 'The Dreamer',
      starsCollected: state.totalStarsCollected,
      isFinished,
      currentPhase: state.currentPhase,
      usedCardIds: state.usedCardIds,
      heroEncountered: state.heroEncountered,
      activeCompanionId: state.activeCompanion?.id
    };
    
    const updatedStories = [newStory, ...savedStories].slice(0, 5);
    setSavedStories(updatedStories);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
      if (isFirstTimeUser && isFinished) {
          localStorage.setItem(FIRST_TIME_USER_KEY, 'true');
          setIsFirstTimeUser(false);
      }
    } catch (e) {}
  };

  const unlockHero = (heroId: string) => {
      if (state.unlockedHeroIds.includes(heroId)) return;
      const newUnlocks = [...state.unlockedHeroIds, heroId];
      setState(prev => ({ ...prev, unlockedHeroIds: newUnlocks }));
      localStorage.setItem(HERO_UNLOCKS_KEY, JSON.stringify(newUnlocks));
  };

  const clearLibrary = () => {
      setSavedStories([]);
      localStorage.removeItem(STORAGE_KEY);
  };

  const resetOnboarding = () => {
      setState(prev => ({
          ...prev, 
          phase: 'onboarding', 
          userHero: null, 
          authorName: '', 
          totalStarsCollected: 0,
          story: [],
          activeCompanion: null
      }));
      setOnboardingStep(0);
      setUploadedImage(null);
      setCreateName('');
      setImageDescription(null);
      setNameError(false);
  };

  const handleSaveAndExit = () => {
    if (state.userHero && state.story.length > 0) {
        saveStory(state.userHero, state.story, false);
    }
    resetOnboarding();
  };
  
  const handleDownloadPDF = async () => {
    if (state.userHero && state.story.length > 0) {
       // Construct a temporary SavedStory object for the PDF generator
       const currentStory: SavedStory = {
          id: 'temp',
          timestamp: Date.now(),
          hero: state.userHero,
          pages: state.story,
          authorName: state.authorName || 'The Dreamer',
          starsCollected: state.totalStarsCollected,
          isFinished: true
       };
       await generateStoryPDF(currentStory);
    }
  };

  const incrementStarCount = () => {
      setState(prev => ({ ...prev, totalStarsCollected: prev.totalStarsCollected + 1 }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsAnalyzingImage(true);
      setImageAnalysisError(null);
      setImageDescription(null);
      setUploadedImage(null);

      const reader = new FileReader();
      reader.onloadend = async () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          try {
              const result = await analyzeCharacterImage(base64Data);
              if (result.isValid && result.description) {
                  setImageDescription(result.description);
                  const generatedAvatar = await generateAvatarFromDescription(result.description);
                  setUploadedImage(generatedAvatar);
              } else {
                  setImageAnalysisError("Hmm, try a clearer photo!");
              }
          } catch (e) {
              setImageAnalysisError("Oops, something went wrong.");
          } finally {
              setIsAnalyzingImage(false);
          }
      };
      reader.readAsDataURL(file);
  };

  const handleSelectHero = (hero: Hero) => {
      setState(prev => ({ ...prev, userHero: hero }));
      setOnboardingStep(2);
  };

  const handleFinishCustomHero = () => {
    if (!createName.trim()) {
        setNameError(true);
        return;
    }
    if (!uploadedImage || !imageDescription) return;
    
    const randomPower = SUPERPOWERS[Math.floor(Math.random() * SUPERPOWERS.length)];
    const customHero: Hero = {
      id: `custom-${Date.now()}`,
      name: createName,
      power: randomPower,
      aiInstruction: `Protagonist trait: The creator. Power: ${randomPower}.`,
      emoji: '✨',
      avatarUrl: uploadedImage,
      appearance: imageDescription,
    };
    const author = state.authorName || createName;
    setState(prev => ({ ...prev, userHero: customHero, authorName: author }));
    setShowCustomHeroForm(false);
    setOnboardingStep(2);
  };

  const launchAdventure = async () => {
    if (!state.userHero) return;
    
    // --- GOLD COIN CHECK ---
    if (state.goldCoins < 1) {
        setLowBalanceAlert(true);
        setTimeout(() => setLowBalanceAlert(false), 1000);
        return;
    }
    
    // Deduct Coin and Start
    setState(prev => ({ 
        ...prev, 
        goldCoins: prev.goldCoins - 1,
        isGenerating: true,
        showLoadingOverlay: true,
        loadingMessage: `Entering ${WORLDS.find(w => w.id === selectedWorldId)?.name}...`, 
        usedCardIds: [],
        currentPhase: StoryPhase.SETUP,
        heroEncountered: false,
        totalStarsCollected: 0,
        activeCompanion: null
    }));
    
    const worldContext = WORLDS.find(w => w.id === selectedWorldId)?.description || "";
    const { text, imagePrompt } = await generateStoryPage(state.userHero, worldContext, StoryPhase.SETUP, null);
    // Pass userHero.avatarUrl as reference
    const imageUrl = await generateIllustration(imagePrompt, state.userHero.avatarUrl);

    const firstPage: StoryPage = { pageNumber: 1, text, imageUrl, phase: StoryPhase.SETUP };

    setState(prev => ({
      ...prev,
      phase: 'playing',
      isGenerating: false,
      story: [firstPage],
      currentPageIndex: 0
    }));
  };

  const determineRarity = (): Rarity => {
    const rand = Math.random() * 100;
    if (rand < 33.33) return Rarity.SILVER;
    if (rand < 66.66) return Rarity.GOLD;
    return Rarity.PLATINUM;
  };

  const handleNextPage = async () => {
    if (state.phase === 'reading' || state.phase === 'ending') {
        if (state.currentPageIndex < state.story.length - 1) {
            setState(prev => ({ ...prev, currentPageIndex: prev.currentPageIndex + 1 }));
        }
        return;
    }

    const { currentPageIndex, story } = state;
    const currentPageNum = currentPageIndex + 1;

    if (currentPageIndex === story.length - 1) {
        if (currentPageNum >= TOTAL_PAGES) {
           setState(prev => ({...prev, phase: 'ending'}));
           if (state.userHero) saveStory(state.userHero, state.story, true);
           return;
        }

        if (GACHA_TRIGGER_PAGES.includes(currentPageNum)) {
            const nextPageNum = currentPageNum + 1;
            const nextPhase = getPhaseForPage(nextPageNum);
            let rarity = determineRarity();
            
            if (nextPhase === StoryPhase.ADVENTURE && !state.heroEncountered) {
                 rarity = Math.random() > 0.5 ? Rarity.GOLD : Rarity.PLATINUM;
            }

            setState(prev => ({ 
                ...prev, 
                showGacha: true, 
                gachaRarity: rarity,
                currentPhase: nextPhase 
            }));
        } else {
            const nextPhase = getPhaseForPage(currentPageNum + 1);
            setState(prev => ({ 
                ...prev, 
                isGenerating: true,
                showLoadingOverlay: true, 
                loadingMessage: `Writing Page ${currentPageNum + 1}...` 
            }));
            await generateNextPageContent(undefined, nextPhase);
        }
    } else {
        setState(prev => ({ ...prev, currentPageIndex: prev.currentPageIndex + 1 }));
    }
  };

  const handleCardSelect = async (card: CardData) => {
    let nextCompanion = state.activeCompanion;
    let heroEncountered = state.heroEncountered;

    // Determine if this card adds a new companion
    if (card.unlocksHeroId) {
        unlockHero(card.unlocksHeroId);
        const npcHero = UNLOCKABLE_HEROES.find(h => h.id === card.unlocksHeroId);
        if (npcHero) {
            nextCompanion = npcHero;
            heroEncountered = true;
        }
    }

    setState(prev => ({ 
        ...prev, 
        showGacha: false, 
        isGenerating: true,
        showLoadingOverlay: true,
        loadingMessage: `Weaving destiny...`,
        usedCardIds: [...prev.usedCardIds, card.id],
        activeCompanion: nextCompanion,
        heroEncountered: heroEncountered
    }));
    
    // Pass the companion we just determined directly to generation
    await generateNextPageContent(card, state.currentPhase, nextCompanion);
  };

  const generateNextPageContent = async (card?: CardData, phaseOverride?: StoryPhase, companionOverride?: Hero | null) => {
    if (!state.userHero) return;
    const activePhase = phaseOverride || state.currentPhase;
    // Use override if provided (from handleCardSelect), otherwise state
    const currentCompanion = companionOverride !== undefined ? companionOverride : state.activeCompanion;

    const previousText = state.story.map(p => p.text).slice(-3).join(" "); 
    const isEnding = state.story.length + 1 === TOTAL_PAGES;
    
    const { text, imagePrompt, companionStatus } = await generateStoryPage(
        state.userHero, 
        previousText, 
        activePhase, 
        currentCompanion, 
        card, 
        isEnding
    );
    
    // Handle companion logic: If status is LEAVES, they are gone for next time.
    // If STAYS, they persist.
    let nextActiveCompanion = currentCompanion;
    if (companionStatus === 'LEAVES') {
        nextActiveCompanion = null;
    }

    // Pass userHero.avatarUrl as main reference, and npc as secondary if available
    // Always use currentCompanion for this page's illustration
    const imageUrl = await generateIllustration(
        imagePrompt, 
        state.userHero.avatarUrl, 
        currentCompanion?.avatarUrl
    );
    
    const newPage: StoryPage = {
        pageNumber: state.story.length + 1,
        text,
        imageUrl,
        userChoice: card?.name,
        phase: activePhase
    };
    
    setState(prev => ({
        ...prev,
        isGenerating: false,
        story: [...prev.story, newPage],
        currentPageIndex: prev.story.length,
        currentPhase: activePhase,
        activeCompanion: nextActiveCompanion // Update state based on AI decision
    }));
  };

  const loadSavedStory = (story: SavedStory) => {
      const isResuming = story.isFinished === false;
      const companion = story.activeCompanionId 
        ? UNLOCKABLE_HEROES.find(h => h.id === story.activeCompanionId) || null 
        : null;

      setState({
          phase: isResuming ? 'playing' : 'reading',
          userHero: story.hero,
          story: story.pages,
          currentPageIndex: isResuming ? story.pages.length - 1 : 0, 
          isLoading: false,
          isGenerating: false,
          showLoadingOverlay: false,
          loadingMessage: '',
          showGacha: false,
          gachaRarity: null,
          usedCardIds: story.usedCardIds || [],
          unlockedHeroIds: state.unlockedHeroIds,
          currentPhase: story.currentPhase || StoryPhase.SETUP,
          heroEncountered: story.heroEncountered || false,
          authorName: story.authorName || 'The Dreamer',
          totalStarsCollected: story.starsCollected || 0,
          activeCompanion: companion,
          goldCoins: state.goldCoins // Keep current coins
      });
  };

  const updateHeroEncountered = (encountered: boolean) => {
      if (encountered && !state.heroEncountered) {
          setState(prev => ({ ...prev, heroEncountered: true }));
      }
  };

  const onLoadingGameComplete = () => {
    setState(prev => ({ ...prev, showLoadingOverlay: false }));
  };

  const getWorldFlavorText = (id: string) => {
      switch(id) {
          case 'sky-island': return "Where clouds are trampolines and gravity is just a suggestion.";
          case 'neon-city': return "A glowing metropolis run by cats who know way too much.";
          case 'dino-valley': return "Prehistoric lizards having tea parties. Bring a hat.";
          default: return "A mystery waiting to unfold.";
      }
  };

  if (state.phase === 'library') {
      return (
          <Library 
            stories={savedStories} 
            onSelectStory={loadSavedStory} 
            onBack={() => setState(prev => ({...prev, phase: 'onboarding'}))}
            onClear={clearLibrary}
            isNightMode={isNightMode}
          />
      );
  }

  const currentStoryPageNumber = state.story[state.currentPageIndex]?.pageNumber;
  const isNextGacha = state.phase === 'playing' && 
                      state.currentPageIndex === state.story.length - 1 &&
                      GACHA_TRIGGER_PAGES.includes(currentStoryPageNumber);
  
  const bgGradient = isNightMode 
    ? 'radial-gradient(circle at 50% 120%, #5b7bb8, #3a548c)' 
    : 'radial-gradient(circle at 50% 0%, #FFF8E7, #E0F2FE)';
  
  const iconUrl = isNightMode
    ? "https://i.postimg.cc/BZR9gqvg/jimeng-2026-01-06-3317-ka-tong-ping-mian-hua-yue-liang-you-dian-wen-li-bu-yong-miao-bian-bu-ni-ren-hua-chun-bai-se-bei-jing.png"
    : "https://i.postimg.cc/8c53bY88/jimeng-2026-01-06-2978-ka-tong-shou-hui-feng-ge-tai-yang-bu-ni-ren-hua-chun-bai-se-bei-jing.png";

  return (
    <div className={`min-h-screen relative font-['Nunito'] overflow-x-hidden transition-colors duration-700 ${isNightMode ? 'text-white' : 'text-slate-800'}`}>
      
      {state.phase === 'onboarding' && (
        <>
            <div className="fixed top-4 left-4 z-50">
                <button 
                    onClick={() => setIsNightMode(!isNightMode)} 
                    className="hover:scale-110 transition-transform duration-300 group"
                    aria-label="Toggle Theme"
                >
                    <img src={iconUrl} alt={isNightMode ? "Moon" : "Sun"} className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg group-hover:drop-shadow-2xl" />
                </button>
            </div>

             {/* Only show Wallet and Library if NOT on step 0 (Welcome Screen) */}
             {onboardingStep !== 0 && (
                <div className="fixed top-4 right-4 z-50 flex gap-2 md:gap-4">
                    {/* WALLET DISPLAY */}
                    <div 
                        className={`bg-yellow-400 text-yellow-900 px-4 py-3 rounded-full border-4 border-yellow-200 font-black text-lg shadow-xl flex items-center gap-2 transform transition-transform duration-300 ${lowBalanceAlert ? 'scale-110 bg-red-500 text-white border-red-300 animate-pulse' : ''}`}
                        title="Gold Coins required to play"
                    >
                        <span className="text-2xl drop-shadow-sm">🪙</span>
                        <span>{state.goldCoins}</span>
                        <button 
                            className="ml-1 bg-black/10 w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-black/20"
                            onClick={() => setState(prev => ({...prev, goldCoins: prev.goldCoins + 1}))} // Mocking purchasing
                            title="Add Coins (Mock)"
                        >
                            +
                        </button>
                    </div>

                    <button 
                        onClick={() => setState(prev => ({...prev, phase: 'library'}))}
                        className="bg-white hover:bg-slate-50 text-slate-800 px-6 py-3 rounded-full border-4 border-white/50 font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <span>📚</span>
                        <span className="hidden md:inline">Library</span>
                    </button>
                </div>
             )}
        </>
      )}

      <div className="fixed inset-0 -z-20 transition-all duration-1000" style={{ background: bgGradient }}></div>
      
      <div className={`fixed top-20 left-10 w-32 h-12 blur-xl rounded-full animate-float transition-colors duration-1000 ${isNightMode ? 'bg-white/10' : 'bg-white/60'}`}></div>
      <div className={`fixed top-40 right-20 w-48 h-16 blur-xl rounded-full animate-float-delayed transition-colors duration-1000 ${isNightMode ? 'bg-white/5' : 'bg-white/50'}`}></div>

      {state.phase === 'onboarding' ? (
        <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
            
            <div className={`text-center mb-8 md:mb-12 animate-pop transition-all duration-500 ${onboardingStep === 0 ? 'mt-24 md:mt-24' : 'mt-24 md:mt-0'}`}>
                <h1 className={`text-6xl md:text-8xl font-black drop-shadow-[0_8px_0_rgba(234,88,12,0.8)] stroke-orange-800 font-display tracking-tight leading-none ${isNightMode ? 'text-white' : 'text-slate-800'}`}>
                    Dreamland
                    <span className="text-yellow-300 ml-2">Ai</span>
                </h1>
                <div className="mt-4 inline-block bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg transform -rotate-2">
                     <p className="text-brand-primary font-bold text-lg md:text-xl tracking-wide">Your destiny, you decide!</p>
                </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-card-float border-4 border-white/50 w-full max-w-7xl animate-fade-in-up transition-all duration-500 mb-8">
                
                {/* STEP 0: WELCOME & HOW TO PLAY */}
                {onboardingStep === 0 && (
                    <div className="flex flex-col items-center gap-8 py-4">
                        <div className="text-center max-w-4xl mb-4">
                             <h2 className={`text-4xl md:text-5xl font-black font-display mb-4 ${isNightMode ? 'text-indigo-900' : 'text-slate-800'}`}>
                                 Make Your Own Book!
                             </h2>
                             <p className={`text-xl md:text-2xl font-bold font-display leading-relaxed ${isNightMode ? 'text-indigo-800' : 'text-slate-600'}`}>
                                 Go on an adventure where YOU make the choices.
                             </p>
                        </div>
                        
                        {/* Start Button */}
                        <div className="w-full flex justify-center mb-4">
                            <Button 
                                variant="primary" 
                                size="lg" 
                                className="text-3xl px-12 py-8 shadow-3d-primary"
                                onClick={() => setOnboardingStep(1)}
                            >
                                Start Creating
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                            {/* Step Card 1 */}
                            <div className="bg-white/80 p-6 rounded-3xl shadow-lg border-2 border-orange-100 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
                                <div className="text-6xl mb-4 bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center shadow-inner">🦸</div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2 font-display">1. Decide a Hero</h3>
                                <p className="text-lg font-bold text-slate-600">Pick a character or upload your own photo to be the star!</p>
                            </div>

                            {/* Step Card 2 */}
                            <div className="bg-white/80 p-6 rounded-3xl shadow-lg border-2 border-blue-100 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 delay-100">
                                <div className="text-6xl mb-4 bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center shadow-inner">🎬</div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2 font-display">2. Direct the Plot</h3>
                                <p className="text-lg font-bold text-slate-600">Make choices, collect items, and shape the story's ending.</p>
                            </div>

                            {/* Step Card 3 */}
                            <div className="bg-white/80 p-6 rounded-3xl shadow-lg border-2 border-purple-100 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 delay-200">
                                <div className="text-6xl mb-4 bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center shadow-inner">📚</div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2 font-display">3. Publish & Share</h3>
                                <p className="text-lg font-bold text-slate-600">Save your book to the library and show your friends.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 1: HERO SELECTION */}
                {onboardingStep === 1 && (
                    <div className="flex flex-col gap-6 animate-fade-in-up relative">
                        <div className="text-center mt-4 mb-4 md:mb-8 relative flex flex-col items-center">
                            <button 
                                onClick={() => setOnboardingStep(0)}
                                className="absolute left-0 top-2 text-slate-400 hover:text-slate-600 font-bold bg-white/50 px-4 py-2 rounded-full hidden md:block"
                            >
                                ← Back
                            </button>

                            <div className="flex items-center gap-3 mb-2">
                                <h2 className={`text-5xl md:text-7xl font-black font-display tracking-tight drop-shadow-md ${isNightMode ? 'text-indigo-900' : 'text-slate-800'}`}>
                                    Pick Your Hero
                                </h2>
                                <button 
                                    onClick={() => setShowInfoModal(true)}
                                    className="bg-white/50 hover:bg-white hover:scale-110 text-2xl w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm transition-all border-2 border-slate-200"
                                    title="How it works"
                                >
                                    ❓
                                </button>
                            </div>

                            <p className={`text-2xl md:text-3xl font-bold font-display ${isNightMode ? 'text-indigo-700/80' : 'text-slate-500'}`}>
                                Who will you be today?
                            </p>
                            
                            <div className={`inline-block mt-4 px-6 py-2 rounded-full border-2 ${isNightMode ? 'bg-indigo-100/50 border-indigo-200 text-indigo-800' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                                <p className="font-bold text-sm md:text-base flex items-center gap-2">
                                    <span>✨</span>
                                    <span>Find <b>Gold & Platinum</b> cards to unlock new heroes!</span>
                                    <span>✨</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 p-2">
                             <div 
                                onClick={() => setShowCustomHeroForm(true)}
                                className="bg-gradient-to-b from-blue-50 to-indigo-50 rounded-[2rem] border-4 border-dashed border-indigo-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.03] hover:border-indigo-400 hover:shadow-xl transition-all active:scale-95 group min-h-[18rem]"
                             >
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-md mb-4 group-hover:rotate-12 transition-transform">
                                    📸
                                </div>
                                <h3 className="text-xl font-black text-indigo-900 text-center">Join as myself!</h3>
                             </div>

                             {DEFAULT_HEROES.concat(UNLOCKABLE_HEROES).map(hero => {
                                 const isLocked = state.unlockedHeroIds.indexOf(hero.id) === -1 && hero.isLocked;
                                 
                                 return (
                                     <div 
                                         key={hero.id}
                                         onClick={() => !isLocked && handleSelectHero(hero)}
                                         className={`
                                            bg-white rounded-[2rem] p-4 flex flex-col items-center relative overflow-hidden transition-all duration-300 group min-h-[18rem] border-4 
                                            ${isLocked 
                                                ? 'grayscale cursor-not-allowed opacity-90 border-slate-200' 
                                                : 'cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:bg-orange-50 hover:border-orange-300 border-transparent'
                                            }
                                         `}
                                     >
                                         <div className={`w-full aspect-square rounded-[1.5rem] overflow-hidden mb-3 bg-orange-100 relative ${isLocked ? 'brightness-50' : ''}`}>
                                             <img 
                                                 src={hero.avatarUrl} 
                                                 className={`w-full h-full object-cover transition-transform duration-500 ${isLocked ? '' : 'group-hover:scale-110'}`} 
                                                 onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${hero.name}`; }}
                                             />
                                             {isLocked && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-black/40 backdrop-blur-sm rounded-full p-4 border-2 border-white/50">
                                                        <div className="text-4xl">🔒</div>
                                                    </div>
                                                </div>
                                             )}
                                         </div>
                                         <h3 className="text-xl font-black text-slate-800">{hero.name}</h3>
                                         <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mt-1">{hero.power}</p>
                                     </div>
                                 );
                             })}
                        </div>
                    </div>
                )}

                {/* STEP 2: WORLD SELECTION */}
                {onboardingStep === 2 && (
                    <div className="flex flex-col h-full animate-fade-in-up">
                         {/* ENHANCED HERO DISPLAY */}
                         <div className="flex justify-center mb-8">
                             <div 
                                className="bg-white p-2 pr-8 rounded-full shadow-xl flex items-center gap-4 border-4 border-orange-100 cursor-pointer hover:border-orange-300 hover:scale-105 transition-all duration-300 group" 
                                onClick={() => setOnboardingStep(1)}
                                title="Click to change hero"
                             >
                                 <div className="relative">
                                    <img 
                                        src={state.userHero?.avatarUrl} 
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md object-cover bg-orange-50" 
                                        alt={state.userHero?.name}
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                        <div className="text-2xl">{state.userHero?.emoji}</div>
                                    </div>
                                 </div>
                                 
                                 <div className="flex flex-col text-left">
                                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Adventures of</span>
                                     <span className="font-black text-slate-800 text-3xl md:text-4xl leading-none font-display">{state.userHero?.name}</span>
                                     <span className="text-orange-500 font-bold text-sm mt-1 group-hover:underline flex items-center gap-1">
                                        Swap Character ↺
                                     </span>
                                 </div>
                             </div>
                         </div>

                         <h2 className="text-4xl font-black text-center text-slate-800 font-display mb-8">Where to?</h2>

                         <div className="flex-1 relative group/scroll">
                            <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 px-8 md:px-0 py-8 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory">
                                {WORLDS.map(world => (
                                    <div 
                                        key={world.id}
                                        onClick={() => !world.locked && setSelectedWorldId(world.id)}
                                        className={`
                                            flex-shrink-0 w-auto h-96 md:h-[28rem] aspect-[3/4] snap-center
                                            relative
                                            rounded-[2.5rem] overflow-hidden cursor-pointer 
                                            transition-all duration-300 transform 
                                            ${selectedWorldId === world.id 
                                                ? 'ring-8 ring-orange-400 shadow-2xl scale-[1.02] z-10' 
                                                : 'opacity-80 hover:opacity-100 hover:scale-[1.02] hover:shadow-xl bg-white'
                                            }
                                            ${world.locked ? 'grayscale cursor-not-allowed opacity-50' : ''}
                                        `}
                                    >
                                        <img src={world.image} className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                        
                                        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                                            <div className="text-5xl mb-2 filter drop-shadow-md">{world.icon}</div>
                                            <h3 className="text-3xl font-black font-display mb-2 leading-none">{world.name}</h3>
                                            
                                            {!world.locked && (
                                                <p className="text-sm font-bold text-white/90 leading-tight">
                                                    {getWorldFlavorText(world.id)}
                                                </p>
                                            )}

                                            {world.locked && <span className="bg-black/50 px-3 py-1 rounded-full text-xs font-bold border border-white/30">LOCKED</span>}
                                        </div>

                                        {selectedWorldId === world.id && (
                                            <div className="absolute top-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                         </div>

                         <div className="mt-8 flex flex-col items-center justify-center w-full px-4">
                             <Button 
                                variant="primary" 
                                size="lg" 
                                onClick={launchAdventure}
                                fullWidth
                                className="max-w-sm shadow-3d-primary relative overflow-visible group text-2xl md:text-3xl"
                             >
                                Enter the World
                             </Button>

                             {/* Cost Indicator below button */}
                             <div className="mt-4 flex items-center gap-2 bg-yellow-400/90 text-yellow-900 px-4 py-1.5 rounded-full font-black text-sm border-2 border-yellow-200 shadow-sm transform hover:scale-105 transition-transform cursor-help" title="Cost to start">
                                <span className="uppercase tracking-wide opacity-80 text-[10px]">Ticket Cost:</span>
                                <div className="flex items-center gap-1 bg-white/30 px-2 rounded-md">
                                     <span>🪙</span>
                                     <span>1</span>
                                </div>
                             </div>
                         </div>
                    </div>
                )}
            </div>

            {showCustomHeroForm && (
                <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md p-4 md:p-8 flex items-center justify-center animate-pop">
                     <div className="bg-white rounded-[3rem] p-6 md:p-10 w-full max-w-2xl max-h-full overflow-y-auto shadow-2xl relative">
                         <button onClick={() => setShowCustomHeroForm(false)} className="absolute top-6 right-6 bg-slate-100 p-3 rounded-full hover:bg-slate-200 transition-colors font-bold text-slate-500">✕ Close</button>
                         
                         <h2 className="text-3xl font-black text-slate-800 mb-6 font-display">Create Your Hero</h2>
                         
                         <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-bold text-slate-500 mb-2">Your Name</label>
                                <input 
                                    type="text" 
                                    value={createName}
                                    onChange={(e) => {
                                        setCreateName(e.target.value);
                                        if (nameError) setNameError(false);
                                    }}
                                    placeholder="Enter Name..."
                                    className={`w-full text-2xl font-bold p-4 rounded-2xl border-4 transition-all outline-none text-slate-900 ${
                                        nameError 
                                        ? 'border-red-500 bg-red-50 placeholder-red-300 animate-pulse' 
                                        : 'border-slate-100 bg-slate-50 focus:border-orange-400 focus:bg-white'
                                    }`}
                                />
                                {nameError && <p className="text-red-500 font-bold mt-2 ml-2 text-sm">Please enter a name!</p>}
                            </div>

                            <div>
                                <label className="block text-lg font-bold text-slate-500 mb-2">Your Photo</label>
                                <div 
                                    className={`w-full h-64 border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center relative bg-slate-50 transition-colors cursor-pointer hover:bg-orange-50 hover:border-orange-300 overflow-hidden ${uploadedImage ? 'border-orange-500 bg-amber-50' : 'border-slate-300'}`}
                                    onClick={() => !uploadedImage && fileInputRef.current?.click()}
                                >
                                    {isAnalyzingImage ? (
                                         <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                                            <span className="font-bold text-orange-600">Making Magic...</span>
                                            <span className="text-lg font-bold text-orange-400">(This takes about 10 seconds)</span>
                                         </div>
                                    ) : uploadedImage ? (
                                        <div className="w-full h-full relative group">
                                            <img src={uploadedImage} className="w-full h-full object-contain" />
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setUploadedImage(null); }}
                                                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-5xl mb-2">📸</span>
                                            <span className="font-bold text-slate-400">Tap to Upload</span>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </div>
                                {imageAnalysisError && <div className="text-red-500 font-bold mt-2 text-center bg-red-50 p-2 rounded-lg">{imageAnalysisError}</div>}
                            </div>

                            <Button 
                                variant="primary" 
                                size="lg" 
                                fullWidth 
                                disabled={!uploadedImage}
                                onClick={handleFinishCustomHero}
                            >
                                Confirm Hero ✨
                            </Button>
                         </div>
                     </div>
                </div>
            )}
        </div>
      ) : (
        <>
            <header className="fixed top-0 left-0 w-full z-30 p-4 pointer-events-none">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    
                    <div className="pointer-events-auto flex items-center gap-2">
                         <button 
                            onClick={handleSaveAndExit}
                            className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg border-2 border-white/50 font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                            title="Save & Exit"
                         >
                            <span>💾</span>
                            <span className="hidden md:inline text-sm">Save & Exit</span>
                         </button>
                         
                         <div className="bg-white/90 backdrop-blur-md pl-2 pr-4 py-2 rounded-full shadow-lg border-2 border-white/50 flex items-center gap-2">
                            <img src={state.userHero?.avatarUrl} className="w-8 h-8 rounded-full border border-slate-200 bg-orange-100 object-cover" />
                            <span className="font-black text-slate-700 text-sm hidden md:block">{state.userHero?.name}</span>
                        </div>
                    </div>
                    
                    <div className="pointer-events-auto flex items-center gap-3">
                         <div className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg border-2 border-orange-400 font-bold">
                             {state.currentPageIndex + 1} / {TOTAL_PAGES}
                         </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 min-h-screen pt-20 pb-4 px-4 flex flex-col justify-center">
                {state.story[state.currentPageIndex] && (
                    <BookView 
                        page={state.story[state.currentPageIndex]}
                        pageIndex={state.currentPageIndex}
                        totalPages={TOTAL_PAGES}
                        onNext={handleNextPage}
                        onPrev={() => setState(prev => ({...prev, currentPageIndex: prev.currentPageIndex - 1}))}
                        canPrev={state.currentPageIndex > 0}
                        canNext={state.currentPageIndex < state.story.length - 1 || (state.phase !== 'reading' && state.phase !== 'ending')}
                        isGenerating={state.isGenerating || state.showLoadingOverlay}
                        isNextGacha={isNextGacha}
                        hero={state.userHero}
                        collectedCards={getCollectedCards()}
                        authorName={state.authorName || 'The Dreamer'}
                    />
                )}
            </main>
        </>
      )}

      {state.showLoadingOverlay && !state.showGacha && (
          <LoadingOverlay 
            isReady={!state.isGenerating} 
            onComplete={onLoadingGameComplete}
            message={state.loadingMessage}
            currentTotalStars={state.totalStarsCollected}
            onStarCollected={incrementStarCount}
            isNightMode={isNightMode}
          />
      )}

      {state.showGacha && (
        <GachaOverlay 
            targetRarity={state.gachaRarity} 
            phase={state.currentPhase}
            onCardSelect={handleCardSelect} 
            usedCardIds={state.usedCardIds}
            guaranteeHero={state.currentPhase === StoryPhase.ADVENTURE && !state.heroEncountered}
            banHeroes={state.heroEncountered}
            onCardsRevealed={(hasHero) => updateHeroEncountered(hasHero)}
            worldId={selectedWorldId} // Pass selectedWorldId
        />
      )}

      {/* Info Modal - Redesigned to be Cute & Colorful */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-8 border-[8px] border-orange-200 shadow-[0_0_50px_rgba(255,165,0,0.3)] animate-pop">
                 <button 
                    onClick={() => setShowInfoModal(false)}
                    className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                >
                    ✕
                </button>
                 
                 <h2 className="text-3xl font-black text-center text-slate-800 mb-6 font-display">
                     Every Game is New!
                 </h2>

                 {/* Cute Card Blob */}
                 <div className="bg-gradient-to-r from-amber-200 to-orange-300 rounded-3xl p-6 mb-4 transform -rotate-2 shadow-lg border-4 border-white">
                    <div className="text-5xl font-black text-white drop-shadow-md text-center">200+</div>
                    <div className="text-center font-bold text-orange-900 mt-1 text-lg">Magic Story Parts</div>
                 </div>

                 {/* Cute Story Blob */}
                 <div className="bg-gradient-to-r from-blue-300 to-indigo-400 rounded-3xl p-6 mb-6 transform rotate-1 shadow-lg border-4 border-white">
                     <div className="text-4xl font-black text-white drop-shadow-md text-center">12 Million</div>
                     <div className="text-center font-bold text-indigo-900 mt-1 text-lg">Possible Stories!</div>
                 </div>
                 
                 <p className="text-center text-slate-500 font-bold mb-6 text-lg leading-tight">
                    Collect cards to change your destiny. You will never read the same book twice!
                 </p>

                 <Button variant="primary" size="lg" fullWidth onClick={() => setShowInfoModal(false)}>Let's Play!</Button>
            </div>
        </div>
      )}

      {state.phase === 'ending' && (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl text-center shadow-2xl border-[8px] border-orange-100 animate-pop">
                <div className="text-8xl mb-4">🎉</div>
                <h1 className="text-5xl md:text-6xl font-black text-orange-500 font-display mb-4">The End!</h1>
                <p className="text-xl text-slate-600 font-bold mb-8">What a journey, {state.userHero?.name}!</p>
                
                <div className="bg-orange-50 rounded-3xl p-6 mb-8 border-2 border-orange-100">
                    <div className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-2">Total Stars</div>
                    <div className="text-6xl font-black text-orange-600">{state.totalStarsCollected} 🌟</div>
                </div>

                <div className="flex flex-col gap-4">
                    <Button variant="primary" size="lg" fullWidth onClick={() => setState(prev => ({...prev, phase: 'library'}))}>Save to Library 📚</Button>
                    <Button variant="secondary" size="lg" fullWidth onClick={resetOnboarding}>Play Again 🚀</Button>
                    
                    <button 
                        onClick={handleDownloadPDF}
                        className="w-full py-3 rounded-3xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                         <span>📥</span>
                         <span>Download Book as PDF</span>
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
