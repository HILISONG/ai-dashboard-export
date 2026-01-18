
import React, { useState } from 'react';
import { CardData, Rarity } from '../types';

interface CardProps {
  card: CardData;
  onClick: (card: CardData) => void;
  revealed: boolean;
  isSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, revealed, isSelected }) => {
  const [flipped, setFlipped] = useState(false);

  const handleInteraction = () => {
    if (!revealed) {
      setFlipped(true);
      setTimeout(() => onClick(card), 600); 
    } else {
        onClick(card);
    }
  };

  const getRarityBackground = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.SILVER:
        return "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300";
      case Rarity.GOLD:
        return "bg-gradient-to-br from-amber-50 to-orange-100 border-orange-300";
      case Rarity.PLATINUM:
        return "bg-gradient-to-br from-indigo-50 to-purple-100 border-purple-300 holo-overlay";
      default:
        return "bg-white";
    }
  };

  const isRevealedOrFlipped = revealed || flipped;

  return (
    <div 
      className={`group relative w-60 h-[22rem] md:w-80 md:h-[30rem] cursor-pointer mx-auto transition-all duration-300 ease-out ${isSelected ? 'scale-105 z-10 -translate-y-4' : 'hover:scale-105 hover:-translate-y-2'}`}
      onClick={handleInteraction}
      style={{ perspective: '1000px' }}
    >
      {/* Selection Glow (Behind) */}
      <div className={`absolute -inset-4 bg-orange-400/50 rounded-[2.5rem] blur-xl transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>

      <div 
        className={`w-full h-full duration-700 transition-all`}
        style={{ 
            transformStyle: 'preserve-3d',
            transform: isRevealedOrFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        
        {/* Card Back - The "Mystery" Look */}
        <div 
            className="absolute w-full h-full rounded-[2rem] border-[6px] border-white shadow-card-float flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
           {/* Pattern */}
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
           <div className="text-8xl animate-bounce-slow filter drop-shadow-lg">
             {card.rarity === Rarity.PLATINUM ? '💎' : '✨'}
           </div>
           <div className="absolute bottom-8 font-display font-bold text-white/50 tracking-[0.2em] text-sm">TAP TO REVEAL</div>
        </div>

        {/* Card Front - The "Reward" Look */}
        <div 
            className={`absolute w-full h-full rounded-[2rem] border-[8px] p-6 flex flex-col items-center justify-between shadow-card-float overflow-hidden ${getRarityBackground(card.rarity)} ${isSelected ? 'border-orange-400' : 'border-white'}`}
            style={{ 
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)' 
            }}
        >
          
          {/* Shine effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>

          {/* New Hero Badge */}
          {card.unlocksHeroId && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl shadow-md z-10 animate-pulse">
                  NEW HERO!
              </div>
          )}

          <div className="text-center mt-2 md:mt-4 w-full relative z-10 flex flex-col items-center">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 md:mb-3 ${card.rarity === Rarity.PLATINUM ? 'bg-purple-200 text-purple-800' : 'bg-white/50 text-slate-500'}`}>
                {card.rarity} Card
            </span>
            
            {card.icon?.startsWith('http') ? (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/50 shadow-md overflow-hidden mb-2 bg-white flex items-center justify-center">
                    <img src={card.icon} alt={card.name} className="w-full h-full object-cover transform transition-transform group-hover:scale-110 duration-500" />
                </div>
            ) : (
                <div className="text-6xl md:text-8xl mb-2 filter drop-shadow-md transform transition-transform group-hover:scale-110 duration-300">{card.icon}</div>
            )}
            
            <h3 className="text-xl md:text-3xl font-bold leading-tight mt-1 md:mt-2 text-slate-800 font-display">{card.name}</h3>
          </div>
          
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-xl p-3 md:p-4 my-2 flex-1 flex items-center justify-center border border-white/50">
             <p className="text-center text-sm md:text-lg leading-snug text-slate-700 font-medium font-serif italic">
                "{card.description}"
             </p>
          </div>

          <div className={`w-full text-center text-sm font-bold uppercase tracking-widest py-3 rounded-xl transition-all ${isSelected ? 'bg-orange-500 text-white shadow-lg scale-105' : 'bg-slate-900/5 text-slate-500'}`}>
            {isSelected ? 'Selected ✓' : 'Tap to Pick'}
          </div>
        </div>
      </div>
    </div>
  );
};
