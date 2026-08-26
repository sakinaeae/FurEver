import React, { useState, useMemo } from 'react';
import { CustomIcon } from './CustomIcon';
import { Pet, AnimalType, AgeCategory, PetSize, PetGender } from '../types';
import { PetCard } from './PetCard';
import { PawIcon } from './PawDecorations';

interface PetBrowseGridProps {
  pets: Pet[];
  favoriteIds: string[];
  onToggleFavorite: (petId: string, e: React.MouseEvent) => void;
  onSelectPet: (pet: Pet) => void;
  onOpenMatchFinder: () => void;
}

export const PetBrowseGrid: React.FC<PetBrowseGridProps> = ({
  pets,
  favoriteIds,
  onToggleFavorite,
  onSelectPet,
  onOpenMatchFinder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AnimalType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState<AgeCategory | 'All'>('All');
  const [selectedSize, setSelectedSize] = useState<PetSize | 'All'>('All');
  const [selectedGender, setSelectedGender] = useState<PetGender | 'All'>('All');
  const [selectedActivity, setSelectedActivity] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedTrait, setSelectedTrait] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'recent' | 'name' | 'age'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const categories: { type: AnimalType | 'All'; label: string; icon: string }[] = [
    { type: 'All', label: 'All Friends', icon: '🐾' },
    { type: 'Dog', label: 'Dogs', icon: '🐶' },
    { type: 'Cat', label: 'Cats', icon: '🐱' },
    { type: 'Rabbit', label: 'Rabbits', icon: '🐰' },
    { type: 'Bird', label: 'Birds', icon: '🦜' },
    { type: 'Other', label: 'Small Animals', icon: '🐹' },
  ];

  // Distinct locations available
  const availableLocations = useMemo(() => {
    const locs = Array.from(new Set(pets.map((p) => p.location.split(',')[0].trim())));
    return ['All', ...locs];
  }, [pets]);

  // Distinct traits
  const traitFilters = [
    { id: 'All', label: 'All Personalities' },
    { id: 'Children', label: 'Good with Kids' },
    { id: 'Dogs', label: 'Good with Dogs' },
    { id: 'Cats', label: 'Good with Cats' },
    { id: 'Apartment Living', label: 'Apartment Friendly' },
    { id: 'First-time Owners', label: 'First-Time Friendly' },
    { id: 'Playful', label: 'Playful & Active' },
    { id: 'Gentle', label: 'Gentle & Calm' },
    { id: 'Bonded Pair', label: 'Bonded Pairs' },
  ];

  // Filter and search logic
  const filteredPets = useMemo(() => {
    return pets
      .filter((pet) => {
        // Category match
        if (selectedCategory !== 'All' && pet.animalType !== selectedCategory) {
          return false;
        }
        // Age filter
        if (selectedAge !== 'All' && pet.ageCategory !== selectedAge) {
          return false;
        }
        // Size filter
        if (selectedSize !== 'All' && pet.size !== selectedSize) {
          return false;
        }
        // Gender filter
        if (selectedGender !== 'All' && pet.gender !== selectedGender) {
          return false;
        }
        // Activity level filter
        if (selectedActivity !== 'All' && pet.activityLevel !== selectedActivity) {
          return false;
        }
        // Location filter
        if (selectedLocation !== 'All' && !pet.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
        // Trait filter
        if (selectedTrait !== 'All') {
          const inGoodWith = pet.goodWith?.some((g) => g.toLowerCase().includes(selectedTrait.toLowerCase()));
          const inPersonality = pet.personality?.some((p) => p.toLowerCase().includes(selectedTrait.toLowerCase()));
          if (!inGoodWith && !inPersonality) {
            return false;
          }
        }
        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchesName = pet.name.toLowerCase().includes(q);
          const matchesBreed = pet.breed.toLowerCase().includes(q);
          const matchesLocation = pet.location.toLowerCase().includes(q);
          const matchesShelter = (pet.shelterName || '').toLowerCase().includes(q);
          const matchesPersonality = pet.personality.some((p) => p.toLowerCase().includes(q));
          if (!matchesName && !matchesBreed && !matchesLocation && !matchesShelter && !matchesPersonality) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'recent') {
          return (b.dateAdded || '').localeCompare(a.dateAdded || '');
        }
        if (sortBy === 'age') {
          return a.age.localeCompare(b.age);
        }
        return 0;
      });
  }, [
    pets,
    selectedCategory,
    searchQuery,
    selectedAge,
    selectedSize,
    selectedGender,
    selectedActivity,
    selectedLocation,
    selectedTrait,
    sortBy,
  ]);

  const activeFilterCount = [
    selectedCategory !== 'All',
    searchQuery !== '',
    selectedAge !== 'All',
    selectedSize !== 'All',
    selectedGender !== 'All',
    selectedActivity !== 'All',
    selectedLocation !== 'All',
    selectedTrait !== 'All',
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedAge('All');
    setSelectedSize('All');
    setSelectedGender('All');
    setSelectedActivity('All');
    setSelectedLocation('All');
    setSelectedTrait('All');
    setSortBy('featured');
    setVisibleCount(12);
  };

  const paginatedPets = filteredPets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPets.length;

  return (
    <section className="py-8 lg:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header Frame */}
        <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-6 sm:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F6D97B] text-[#0F5C94] text-xs font-black uppercase tracking-wider mb-2 border-2 border-[#0F5C94]">
                <PawIcon className="w-3.5 h-3.5 fill-[#FB4504]" />
                <span>Full Adoption Catalog ({pets.length} companions)</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-titan text-[#0F5C94] tracking-normal">
                Find your companion.
              </h1>
              <p className="text-xs sm:text-sm text-[#0F5C94]/85 font-medium mt-1 max-w-2xl">
                Browse thoroughly vetted shelter animals across Bangalore. Filter by your home space, lifestyle, and locality.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="browse-open-quiz-btn"
                onClick={onOpenMatchFinder}
                className="px-5 py-3 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
              >
                <CustomIcon name="sparkle" className="w-4 h-4 text-[#F6D97B]" />
                <span>Interactive Match Finder</span>
              </button>
            </div>
          </div>

          {/* Category Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-6 mt-4 border-t-2 border-[#0F5C94]/15 scrollbar-none">
            {categories.map((cat) => {
              const count =
                cat.type === 'All'
                  ? pets.length
                  : pets.filter((p) => p.animalType === cat.type).length;
              const isSelected = selectedCategory === cat.type;

              return (
                <button
                  key={cat.type}
                  id={`category-tab-${cat.type.toLowerCase()}`}
                  onClick={() => {
                    setSelectedCategory(cat.type);
                    setVisibleCount(12);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
                    isSelected
                      ? 'bg-[#0F5C94] text-white border-2 border-[#0F5C94] shadow-[3px_3px_0px_#FB4504]'
                      : 'bg-white text-[#0F5C94] hover:bg-[#F6D97B]/40 border-2 border-[#0F5C94]/30'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-md font-black ${
                      isSelected
                        ? 'bg-[#F6D97B] text-[#0F5C94]'
                        : 'bg-[#FAF5EB] text-[#9A5D16]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter Controls Card */}
          <div className="mt-4 pt-4 border-t-2 border-[#0F5C94]/15">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              
              {/* Search Input */}
              <div className="lg:col-span-4 relative">
                <CustomIcon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A5D16]" />
                <input
                  id="pet-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(12);
                  }}
                  placeholder="Search name, breed, Bangalore locality, or shelter..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94]"
                />
              </div>

              {/* Age Category Filter */}
              <div className="lg:col-span-2">
                <select
                  id="filter-age-select"
                  value={selectedAge}
                  onChange={(e) => {
                    setSelectedAge(e.target.value as any);
                    setVisibleCount(12);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94] uppercase tracking-wider focus:outline-none focus:border-[#0F5C94]"
                >
                  <option value="All">All Ages</option>
                  <option value="Young">Puppy / Kitten / Young</option>
                  <option value="Adult">Adult Pets</option>
                  <option value="Senior">Senior Companions</option>
                </select>
              </div>

              {/* Size Filter */}
              <div className="lg:col-span-2">
                <select
                  id="filter-size-select"
                  value={selectedSize}
                  onChange={(e) => {
                    setSelectedSize(e.target.value as any);
                    setVisibleCount(12);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94] uppercase tracking-wider focus:outline-none focus:border-[#0F5C94]"
                >
                  <option value="All">All Sizes</option>
                  <option value="Small">Small (&lt; 10kg)</option>
                  <option value="Medium">Medium (10 - 25kg)</option>
                  <option value="Large">Large (&gt; 25kg)</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="lg:col-span-2">
                <select
                  id="filter-location-select"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setVisibleCount(12);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94] uppercase tracking-wider focus:outline-none focus:border-[#0F5C94]"
                >
                  <option value="All">All Localities</option>
                  {availableLocations.filter((l) => l !== 'All').map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="lg:col-span-2">
                <select
                  id="filter-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94] uppercase tracking-wider focus:outline-none focus:border-[#0F5C94]"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="recent">Sort: Recently Added</option>
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="age">Sort: Age</option>
                </select>
              </div>

            </div>

            {/* Quick Lifestyle / Trait Filter Tags */}
            <div className="mt-3 pt-3 border-t-2 border-[#0F5C94]/10 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-black text-[#9A5D16] uppercase tracking-wider shrink-0 flex items-center gap-1">
                <CustomIcon name="filter" className="w-3 h-3" />
                <span>Traits:</span>
              </span>
              {traitFilters.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrait(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-wider cursor-pointer ${
                    selectedTrait === t.id
                      ? 'bg-[#FB4504] text-white border border-[#0F5C94]'
                      : 'bg-white text-[#0F5C94] hover:bg-[#F6D97B]/40 border border-[#0F5C94]/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Bottom Bar with Count, Active Filter Tokens, View Switcher */}
            <div className="mt-3 pt-3 border-t-2 border-[#0F5C94]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-black text-[#9A5D16]">
              
              <div className="flex items-center gap-3">
                <span>
                  Showing <strong className="text-[#0F5C94] text-sm">{filteredPets.length}</strong> of {pets.length} companions
                </span>

                {activeFilterCount > 0 && (
                  <button
                    id="browse-reset-filters-btn"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FB4504]/10 text-[#FB4504] hover:bg-[#FB4504] hover:text-white transition-all uppercase tracking-wider text-[10px] cursor-pointer"
                  >
                    <CustomIcon name="cross" className="w-3 h-3" />
                    <span>Reset ({activeFilterCount})</span>
                  </button>
                )}
              </div>

              {/* View Mode Toggle: Grid vs List */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#0F5C94]/30">
                <button
                  id="view-mode-grid-btn"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#0F5C94] text-white'
                      : 'text-[#0F5C94] hover:bg-[#FAF5EB]'
                  }`}
                  title="Grid View"
                >
                  <CustomIcon name="three lines" className="w-4 h-4" />
                </button>
                <button
                  id="view-mode-list-btn"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#0F5C94] text-white'
                      : 'text-[#0F5C94] hover:bg-[#FAF5EB]'
                  }`}
                  title="Detailed List View"
                >
                  <CustomIcon name="file" className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Pets Presentation: Grid View */}
        {filteredPets.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedPets.map((pet) => (
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
            /* Pets Presentation: Detailed List / Table Mode */
            <div className="space-y-4">
              {paginatedPets.map((pet) => {
                const isFavorite = favoriteIds.includes(pet.id);
                return (
                  <div
                    key={pet.id}
                    onClick={() => onSelectPet(pet)}
                    className="group bg-white rounded-2xl p-5 border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:shadow-[6px_6px_0px_#FB4504] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border-2 border-[#0F5C94] bg-[#FAF5EB] relative">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-2xl font-titan text-[#0F5C94] group-hover:text-[#FB4504] transition-colors leading-tight">
                            {pet.name}
                          </h3>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#F6D97B] border border-[#0F5C94] text-[#0F5C94] uppercase">
                            {pet.breed}
                          </span>
                        </div>

                        <p className="text-xs text-[#0F5C94]/80 font-medium line-clamp-1 max-w-lg">
                          "{pet.description}"
                        </p>

                        <div className="flex items-center gap-3 text-xs font-bold text-[#9A5D16] flex-wrap">
                          <span className="inline-flex items-center gap-1.5 text-[#0F5C94]">
                            <span className="w-5 h-5 rounded-md bg-[#FB4504] border border-[#0F5C94] flex items-center justify-center shrink-0">
                              <CustomIcon name="location" white className="w-3 h-3" />
                            </span>
                            <span>{pet.location}</span>
                          </span>
                          <span>•</span>
                          <span>{pet.gender}</span>
                          <span>•</span>
                          <span>{pet.age} ({pet.ageCategory})</span>
                          <span>•</span>
                          <span className="text-[#0F942D] font-black">{pet.adoptionFee || 'Free adoption'}</span>
                        </div>

                        {/* Personality tags */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {pet.personality.slice(0, 4).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FAF5EB] text-[#0F5C94] border border-[#0F5C94]/30 uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions on right */}
                    <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#0F5C94]/15">
                      <button
                        onClick={(e) => onToggleFavorite(pet.id, e)}
                        className="p-2.5 rounded-xl bg-white hover:bg-[#F6D97B] text-[#FB4504] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all cursor-pointer"
                        title={isFavorite ? 'Remove from saved' : 'Save pet'}
                      >
                        <CustomIcon name={isFavorite ? 'heart-filled' : 'heart-unfilled'} className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPet(pet);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#0F5C94] hover:bg-[#FB4504] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] cursor-pointer"
                      >
                        <span>Meet {pet.name}</span>
                        <CustomIcon name="right-arrow" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-10 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-xl bg-[#F6D97B] border-2 border-[#0F5C94] flex items-center justify-center mx-auto text-[#0F5C94]">
              <PawIcon className="w-7 h-7 fill-[#FB4504]" />
            </div>
            <h3 className="text-2xl font-titan text-[#0F5C94]">
              No matching companions
            </h3>
            <p className="text-xs sm:text-sm text-[#0F5C94]/85 font-medium">
              We couldn't find any animals matching your exact combination. Try clearing your filters to see all available pets.
            </p>
            <button
              id="empty-browse-clear-btn"
              onClick={handleResetFilters}
              className="px-5 py-3 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] transition-all cursor-pointer"
            >
              Clear Filters & View All {pets.length} Pets
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              id="browse-load-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-7 py-3.5 rounded-xl bg-[#0F5C94] hover:bg-[#0c4b79] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#FB4504] hover:translate-x-0.5 hover:translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Load More Pets ({filteredPets.length - visibleCount} remaining)</span>
              <CustomIcon name="right-arrow" className="w-4 h-4 rotate-90" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
