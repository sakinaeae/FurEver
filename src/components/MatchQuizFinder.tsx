import React, { useState, useMemo } from 'react';
import { CustomIcon } from './CustomIcon';
import { Pet, AnimalType, AgeCategory, PetSize } from '../types';
import { PetCard } from './PetCard';
import { PawIcon } from './PawDecorations';
import { AnimalMarqueeTape } from './AnimalMarqueeTape';

interface MatchQuizFinderProps {
  pets: Pet[];
  favoriteIds: string[];
  onToggleFavorite: (petId: string, e: React.MouseEvent) => void;
  onSelectPet: (pet: Pet) => void;
}

export const MatchQuizFinder: React.FC<MatchQuizFinderProps> = ({
  pets,
  favoriteIds,
  onToggleFavorite,
  onSelectPet,
}) => {
  const [selectedType, setSelectedType] = useState<AnimalType | 'All'>('All');
  const [selectedAge, setSelectedAge] = useState<AgeCategory | 'All'>('All');
  const [selectedSize, setSelectedSize] = useState<PetSize | 'All'>('All');
  const [breedQuery, setBreedQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const animalTypes: { type: AnimalType | 'All'; label: string; iconKey: string }[] = [
    { type: 'All', label: 'Any Pet', iconKey: 'any-pet' },
    { type: 'Dog', label: 'Dogs', iconKey: 'dog' },
    { type: 'Cat', label: 'Cats', iconKey: 'cat' },
    { type: 'Rabbit', label: 'Rabbits', iconKey: 'rabbit' },
    { type: 'Bird', label: 'Birds', iconKey: 'bird' },
    { type: 'Other', label: 'Small Animals', iconKey: 'small-animals' },
  ];

  const ageOptions: { value: AgeCategory | 'All'; label: string; desc: string }[] = [
    { value: 'All', label: 'Any Age', desc: 'Young to Senior' },
    { value: 'Young', label: 'Young / Puppy / Kitten', desc: 'Under 2 years' },
    { value: 'Adult', label: 'Adult Companion', desc: '2 to 6 years' },
    { value: 'Senior', label: 'Gentle Senior', desc: '7+ years' },
  ];

  const sizeOptions: { value: PetSize | 'All'; label: string; desc: string }[] = [
    { value: 'All', label: 'Any Size', desc: 'All sizes welcome' },
    { value: 'Small', label: 'Small', desc: 'Under 10 kg · Apartment friendly' },
    { value: 'Medium', label: 'Medium', desc: '10 - 25 kg · Versatile' },
    { value: 'Large', label: 'Large', desc: '25+ kg · Energetic' },
  ];

  // Real filtering calculation
  const matchedPets = useMemo(() => {
    return pets.filter((pet) => {
      if (selectedType !== 'All' && pet.animalType !== selectedType) {
        return false;
      }
      if (selectedAge !== 'All' && pet.ageCategory !== selectedAge) {
        return false;
      }
      if (selectedSize !== 'All' && pet.size !== selectedSize) {
        return false;
      }
      if (breedQuery.trim() !== '') {
        if (!pet.breed.toLowerCase().includes(breedQuery.toLowerCase())) {
          return false;
        }
      }
      if (locationQuery.trim() !== '') {
        if (!pet.location.toLowerCase().includes(locationQuery.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [pets, selectedType, selectedAge, selectedSize, breedQuery, locationQuery]);

  const handleClearFilters = () => {
    setSelectedType('All');
    setSelectedAge('All');
    setSelectedSize('All');
    setBreedQuery('');
    setLocationQuery('');
    setHasSearched(false);
  };

  const handleFindMyMatchClick = () => {
    setHasSearched(true);
    const resultsElement = document.getElementById('match-results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-10 lg:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-[#F6D97B] text-[#0F5C94] text-xs font-black uppercase tracking-wider border-2 border-[#0F5C94]">
            <CustomIcon name="sparkle" className="w-3.5 h-3.5 text-[#FB4504]" />
            <span>Personalized Matchmaking</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-titan text-[#0F5C94] tracking-normal">
            Tell us who you're looking for.
          </h1>

          <p className="text-xs sm:text-sm text-[#0F5C94]/85 font-medium max-w-xl mx-auto">
            Customize your preferences to instantly find pets aligned with your lifestyle, space, and family.
          </p>
        </div>

        {/* Visual Interactive Quiz Filter Card */}
        <div className="bg-[#FAF5EB] rounded-3xl p-6 sm:p-10 border-3 border-[#0F5C94] shadow-[8px_8px_0px_#0F5C94] max-w-5xl mx-auto space-y-8">
          
          {/* STEP 1: Animal Type Visual Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs sm:text-sm font-black text-[#0F5C94] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#0F5C94] text-white flex items-center justify-center text-xs font-titan">1</span>
                ANIMAL TYPE
              </label>
              <span className="text-xs font-bold text-[#9A5D16]">Select one</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {animalTypes.map((item) => {
                const isSelected = selectedType === item.type;
                return (
                  <button
                    key={item.type}
                    id={`quiz-type-${item.type.toLowerCase()}`}
                    type="button"
                    onClick={() => setSelectedType(item.type)}
                    className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 ${
                      isSelected
                        ? 'bg-[#0F5C94] border-[#0F5C94] text-white shadow-[3px_3px_0px_#FB4504]'
                        : 'bg-white border-[#0F5C94]/30 text-[#0F5C94] hover:bg-[#F6D97B]/30 shadow-[2px_2px_0px_#0F5C94]'
                    }`}
                  >
                    <CustomIcon name={item.iconKey} white={isSelected} className="w-9 h-9 sm:w-10 sm:h-10 object-contain my-0.5" />
                    <span className="text-xs font-black tracking-wide">{item.label}</span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#F6D97B] text-[#0F5C94] flex items-center justify-center text-[10px] font-black mt-0.5">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Age Category Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs sm:text-sm font-black text-[#0F5C94] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#9A5D16] text-white flex items-center justify-center text-xs font-titan">2</span>
                AGE PREFERENCE
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ageOptions.map((opt) => {
                const isSelected = selectedAge === opt.value;
                return (
                  <button
                    key={opt.value}
                    id={`quiz-age-${opt.value.toLowerCase()}`}
                    type="button"
                    onClick={() => setSelectedAge(opt.value)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#9A5D16] border-[#0F5C94] text-white shadow-[3px_3px_0px_#0F5C94]'
                        : 'bg-white border-[#0F5C94]/30 text-[#0F5C94] hover:bg-[#F6D97B]/30 shadow-[2px_2px_0px_#0F5C94]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black">{opt.label}</span>
                      {isSelected && <CustomIcon name="tick" className="w-4 h-4 text-[#F6D97B]" />}
                    </div>
                    <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#0F5C94]/70'}`}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs sm:text-sm font-black text-[#0F5C94] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#0F942D] text-white flex items-center justify-center text-xs font-titan">3</span>
                PET SIZE
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sizeOptions.map((opt) => {
                const isSelected = selectedSize === opt.value;
                return (
                  <button
                    key={opt.value}
                    id={`quiz-size-${opt.value.toLowerCase()}`}
                    type="button"
                    onClick={() => setSelectedSize(opt.value)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0F942D] border-[#0F5C94] text-white shadow-[3px_3px_0px_#0F5C94]'
                        : 'bg-white border-[#0F5C94]/30 text-[#0F5C94] hover:bg-[#F6D97B]/30 shadow-[2px_2px_0px_#0F5C94]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black">{opt.label}</span>
                      {isSelected && <CustomIcon name="tick" className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#0F5C94]/70'}`}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Breed & Location Searchable inputs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs sm:text-sm font-black text-[#0F5C94] uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#FB4504] text-white flex items-center justify-center text-xs font-titan">4</span>
                BREED & LOCALITY (OPTIONAL)
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Breed Selector / Search */}
              <div className="relative">
                <CustomIcon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A5D16]" />
                <input
                  id="quiz-breed-input"
                  type="text"
                  value={breedQuery}
                  onChange={(e) => setBreedQuery(e.target.value)}
                  placeholder="Breed preference (e.g. Retriever, Indie, Lop, Beagle)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94]"
                />
              </div>

              {/* Location Selector / Search */}
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-[#FB4504] border border-[#0F5C94] flex items-center justify-center shadow-xs pointer-events-none">
                  <CustomIcon name="location" white className="w-3.5 h-3.5" />
                </div>
                <input
                  id="quiz-location-input"
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Bangalore Locality (e.g. Indiranagar, Koramangala, Whitefield)..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Row with Live Counter and Match Button */}
          <div className="pt-4 border-t-2 border-[#0F5C94]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-extrabold text-[#0F5C94]">
                {matchedPets.length > 0 ? (
                  <>We found <strong className="text-[#FB4504] text-base">{matchedPets.length}</strong> pets that match these criteria</>
                ) : (
                  <>No pets matching these specific filters</>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="quiz-clear-filters-btn"
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F6D97B] text-[#0F5C94] border-2 border-[#0F5C94] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_#0F5C94] cursor-pointer"
              >
                <CustomIcon name="reset" className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>

              <button
                id="quiz-find-my-match-btn"
                type="button"
                onClick={handleFindMyMatchClick}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>FIND MY MATCH</span>
                <CustomIcon name="right-arrow" className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Moving Animal Icons Marquee Tape */}
        <AnimalMarqueeTape className="my-8 sm:my-10" />

        {/* Live Match Results Section */}
        <div id="match-results-section" className="mt-8 sm:mt-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-4xl font-titan text-[#0F5C94]">
              {matchedPets.length > 0
                ? `We found ${matchedPets.length} pets that could be your match.`
                : 'No perfect match yet.'}
            </h2>
            {matchedPets.length === 0 && (
              <p className="text-[#0F5C94]/80 font-medium mt-1 text-xs sm:text-sm">
                Try changing your filters or selecting "Any Pet" to discover all available animals.
              </p>
            )}
          </div>

          {matchedPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {matchedPets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  isFavorite={favoriteIds.includes(pet.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelectPet={onSelectPet}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-8 text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F6D97B] border-2 border-[#0F5C94] flex items-center justify-center mx-auto text-[#0F5C94]">
                <PawIcon className="w-7 h-7 fill-[#FB4504]" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#0F5C94]">
                No perfect match yet. Try changing your filters.
              </p>
              <button
                id="quiz-no-results-clear-btn"
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-[#0F5C94] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#FB4504] cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
