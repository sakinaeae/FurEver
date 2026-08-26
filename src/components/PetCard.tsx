import React from 'react';
import { CustomIcon } from './CustomIcon';
import { Pet } from '../types';

interface PetCardProps {
  pet: Pet;
  isFavorite: boolean;
  onToggleFavorite: (petId: string, e: React.MouseEvent) => void;
  onSelectPet: (pet: Pet) => void;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  isFavorite,
  onToggleFavorite,
  onSelectPet,
}) => {
  const isAvailable = pet.status === 'AVAILABLE';

  return (
    <div
      id={`pet-card-${pet.id}`}
      onClick={() => onSelectPet(pet)}
      className="group relative bg-white rounded-2xl overflow-hidden border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:shadow-[6px_6px_0px_#FB4504] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-[#FAF5EB] border-b-2 border-[#0F5C94]">
        <img
          src={pet.image}
          alt={pet.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Subtle bottom gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Top Action Button */}
        <div className="absolute top-3 right-3 pointer-events-none">
          {/* Favorite Toggle Button */}
          <button
            id={`fav-btn-${pet.id}`}
            onClick={(e) => onToggleFavorite(pet.id, e)}
            className="p-2 rounded-xl bg-white hover:bg-[#F6D97B] text-[#FB4504] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all hover:scale-105 active:scale-95 pointer-events-auto cursor-pointer"
            title={isFavorite ? 'Remove from saved' : 'Save to favorites'}
            aria-label={isFavorite ? 'Remove from saved' : 'Save to favorites'}
          >
            <CustomIcon
              name={isFavorite ? 'heart-filled' : 'heart-unfilled'}
              className="w-4 h-4"
            />
          </button>
        </div>

        {/* Quick bottom stats on top of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold pointer-events-none">
          <span className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-lg border border-white/20">
            <CustomIcon name="location" white className="w-3 h-3" />
            {pet.location.split(',')[0]}
          </span>
          <span className="bg-[#0F5C94] px-2.5 py-1 rounded-lg text-[#F6D97B] font-black uppercase text-[10px] tracking-wider border border-white/20">
            {pet.gender} · {pet.age}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Title & Breed */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-2xl font-titan text-[#0F5C94] tracking-normal group-hover:text-[#FB4504] transition-colors leading-tight">
                {pet.name}
              </h3>
              <p className="text-xs font-bold text-[#9A5D16] uppercase tracking-wider mt-0.5">
                {pet.breed}
              </p>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#F6D97B] border border-[#0F5C94] text-[#0F5C94] uppercase tracking-wider">
              {pet.size}
            </span>
          </div>

          {/* Personality Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {pet.personality.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-[#FAF5EB] text-[#0F5C94] border border-[#0F5C94]/30 uppercase tracking-wider"
              >
                <CustomIcon name="sparkle" className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>

          {/* Short narrative snippet */}
          <p className="text-xs text-[#0F5C94]/80 line-clamp-2 mt-2.5 leading-relaxed font-medium">
            "{pet.description}"
          </p>
        </div>

        {/* Action Bottom Bar */}
        <div className="mt-4 pt-3 border-t-2 border-[#0F5C94]/15 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] font-black text-[#0F942D] uppercase tracking-wider">
            <CustomIcon name="health-verified" className="w-3.5 h-3.5" />
            <span>Health Verified</span>
          </div>

          <button
            id={`meet-btn-${pet.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPet(pet);
            }}
            className="inline-flex items-center gap-1 text-xs font-black text-[#0F5C94] group-hover:text-[#FB4504] uppercase tracking-wider transition-all"
          >
            <span>Meet {pet.name}</span>
            <CustomIcon name="right-arrow" className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
