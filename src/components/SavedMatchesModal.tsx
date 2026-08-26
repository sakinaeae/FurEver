import React from 'react';
import { CustomIcon } from './CustomIcon';
import { Pet } from '../types';
import { PawIcon } from './PawDecorations';

interface SavedMatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  likedPets: Pet[];
  onRemoveMatch: (petId: string) => void;
  onSelectPet: (pet: Pet) => void;
  onApplyPet: (pet: Pet) => void;
  onStartSwiping: () => void;
}

export const SavedMatchesModal: React.FC<SavedMatchesModalProps> = ({
  isOpen,
  onClose,
  likedPets,
  onRemoveMatch,
  onSelectPet,
  onApplyPet,
  onStartSwiping,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        id="saved-matches-modal-card"
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-[8px_8px_0px_#0F5C94] border-3 border-[#0F5C94] my-8 animate-scaleUp max-h-[85vh] flex flex-col"
      >
        {/* Header */}
          <div className="bg-[#FAF5EB] p-5 sm:p-7 border-b-3 border-[#0F5C94] flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#F6D97B] text-[#0F5C94] border border-[#0F5C94] text-xs font-black uppercase tracking-wider mb-1">
              <CustomIcon name="heart-filled" className="w-3.5 h-3.5" />
              <span>Saved Companions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-titan text-[#0F5C94]">
              Your Liked Matches ({likedPets.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#0F5C94]/80 font-medium">
              Pets you swiped right on or saved to your favorites.
            </p>
          </div>

          <button
            id="saved-matches-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-[#FB4504] hover:text-white text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all cursor-pointer"
            title="Close"
          >
            <CustomIcon name="cross" className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {likedPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {likedPets.map((pet) => (
                <div
                  key={pet.id}
                  id={`saved-match-item-${pet.id}`}
                  className="group bg-[#FAF5EB] rounded-2xl p-3.5 border-2 border-[#0F5C94]/30 hover:border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-xl object-cover object-center border-2 border-[#0F5C94] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-titan text-[#0F5C94] truncate">
                          {pet.name}
                        </h4>
                        <button
                          onClick={() => onRemoveMatch(pet.id)}
                          className="p-1 text-[#0F5C94]/40 hover:text-[#FB4504] transition-colors cursor-pointer"
                          title="Remove from matches"
                        >
                          <CustomIcon name="cross" className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-[#9A5D16] truncate">
                        {pet.breed}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-[#0F5C94]/70 mt-1 font-bold">
                        <CustomIcon name="location" className="w-3 h-3" />
                        <span>{pet.location.split(',')[0]}</span>
                        <span>·</span>
                        <span>{pet.age}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2.5 border-t border-[#0F5C94]/15 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPet(pet);
                      }}
                      className="text-xs font-black text-[#0F5C94] hover:underline cursor-pointer"
                    >
                      View Bio
                    </button>

                    <button
                      id={`saved-match-apply-${pet.id}`}
                      onClick={() => {
                        onClose();
                        onApplyPet(pet);
                      }}
                      disabled={pet.status !== 'AVAILABLE'}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] disabled:bg-stone-300 disabled:border-stone-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      <span>Apply</span>
                      <CustomIcon name="right-arrow" className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F6D97B] border-2 border-[#0F5C94] text-[#0F5C94] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#0F5C94]">
                <CustomIcon name="heart-filled" className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-titan text-[#0F5C94]">
                No saved matches yet
              </h3>
              <p className="text-xs sm:text-sm text-[#0F5C94]/80 max-w-sm mx-auto font-medium">
                Try the interactive Swipe to Match deck or click the heart icon on any pet card to save your favorites here.
              </p>
              <button
                id="saved-start-swipe-btn"
                onClick={() => {
                  onClose();
                  onStartSwiping();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <CustomIcon name="sparkle" className="w-3.5 h-3.5" />
                <span>Start Swiping</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAF5EB] px-6 py-3.5 border-t-3 border-[#0F5C94] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[2px_2px_0px_#FB4504] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
