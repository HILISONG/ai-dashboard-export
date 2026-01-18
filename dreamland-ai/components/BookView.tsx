
import React from 'react';
import { StoryPage, Hero, CardData } from '../types';
import { Button } from './Button';

interface BookViewProps {
  page: StoryPage;
  pageIndex: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
  canPrev: boolean;
  isGenerating: boolean;
  isNextGacha?: boolean;
  hero?: Hero | null;
  collectedCards?: CardData[];
  authorName?: string;
}

export const BookView: React.FC<BookViewProps> = ({ 
  page, 
  pageIndex, 
  totalPages, 
  onNext, 
  onPrev,
  canNext,
  canPrev,
  isGenerating,
  isNextGacha,
  hero,
  collectedCards = [],
  authorName
}) => {
  return (
    <div className="flex flex-col w-full max-w-[85rem] mx-auto h-full justify-center">
      
      {/* 3D Book Container */}
      <div className="relative perspective-1000 mb-8">
        {/* Book Spine Shadow (Visual Depth) */}
        <div className="absolute top-4 left-4 right-0 bottom-[-16px] bg-slate-800 rounded-[3rem] -z-10"></div>
        
        <div className="bg-[#FAF9F6] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-white h-auto min-h-[60vh] relative">
            
            {/* Center spine gradient for desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-16 -ml-8 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent z-20 pointer-events-none mix-blend-multiply"></div>

            {/* Left Page (Illustration) */}
            <div className="w-full md:w-1/2 relative bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-white/50 z-10 pointer-events-none mix-blend-overlay"></div> {/* Grain simulation */}
                
                <div className="w-full h-full relative">
                  {/* Image with vignette */}
                  <img 
                    src={page.imageUrl} 
                    alt="Story illustration" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

                  {/* Floating Page Number */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-slate-800 shadow-lg text-lg z-20 font-display">
                      #{pageIndex + 1}
                  </div>

                  {/* Choice Badge */}
                  {page.userChoice && (
                    <div className="absolute bottom-6 right-6 bg-orange-500 text-white px-4 py-2 rounded-2xl font-bold shadow-lg transform rotate-[-2deg] z-20 border-2 border-white">
                        picked {page.userChoice}
                    </div>
                  )}
                </div>
            </div>

            {/* Right Page (Text) */}
            <div className="w-full md:w-1/2 flex flex-col justify-between bg-[#FAF9F6] relative p-6 md:p-12">
                {/* Paper Texture Overlay (CSS Pattern) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    {authorName && pageIndex === 0 && (
                        <div className="text-center mb-8 animate-fade-in-up">
                            <span className="block text-xs font-black uppercase tracking-[0.3em] text-orange-400 mb-2">A Story By</span>
                            <span className="font-display font-black text-3xl text-slate-800">{authorName}</span>
                        </div>
                    )}

                    <p className="text-2xl md:text-4xl leading-relaxed font-bold text-slate-800 font-display">
                        {page.text}
                    </p>
                </div>

                {/* Status Footer */}
                <div className="mt-8 pt-6 border-t-2 border-slate-100 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl shadow-inner">
                             {hero?.emoji}
                         </div>
                         <div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Power</div>
                             <div className="font-bold text-slate-700 leading-none">{hero?.power}</div>
                         </div>
                    </div>
                    
                    {collectedCards.length > 0 && (
                        <div className="flex -space-x-2">
                            {collectedCards.slice(-3).map((card, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center text-lg relative z-0 hover:z-10 hover:scale-110 transition-transform" title={card.name}>
                                    {card.icon}
                                </div>
                            ))}
                            {collectedCards.length > 3 && (
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border-2 border-white">
                                    +{collectedCards.length - 3}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-4 items-center justify-between px-2">
        <Button 
            variant="secondary" 
            size="md"
            onClick={onPrev}
            disabled={!canPrev || isGenerating}
            className="w-16 md:w-auto"
        >
            ←
        </Button>

        <div className="flex-1 flex justify-end">
            {isGenerating ? (
                <div className="bg-white px-8 py-4 rounded-3xl shadow-lg border-2 border-orange-100 flex items-center gap-3 animate-pulse">
                     <span className="text-2xl animate-spin">✨</span>
                     <span className="font-black text-orange-400 uppercase tracking-widest">Dreaming...</span>
                </div>
            ) : (
                <Button 
                    variant={pageIndex === totalPages - 1 ? 'accent' : 'primary'}
                    size="lg"
                    onClick={onNext}
                    disabled={!canNext && pageIndex < totalPages}
                    className="min-w-[200px] shadow-3d-primary"
                >
                    {pageIndex === totalPages - 1 ? 'Finish Story 🏁' : (
                        isNextGacha ? 'Pick a Card 🎴' : 'Next Page ➔'
                    )}
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};
