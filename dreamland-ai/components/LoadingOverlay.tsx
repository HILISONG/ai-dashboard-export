
import React, { useState, useEffect, useRef } from 'react';

interface LoadingOverlayProps {
  isReady: boolean;
  onComplete: () => void;
  message?: string;
  currentTotalStars?: number;
  onStarCollected?: () => void;
  isNightMode?: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  speed: number;
  scale: number;
  rotation: number;
}

interface Burst {
    id: number;
    x: number; // Percent
    y: number; // Percent
    createdAt: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
    isReady, 
    onComplete, 
    message, 
    currentTotalStars = 0,
    onStarCollected,
    isNightMode = true
}) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [energy, setEnergy] = useState(0);
  const [showBigStar, setShowBigStar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const starIdCounter = useRef(0);
  const burstIdCounter = useRef(0);

  // Updated icon URL
  const LOADING_ICON_URL = "https://i.postimg.cc/QN27VSss/Gemini-Generated-Image-lrho2jlrho2jlrho.png";

  // Game Loop
  useEffect(() => {
    let lastTime = performance.now();
    let spawnTimer = 0;

    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      // Spawn Stars (Slowed spawn rate from 600ms to 1200ms for 50% reduction)
      spawnTimer += deltaTime;
      if (!isReady && spawnTimer > 1200) { 
        spawnTimer = 0;
        const speedVar = Math.random(); 
        // Random speed: fast (20%), slow (20%), medium (60%)
        // Reduced max speed from 0.12 to 0.08
        let speed = 0.05;
        if (speedVar > 0.8) speed = 0.08; // fast (was 0.12)
        else if (speedVar < 0.2) speed = 0.02; // slow
        else speed = 0.05; // medium

        const newStar: Star = {
          id: starIdCounter.current++,
          x: Math.random() * 90 + 5, // 5% to 95% width
          y: -15,
          speed: speed, 
          scale: Math.random() * 0.8 + 0.8, // 0.8 to 1.6 scale
          rotation: Math.random() * 360
        };
        setStars(prev => [...prev, newStar]);
      }

      // Move Stars (Removed rotation update)
      setStars(prev => 
        prev
          .map(star => ({ 
              ...star, 
              y: star.y + star.speed * (deltaTime / 2),
              // Rotation remains static based on initial random value
          }))
          .filter(star => star.y < 110) // Remove if off screen
      );
      
      // Cleanup old bursts
      setBursts(prev => prev.filter(b => time - b.createdAt < 1000));

      // Auto-fill energy logic
      setEnergy(prev => {
          if (!isReady) {
              // Very slow auto-fill, cap at 85 if not ready
              return Math.min(prev + (deltaTime * 0.005), 85);
          } else {
              // If ready, fill faster (gradually) until 100
              if (prev < 100) {
                  return Math.min(prev + (deltaTime * 0.15), 100);
              }
              return 100;
          }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isReady]);

  // Trigger completion logic when energy hits 100
  useEffect(() => {
      if (energy >= 100 && isReady && !showBigStar) {
           // Wait a brief moment then trigger finish state
           setTimeout(() => setShowBigStar(true), 500);
      }
  }, [energy, isReady, showBigStar]);

  const collectStar = (id: number, x: number, y: number) => {
    setStars(prev => prev.filter(s => s.id !== id));
    
    // Add burst
    setBursts(prev => [...prev, {
        id: burstIdCounter.current++,
        x,
        y,
        createdAt: performance.now()
    }]);

    // Provide tactile feedback
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'); 
    audio.volume = 0.2;
    audio.play().catch(() => {});
    
    if (onStarCollected) onStarCollected();

    // Boost energy slightly - "Helping" the load
    if (!isReady) {
        setEnergy(prev => Math.min(prev + 8, 95));
    }
  };

  const collectBigStar = () => {
      // Play success sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); 
      audio.volume = 0.3;
      audio.play().catch(() => {});
      
      onComplete();
  };

  // Background style based on theme
  const bgStyle = isNightMode 
    ? { backgroundColor: '#3a548c' }
    : { background: 'linear-gradient(135deg, #FFF8E7 0%, #E0F2FE 100%)' };

  const textColor = isNightMode ? 'text-white' : 'text-slate-800';
  const subTextColor = isNightMode ? 'text-blue-200' : 'text-slate-500';

  return (
    <div 
        ref={containerRef}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none transition-colors duration-700"
        style={bgStyle}
    >
      {/* Total Stars Counter */}
      <div className="absolute top-8 right-8 z-30 flex items-center gap-3 animate-fade-in-up">
          <div className="text-4xl filter drop-shadow-lg">🌟</div>
          <div className={`font-bold text-3xl font-['Fredoka'] ${isNightMode ? 'text-white' : 'text-orange-500'}`}>{currentTotalStars}</div>
      </div>

      {/* Central Content (Loading Indicator -> Finish Button) */}
      <div 
          className={`absolute top-1/3 flex flex-col items-center z-50 transition-all duration-700 ease-out ${showBigStar ? 'cursor-pointer scale-125' : 'pointer-events-none'}`}
          onClick={showBigStar ? collectBigStar : undefined}
      >
            <div className={`relative w-32 h-32 mb-6 flex items-center justify-center transition-all duration-700 ${showBigStar ? 'drop-shadow-[0_0_35px_rgba(253,224,71,0.6)]' : ''}`}>
                
                {/* Background Glow when finished */}
                {showBigStar && <div className="absolute inset-0 bg-yellow-400/40 blur-2xl rounded-full animate-pulse"></div>}

                {/* Static Ring base */}
                <div className="absolute inset-0 border-[6px] border-blue-300/30 rounded-full scale-110"></div>
                
                {/* Active Ring: Spins when loading, solid/glowing when done */}
                <div className={`absolute inset-0 border-[6px] border-yellow-400 rounded-full transition-all duration-700 ${showBigStar ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] rotate-0' : 'border-t-transparent animate-spin'}`}></div>
                
                {/* Icon Image */}
                <div className="absolute inset-0 flex items-center justify-center p-2">
                    <img 
                        src={LOADING_ICON_URL} 
                        alt="Loading..." 
                        className="w-full h-full object-contain"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}
                    />
                </div>
            </div>

            {/* Status Text */}
            {showBigStar ? (
                <div className="text-white font-bold text-lg md:text-xl mt-2 animate-pulse bg-blue-800/80 px-6 py-2 rounded-full border border-blue-500 shadow-xl backdrop-blur-sm whitespace-nowrap">
                  TAP TO CONTINUE!
                </div>
            ) : (
                <>
                    <h2 className={`text-2xl font-bold font-['Fredoka'] animate-pulse mb-2 ${textColor}`}>
                        {message || "Dreaming..."}
                    </h2>
                    <p className={`text-sm ${subTextColor}`}>Tap falling stars to help!</p>
                </>
            )}
      </div>

      {/* Falling Small Stars */}
      {stars.map(star => (
        <div
            key={star.id}
            className="absolute text-yellow-300 cursor-pointer transition-transform hover:scale-125 active:scale-150 active:text-white z-20 md:text-[3rem]" 
            style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                fontSize: `${2 * star.scale}rem`,
                transform: `rotate(${star.rotation}deg)`,
                filter: 'drop-shadow(0 0 10px rgba(255, 200, 0, 0.5))'
            }}
            onMouseDown={(e) => { e.stopPropagation(); collectStar(star.id, star.x, star.y); }}
            onTouchStart={(e) => { e.stopPropagation(); collectStar(star.id, star.x, star.y); }}
        >
            ★
        </div>
      ))}

      {/* Burst Animations */}
      {bursts.map(burst => (
          <div 
            key={burst.id}
            className="absolute pointer-events-none z-30 animate-ping"
            style={{
                left: `${burst.x}%`,
                top: `${burst.y}%`,
            }}
          >
              <div className="text-4xl">✨</div>
              <div className="absolute top-0 left-0 text-yellow-200 font-bold text-xl -translate-y-full">+1</div>
          </div>
      ))}

      {/* Energy Bar Container */}
      <div className="absolute bottom-12 w-full max-w-lg px-8 z-10">
          <div className={`flex justify-between font-bold mb-2 uppercase tracking-widest text-sm ${isNightMode ? 'text-white' : 'text-slate-600'}`}>
              <span>Creation Energy</span>
              <span>{Math.floor(energy)}%</span>
          </div>
          <div className={`h-8 rounded-full overflow-hidden border-2 backdrop-blur-sm shadow-xl ${isNightMode ? 'bg-slate-800/40 border-white/20' : 'bg-white/50 border-white/60'}`}>
              <div 
                className={`h-full flex items-center justify-end px-3 ${energy >= 100 ? 'bg-gradient-to-r from-yellow-400 to-amber-200 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'bg-gradient-to-r from-blue-400 to-cyan-300'}`}
                style={{ width: `${energy}%` }}
              >
                  {/* Removed transition class to force exact sync with energy number */}
                  {energy >= 100 && <span className="text-yellow-900 font-bold text-sm">READY!</span>}
              </div>
          </div>
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent -z-10"></div>
    </div>
  );
};
