import React, { useState, useEffect } from 'react';
import { X, Heart, MapPin, CheckCircle, AlertCircle, ShieldCheck, Activity, Share2, Sparkles, UserCheck, Calendar } from 'lucide-react';
import { Pet } from '../types';
import { PawIcon } from './PawDecorations';

interface PetProfileModalProps {
  pet: Pet | null;
  isOpen: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (petId: string, e: React.MouseEvent) => void;
  onApply: (pet: Pet) => void;
}

export const PetProfileModal: React.FC<PetProfileModalProps> = ({
  pet,
  isOpen,
  isFavorite,
  onClose,
  onToggleFavorite,
  onApply,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !pet) return null;

  const isAvailable = pet.status === 'AVAILABLE';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div 
        id={`pet-profile-modal-${pet.id}`}
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-[8px_8px_0px_#0F5C94] border-3 border-[#0F5C94] my-8 animate-scaleUp"
      >
        {/* Top Floating Close and Share Buttons */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white hover:bg-[#F6D97B] text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all cursor-pointer"
            title="Share pet profile"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            id="pet-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-[#FB4504] hover:text-white text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all cursor-pointer"
            title="Close profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Pet Visuals & Quick Highlights */}
          <div className="md:col-span-5 bg-[#FAF5EB] p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r-3 border-[#0F5C94]">
            <div>
              {/* Primary Single Image */}
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] bg-[#FAF5EB]">
                <img
                  src={pet.image}
                  alt={pet.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {/* Favorite Button on Image */}
                <button
                  onClick={(e) => onToggleFavorite(pet.id, e)}
                  className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-white text-[#FB4504] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] hover:bg-[#F6D97B] transition-all cursor-pointer"
                  title="Save to favorites"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? 'fill-[#FB4504] text-[#FB4504]' : 'text-[#9A5D16]'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="mt-5 pt-3 border-t-2 border-[#0F5C94]/15 grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-white p-2.5 rounded-xl border-2 border-[#0F5C94]/30">
                <span className="text-[#9A5D16] block font-bold text-[10px] uppercase">Location</span>
                <span className="text-[#0F5C94] font-black flex items-center gap-1 mt-0.5 text-xs">
                  <MapPin className="w-3 h-3 text-[#FB4504]" />
                  {pet.location.split(',')[0]}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border-2 border-[#0F5C94]/30">
                <span className="text-[#9A5D16] block font-bold text-[10px] uppercase">Shelter Care</span>
                <span className="text-[#0F5C94] font-black block mt-0.5 truncate text-xs">
                  {pet.shelterName || 'Furever Sanctuary'}
                </span>
              </div>
            </div>

            {copiedLink && (
              <p className="text-center text-xs font-extrabold text-[#0F942D] mt-2">
                ✓ Link copied to clipboard!
              </p>
            )}
          </div>

          {/* Right Column: Detailed Profile Narrative & Action */}
          <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              
              {/* Pet Title & Core Specs */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#F6D97B] border border-[#0F5C94] text-[#0F5C94] uppercase">
                    {pet.animalType}
                  </span>
                  <span className="text-[11px] font-bold text-[#9A5D16]">
                    ID: #{pet.id.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-titan text-[#0F5C94] leading-tight">
                  {pet.name}
                </h2>

                <p className="text-xs sm:text-sm font-bold text-[#9A5D16] mt-0.5">
                  {pet.breed} · {pet.age} · {pet.gender}
                </p>
              </div>

              {/* Personality Badges */}
              <div>
                <h4 className="text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1.5">
                  Personality & Traits
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {pet.personality.map((trait, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-[#FAF5EB] text-[#0F5C94] border border-[#0F5C94]/30"
                    >
                      <Sparkles className="w-3 h-3 text-[#FB4504]" />
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* About Pet Narrative */}
              <div>
                <h4 className="text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1.5">
                  About {pet.name}
                </h4>
                <p className="text-xs sm:text-sm text-[#0F5C94]/85 leading-relaxed bg-[#FAF5EB] p-3.5 rounded-xl border-2 border-[#0F5C94]/20 font-medium">
                  "{pet.description}"
                </p>
              </div>

              {/* Good With Compatibility Chips */}
              <div>
                <h4 className="text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1.5">
                  Good With
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {pet.goodWith.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black bg-[#EBF7EE] text-[#0F942D] border border-[#0F942D]/40"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-[#FAF5EB] p-3.5 rounded-xl border-2 border-[#0F5C94]/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#0F5C94] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0F942D]" />
                    Medical & Health Verification
                  </h4>
                  <span className="text-[10px] font-black text-[#0F942D] bg-white border border-[#0F942D]/30 px-2 py-0.5 rounded-md">
                    Verified by Veterinarian
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className={`p-2 rounded-lg border ${pet.medicalInfo.vaccinated ? 'bg-white text-[#0F942D] border-[#0F942D]/40' : 'bg-stone-50 text-stone-400'}`}>
                    <span className="font-bold block text-[10px]">Vaccinated</span>
                    <span className="font-black text-xs">{pet.medicalInfo.vaccinated ? '✓ Yes' : 'No'}</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${pet.medicalInfo.spayedNeutered ? 'bg-white text-[#0F942D] border-[#0F942D]/40' : 'bg-stone-50 text-stone-400'}`}>
                    <span className="font-bold block text-[10px]">Neutered/Spayed</span>
                    <span className="font-black text-xs">{pet.medicalInfo.spayedNeutered ? '✓ Yes' : 'Pending'}</span>
                  </div>
                  <div className={`p-2 rounded-lg border ${pet.medicalInfo.microchipped ? 'bg-white text-[#0F942D] border-[#0F942D]/40' : 'bg-stone-50 text-stone-400'}`}>
                    <span className="font-bold block text-[10px]">Microchipped</span>
                    <span className="font-black text-xs">{pet.medicalInfo.microchipped ? '✓ Yes' : 'No'}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#0F5C94]/70 italic">
                  Note: {pet.medicalInfo.healthNotes}
                </p>
              </div>

            </div>

            {/* Bottom Adoption Action CTA */}
            <div className="pt-3 border-t-2 border-[#0F5C94]/15 space-y-2">
              {isAvailable ? (
                <button
                  id="profile-apply-adopt-btn"
                  onClick={() => {
                    onClose();
                    onApply(pet);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-sm tracking-wider uppercase border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PawIcon className="w-4 h-4 fill-white" />
                  <span>APPLY TO ADOPT {pet.name.toUpperCase()}</span>
                </button>
              ) : (
                <div className="space-y-1">
                  <button
                    id="profile-unavailable-btn"
                    disabled
                    className="w-full py-3.5 rounded-xl bg-stone-200 text-stone-500 font-black text-sm tracking-wider uppercase border-2 border-stone-300 cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>CURRENTLY UNAVAILABLE</span>
                  </button>
                  <p className="text-center text-[11px] font-semibold text-stone-500">
                    This animal currently has a pending adoption or scheduled checkup.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
