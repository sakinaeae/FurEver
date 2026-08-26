import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { CustomIcon } from './CustomIcon';
import { Pet } from '../types';

interface SwipeCardDeckProps {
  pets: Pet[];
  likedPetIds: string[];
  onSwipeRight: (pet: Pet) => void;
  onSwipeLeft: (pet: Pet) => void;
  onOpenMatches: () => void;
  onSelectPet: (pet: Pet) => void;
  onApplyPet: (pet: Pet) => void;
}

export const SwipeCardDeck: React.FC<SwipeCardDeckProps> = ({
  pets,
  likedPetIds,
  onSwipeRight,
  onSwipeLeft,
  onOpenMatches,
  onSelectPet,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<{ pet: Pet; action: 'like' | 'pass' }[]>([]);
  const [, setDragDirection] = useState<'left' | 'right' | null>(null);

  // Motion values for the top card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const opacityPass = useTransform(x, [-180, -30], [1, 0]);
  const opacityLike = useTransform(x, [30, 180], [0, 1]);
  const scaleUnder = useTransform(x, [-200, 0, 200], [1, 0.95, 1]);

  const currentPet = pets[currentIndex];
  const nextPet = pets[currentIndex + 1];
  const petsLeft = pets.length - currentIndex;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentPet) return;

    if (direction === 'right') {
      onSwipeRight(currentPet);
      setHistory((prev) => [...prev, { pet: currentPet, action: 'like' }]);
    } else {
      onSwipeLeft(currentPet);
      setHistory((prev) => [...prev, { pet: currentPet, action: 'pass' }]);
    }

    setCurrentIndex((prev) => prev + 1);
    x.set(0);
    setDragDirection(null);
  };

  const handleUndo = () => {
    if (currentIndex > 0 && history.length > 0) {
      setHistory((prev) => prev.slice(0, -1));
      setCurrentIndex((prev) => prev - 1);
      x.set(0);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setHistory([]);
    x.set(0);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentPet]);

  return (
    <div className="py-3 sm:py-5 min-h-[calc(100vh-4.5rem)] flex flex-col justify-center">
      <div className="max-w-3xl mx-auto px-4 w-full">
        
        {/* Page Header */}
        <div className="text-center space-y-1.5 mb-3 sm:mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg bg-[#F6D97B] text-[#0F5C94] text-[11px] font-black uppercase tracking-wider border-2 border-[#0F5C94]">
            <CustomIcon name="sparkle" className="w-3 h-3 text-[#FB4504]" />
            <span>Interactive Match Deck</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-titan text-[#0F5C94] tracking-normal">
            Could this be <span className="text-[#FB4504]">your one?</span>
          </h1>

          <div className="flex items-center justify-center gap-3 pt-0.5">
            <span className="font-black text-[#0F5C94]/85 uppercase tracking-wider text-[11px]">
              {petsLeft > 0 ? `${petsLeft} pets left to discover` : 'Deck completed!'}
            </span>

            {/* Top Bar Match Drawer Button */}
            <button
              id="view-my-matches-top-btn"
              onClick={onOpenMatches}
              className="px-3 py-1 rounded-lg bg-[#0F5C94] hover:bg-[#0c4975] text-white flex items-center gap-1.5 border-2 border-[#0F5C94] shadow-[2px_2px_0px_#FB4504] transition-all hover:translate-x-0.5 hover:translate-y-0.5 uppercase tracking-wider text-[10px] font-black cursor-pointer"
            >
              <CustomIcon name="heart-filled" className="w-3 h-3 text-[#F6D97B]" />
              <span>Saved Matches ({likedPetIds.length})</span>
            </button>
          </div>
        </div>

        {/* Swipe Card Deck Area */}
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto h-[380px] sm:h-[400px] mb-3 select-none">
          {currentPet ? (
            <div className="relative w-full h-full">
              
              {/* Next Card Sitting Underneath */}
              {nextPet && (
                <motion.div
                  style={{ scale: scaleUnder }}
                  className="absolute inset-0 bg-[#FAF5EB] rounded-2xl border-3 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] p-3.5 overflow-hidden pointer-events-none opacity-60 flex flex-col"
                >
                  <div className="relative w-full h-[210px] sm:h-[225px] bg-[#FAF5EB] rounded-xl overflow-hidden mb-2 border-2 border-[#0F5C94]/30">
                    <img
                      src={nextPet.image}
                      alt={nextPet.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center filter blur-[0.5px]"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-titan text-[#0F5C94]">
                      {nextPet.name}
                    </h3>
                    <p className="text-[11px] font-bold text-[#9A5D16] uppercase tracking-wider">{nextPet.breed} • {nextPet.age}</p>
                  </div>
                </motion.div>
              )}

              {/* Active Top Draggable Card */}
              <motion.div
                id={`swipe-card-${currentPet.id}`}
                style={{ x, rotate }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.9}
                onDrag={(_, info) => {
                  if (info.offset.x > 30) setDragDirection('right');
                  else if (info.offset.x < -30) setDragDirection('left');
                  else setDragDirection(null);
                }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100 || info.velocity.x > 500) {
                    handleSwipe('right');
                  } else if (info.offset.x < -100 || info.velocity.x < -500) {
                    handleSwipe('left');
                  } else {
                    setDragDirection(null);
                  }
                }}
                className="absolute inset-0 bg-[#FAF5EB] rounded-2xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-3.5 flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing z-20"
              >
                {/* Pet Image */}
                <div className="relative h-[210px] sm:h-[225px] w-full bg-[#FAF5EB] rounded-xl overflow-hidden border-2 border-[#0F5C94]">
                  <img
                    src={currentPet.image}
                    alt={currentPet.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center pointer-events-none"
                  />

                  {/* LIKE Floating Indicator Overlay */}
                  <motion.div
                    style={{ opacity: opacityLike }}
                    className="absolute top-3 right-3 px-3.5 py-1 rounded-lg bg-[#0F942D] border-2 border-white text-white font-black text-xs tracking-wider uppercase shadow-md transform rotate-12 flex items-center gap-1 pointer-events-none"
                  >
                    <CustomIcon name="heart-filled" className="w-3.5 h-3.5" />
                    <span>LIKE</span>
                  </motion.div>

                  {/* PASS Floating Indicator Overlay */}
                  <motion.div
                    style={{ opacity: opacityPass }}
                    className="absolute top-3 left-3 px-3.5 py-1 rounded-lg bg-[#FB4504] border-2 border-white text-white font-black text-xs tracking-wider uppercase shadow-md transform -rotate-12 flex items-center gap-1 pointer-events-none"
                  >
                    <CustomIcon name="cross" className="w-3.5 h-3.5" />
                    <span>PASS</span>
                  </motion.div>
                </div>

                {/* Card Information Body */}
                <div className="flex-1 flex flex-col justify-between pt-2">
                  <div>
                    <div id="swipe-name" className="text-2xl font-titan text-[#0F5C94] leading-tight">
                      {currentPet.name}
                    </div>

                    <p id="swipe-meta" className="font-bold text-[11px] text-[#9A5D16] uppercase tracking-wider mt-0.5 mb-1.5">
                      {currentPet.breed} • {currentPet.age} • {currentPet.gender} • {currentPet.location.split(',')[0]}
                    </p>

                    <div className="flex flex-wrap gap-1" id="swipe-tags">
                      {currentPet.personality.slice(0, 3).map((trait, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-[#0F5C94] border border-[#0F5C94]/30 px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-wide"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View Full Profile link */}
                  <div className="pt-1.5 flex items-center justify-between border-t border-[#0F5C94]/15">
                    <button
                      id={`swipe-view-details-${currentPet.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPet(currentPet);
                      }}
                      className="text-[11px] font-black text-[#0F5C94] hover:text-[#FB4504] flex items-center gap-1 transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      <CustomIcon name="search" className="w-3.5 h-3.5" />
                      <span>Full Bio & Medical Info →</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Deck Finished State */
            <div className="w-full h-full bg-[#FAF5EB] rounded-2xl border-3 border-[#0F5C94] p-6 text-center flex flex-col items-center justify-center space-y-3 shadow-[6px_6px_0px_#0F5C94]">
              <div className="w-12 h-12 rounded-xl bg-[#F6D97B] border-2 border-[#0F5C94] text-[#0F942D] flex items-center justify-center mx-auto shadow-inner">
                <CustomIcon name="circle-tick" className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-titan text-[#0F5C94]">
                You've seen all pets!
              </h3>
              <p className="text-xs text-[#0F5C94]/85 max-w-xs font-medium">
                You swiped through the entire discovery deck. Check out your saved matches or restart the deck to browse again.
              </p>
              <div className="pt-1 flex flex-col gap-2 w-full max-w-xs">
                <button
                  id="deck-view-matches-btn"
                  onClick={onOpenMatches}
                  className="w-full py-2.5 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CustomIcon name="heart-filled" className="w-3.5 h-3.5" />
                  <span>View Saved Matches ({likedPetIds.length})</span>
                </button>
                <button
                  id="deck-reset-btn"
                  onClick={handleReset}
                  className="w-full py-2 rounded-xl bg-white hover:bg-[#F6D97B] text-[#0F5C94] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CustomIcon name="calendar" className="w-3.5 h-3.5" />
                  <span>Restart Deck</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Interaction Buttons Below Card */}
        {currentPet && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4 sm:gap-5">
              
              {/* PASS BUTTON */}
              <button
                id="swipe-btn-pass"
                onClick={() => handleSwipe('left')}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-[#0F5C94] text-[#9A5D16] flex items-center justify-center hover:bg-[#9A5D16] hover:text-white transition-all shadow-[3px_3px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                title="Swipe Left: Pass"
              >
                <CustomIcon name="cross" className="w-6 h-6" />
              </button>

              {/* UNDO BUTTON */}
              <button
                id="swipe-btn-undo"
                onClick={handleUndo}
                disabled={currentIndex === 0}
                className="p-2.5 rounded-xl bg-[#F6D97B] hover:bg-[#ffca42] text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Undo last swipe"
                aria-label="Undo last swipe"
              >
                <CustomIcon name="calendar" className="w-4 h-4" />
              </button>

              {/* LIKE BUTTON */}
              <button
                id="swipe-btn-like"
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#FB4504] border-3 border-[#0F5C94] text-white flex items-center justify-center hover:bg-[#e03a00] transition-all shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                title="Swipe Right: Like"
              >
                <CustomIcon name="heart-filled" className="w-8 h-8" />
              </button>

            </div>

            {/* Keyboard hint */}
            <p className="text-center text-[11px] font-bold text-[#0F5C94]/70 uppercase tracking-wider mt-2">
              Keyboard: <kbd className="px-1.5 py-0.5 bg-white rounded border border-[#0F5C94] text-[#0F5C94] font-black text-[10px]">←</kbd> Pass or <kbd className="px-1.5 py-0.5 bg-white rounded border border-[#0F5C94] text-[#0F5C94] font-black text-[10px]">→</kbd> Like
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
