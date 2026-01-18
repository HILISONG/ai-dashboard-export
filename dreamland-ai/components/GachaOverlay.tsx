
import React, { useEffect, useState, useRef } from 'react';
import { Card } from './Card';
import { CardData, Rarity, StoryPhase } from '../types';
import { getCardsForPhase } from '../constants';
import { Button } from './Button';

interface GachaOverlayProps {
  onCardSelect: (card: CardData) => void;
  targetRarity: Rarity | null;
  phase: StoryPhase;
  usedCardIds: string[];
  guaranteeHero?: boolean;
  banHeroes?: boolean;
  onCardsRevealed?: (hasHero: boolean) => void;
  worldId?: string; // Added worldId
}

export const GachaOverlay: React.FC<GachaOverlayProps> = ({ 
    onCardSelect, 
    targetRarity, 
    phase, 
    usedCardIds, 
    guaranteeHero,
    banHeroes,
    onCardsRevealed,
    worldId = 'sky-island'
}) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (!targetRarity || hasGeneratedRef.current) return;

    // Pass worldId to getCardsForPhase
    let rawCards = getCardsForPhase(phase, targetRarity, 15, worldId);
    let available = rawCards.filter(c => !usedCardIds.includes(c.id));

    if (banHeroes) {
        available = available.filter(c => !c.unlocksHeroId);
    }

    let finalSelection: CardData[] = [];

    if (guaranteeHero) {
        let heroCard = available.find(c => c.unlocksHeroId);
        if (!heroCard) {
            const goldCards = getCardsForPhase(phase, Rarity.GOLD, 20, worldId);
            heroCard = goldCards.find(c => c.unlocksHeroId && !usedCardIds.includes(c.id));
        }
        if (heroCard) {
            finalSelection.push(heroCard);
            available = available.filter(c => c.id !== heroCard!.id);
        }
    }

    while (finalSelection.length < 3 && available.length > 0) {
        const nextCard = available.shift();
        if (nextCard) finalSelection.push(nextCard);
    }
    
    finalSelection = finalSelection.sort(() => 0.5 - Math.random());

    setCards(finalSelection);
    hasGeneratedRef.current = true;
    
    const timer = setTimeout(() => {
        setRevealed(true);
        const hasHero = finalSelection.some(c => c.unlocksHeroId);
        if (onCardsRevealed) onCardsRevealed(hasHero);
    }, 1500);
    return () => clearTimeout(timer);
  }, [targetRarity, phase, usedCardIds, guaranteeHero, banHeroes, worldId]);

  const handleCardClick = (card: CardData) => {
      setSelectedCardId(card.id);
  };

  const handleConfirm = () => {
      const card = cards.find(c => c.id === selectedCardId);
      if (card) {
          onCardSelect(card);
      }
  };

  if (!targetRarity) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="text-white text-3xl md:text-5xl font-bold mb-4 animate-bounce text-center drop-shadow-lg">
        {revealed ? 'Create Your Destiny!' : 'Summoning Cards...'}
      </div>
      
      <div className="w-full max-w-6xl mb-24 md:mb-8">
        {/* Added significant padding (py-24) to the scroll container to ensure card scaling/translation doesn't clip */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible py-24 px-4 snap-x snap-mandatory no-scrollbar items-center justify-start md:justify-center">
            {cards.map((card) => (
            <div key={card.id} className="flex-shrink-0 snap-center flex justify-center transform scale-100 md:scale-110 transition-transform">
                <Card 
                  card={card} 
                  onClick={() => handleCardClick(card)} 
                  revealed={revealed}
                  isSelected={selectedCardId === card.id}
                />
            </div>
            ))}
            
            {/* Spacer for mobile to allow scrolling to the end comfortably */}
            <div className="w-4 md:hidden flex-shrink-0"></div>
        </div>
        
        {revealed && (
            <div className="md:hidden text-center text-white/50 text-sm mt-2 animate-pulse">
                Swipe to see more ↔
            </div>
        )}
      </div>

      {revealed && (
          <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4">
              <Button 
                variant="accent" 
                size="lg" 
                onClick={handleConfirm}
                disabled={!selectedCardId}
                className="w-full max-w-md shadow-2xl border-4 border-white"
              >
                  {selectedCardId ? 'Confirm Choice ✨' : 'Select a Card'}
              </Button>
          </div>
      )}
    </div>
  );
};
