
import React from 'react';
import { SavedStory } from '../types';
import { Button } from './Button';
import { generateStoryPDF } from '../services/pdfService';

interface LibraryProps {
  stories: SavedStory[];
  onSelectStory: (story: SavedStory) => void;
  onBack: () => void;
  onClear: () => void;
  isNightMode?: boolean;
}

export const Library: React.FC<LibraryProps> = ({ stories, onSelectStory, onBack, onClear, isNightMode = true }) => {
  
  const handleDownload = async (e: React.MouseEvent, story: SavedStory) => {
      e.stopPropagation(); // Prevent opening the story
      await generateStoryPDF(story);
  };

  return (
    <div className={`min-h-screen p-6 flex flex-col items-center relative ${isNightMode ? 'text-white' : 'text-slate-800'}`}>
        {/* Background handled by parent but added here for safety/consistency if rendered independently */}
        <div className={`fixed inset-0 -z-10 ${isNightMode ? 'bg-[#3a548c]' : 'bg-[#FFFBF0]'}`}></div>

      <div className="w-full max-w-6xl mt-16 md:mt-0">
        <div className="flex justify-between items-center mb-8">
          <Button variant="secondary" onClick={onBack}>
             ← Back to Home
          </Button>
          <div className="w-4 md:hidden"></div> {/* Spacer */}
        </div>

        <div className="text-center mb-10">
             <h1 className={`text-5xl md:text-6xl font-black font-display drop-shadow-md mb-2 ${isNightMode ? 'text-white' : 'text-slate-800'}`}>My Library</h1>
             <p className={`font-bold text-xl ${isNightMode ? 'text-blue-200' : 'text-slate-500'}`}>Your collected adventures</p>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border-4 border-white/50 shadow-card-float max-w-2xl mx-auto">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-slate-500">No stories yet!</h2>
            <p className="text-slate-500 mt-2 font-bold opacity-70">Start an adventure to fill your library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div 
                key={story.id} 
                className={`bg-white rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-4 cursor-pointer group ${story.isFinished === false ? 'border-orange-300' : 'border-white'}`}
                onClick={() => onSelectStory(story)}
              >
                {/* Cover Image Preview (Page 1 or 10) */}
                <div className="h-56 overflow-hidden relative bg-slate-200">
                  <img 
                    src={story.pages[story.pages.length - 1]?.imageUrl || story.pages[0]?.imageUrl} 
                    alt="Story Cover" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 flex gap-2">
                     {story.isFinished === false ? (
                        <div className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
                            In Progress
                        </div>
                     ) : (
                        <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1 text-white text-sm font-bold border border-white/20">
                            <span>🌟</span>
                            <span>{story.starsCollected || 0}</span>
                        </div>
                     )}
                  </div>

                  <div className="absolute bottom-4 left-4 text-white w-full pr-4">
                     <p className="text-xs opacity-75 font-black uppercase tracking-widest mb-1">{new Date(story.timestamp).toLocaleDateString()}</p>
                     <h3 className="font-black font-display text-2xl leading-none mb-1 text-white shadow-black drop-shadow-md">{story.hero.name}'s Journey</h3>
                     <p className="text-sm italic opacity-90">by {story.authorName || 'The Dreamer'}</p>
                  </div>
                </div>

                <div className="p-6 bg-white">
                  <div className="flex items-center gap-3 mb-4">
                     <img src={story.hero.avatarUrl} className="w-10 h-10 rounded-full border-2 border-slate-100 bg-slate-50" alt="avatar" />
                     <div className="flex-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hero Power</span>
                        <span className="text-sm font-bold text-slate-700">{story.hero.power}</span>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant={story.isFinished === false ? 'accent' : 'primary'} size="md" className="w-full text-lg">
                        {story.isFinished === false ? 'Continue Adventure ⚔️' : 'Read Again 📖'}
                    </Button>
                    
                    {story.isFinished !== false && (
                         <button 
                            onClick={(e) => handleDownload(e, story)}
                            className="w-full py-3 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-slate-50 hover:border-orange-200 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
                         >
                             <span>📥</span>
                             <span>Print Book (PDF)</span>
                         </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {stories.length > 0 && (
            <div className="mt-12 text-center pb-8">
                <button onClick={onClear} className={`text-sm font-bold underline opacity-60 hover:opacity-100 transition-opacity ${isNightMode ? 'text-white' : 'text-slate-600'}`}>Clear History</button>
            </div>
        )}
      </div>
    </div>
  );
};
