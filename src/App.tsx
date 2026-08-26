import React, { useState, useEffect } from 'react';
import { Pet, AdoptionApplication } from './types';
import { INITIAL_PETS } from './data/petsData';
import { INITIAL_APPLICATIONS } from './data/initialApplications';
import { shuffleArray } from './utils/shuffle';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { PetCard } from './components/PetCard';
import { PetBrowseGrid } from './components/PetBrowseGrid';
import { SwipeCardDeck } from './components/SwipeCardDeck';
import { MatchQuizFinder } from './components/MatchQuizFinder';
import { PetProfileModal } from './components/PetProfileModal';
import { AdoptionFormModal } from './components/AdoptionFormModal';
import { MyApplicationsView } from './components/MyApplicationsView';
import { SavedMatchesModal } from './components/SavedMatchesModal';
import { Footer } from './components/Footer';
import { FloatingBackgroundIcons } from './components/FloatingBackgroundIcons';
import { CustomIcon } from './components/CustomIcon';
import { PawIcon } from './components/PawDecorations';
import { AnimalMarqueeTape } from './components/AnimalMarqueeTape';


export default function App() {
  // Navigation tab: 'home' | 'browse' | 'swipe' | 'quiz' | 'how-it-works' | 'applications'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Application Data States
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  
  const handleShufflePets = () => {
    setPets((prevPets) => shuffleArray(prevPets));
  };
  
  // Persisted Applications
  const [applications, setApplications] = useState<AdoptionApplication[]>(() => {
    try {
      const saved = localStorage.getItem('furever_applications_v4') || localStorage.getItem('furever_applications_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out pre-loaded sample mock applications so status starts empty until user fills one
          const userSubmitted = parsed.filter(
            (app: AdoptionApplication) => app.id !== 'FUR-2026-8942' && app.id !== 'FUR-2026-7621'
          );
          return userSubmitted.map((app: AdoptionApplication) => ({
            ...app,
            applicantName: 'You',
            petLocation: app.petLocation?.includes('Bengaluru') ? app.petLocation : 'Jayanagar, Bengaluru',
            applicantAddress: app.applicantAddress?.includes('Bengaluru') ? app.applicantAddress : 'Jayanagar 4th Block, Bengaluru',
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Persisted Liked & Favorited Pets
  const [likedPetIds, setLikedPetIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('furever_liked_pets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['pet-1', 'pet-2'];
  });

  // Modals & Interaction States
  const [selectedPetForProfile, setSelectedPetForProfile] = useState<Pet | null>(null);
  const [selectedPetForApplication, setSelectedPetForApplication] = useState<Pet | null>(null);
  const [isMatchesModalOpen, setIsMatchesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('furever_applications_v4', JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('furever_liked_pets', JSON.stringify(likedPetIds));
    } catch (e) {
      console.error(e);
    }
  }, [likedPetIds]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle favorite / like
  const handleToggleFavorite = (petId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPetIds((prev) => {
      const exists = prev.includes(petId);
      const pet = pets.find((p) => p.id === petId);
      if (exists) {
        showToast(`Removed ${pet ? pet.name : 'pet'} from saved matches`);
        return prev.filter((id) => id !== petId);
      } else {
        showToast(`Added ${pet ? pet.name : 'pet'} to saved matches ❤️`);
        return [...prev, petId];
      }
    });
  };

  // Swipe handlers
  const handleSwipeRight = (pet: Pet) => {
    if (!likedPetIds.includes(pet.id)) {
      setLikedPetIds((prev) => [...prev, pet.id]);
    }
    showToast(`You liked ${pet.name}! Added to matches ❤️`);
  };

  const handleSwipeLeft = (pet: Pet) => {
    showToast(`Passed on ${pet.name}`);
  };

  const handleRemoveMatch = (petId: string) => {
    setLikedPetIds((prev) => prev.filter((id) => id !== petId));
  };

  // Handle new submitted application
  const handleNewApplication = (newApp: AdoptionApplication) => {
    setApplications((prev) => [newApp, ...prev]);
    showToast(`Application #${newApp.id} submitted successfully!`);
  };

  // Select pet by ID (from applications view)
  const handleSelectPetById = (petId: string) => {
    const found = pets.find((p) => p.id === petId);
    if (found) {
      setSelectedPetForProfile(found);
    }
  };

  const likedPetsList = pets.filter((p) => likedPetIds.includes(p.id));
  const availablePetsCount = pets.filter((p) => p.status === 'AVAILABLE').length;

  return (
    <div className="min-h-screen bg-[#ffca42] flex flex-col selection:bg-[#FB4504] selection:text-white relative">
      <FloatingBackgroundIcons />
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F5C94] text-white px-5 py-3.5 rounded-xl shadow-[4px_4px_0px_#FB4504] border-2 border-[#0F5C94] text-xs font-black uppercase tracking-wider flex items-center gap-2 animate-slideUp">
          <PawIcon className="w-4 h-4 fill-[#F6D97B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        likedCount={likedPetIds.length}
        applicationCount={applications.length}
        onOpenMatches={() => setIsMatchesModalOpen(true)}
        onFindYourMatch={() => {
          setCurrentTab('swipe');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pets={pets}
        onSelectPet={setSelectedPetForProfile}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 relative z-10">
        
        {/* VIEW 1: HOME PAGE */}
        {currentTab === 'home' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onFindYourMatch={() => {
                setCurrentTab('swipe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExplorePets={() => {
                setCurrentTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              availableCount={availablePetsCount}
            />

            {/* Moving Animal Icons Marquee Tape */}
            <AnimalMarqueeTape />

            {/* How It Works Section */}
            <HowItWorks
              onDiscoverClick={() => {
                setCurrentTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onMeetClick={() => {
                setCurrentTab('quiz');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onConnectClick={() => {
                setCurrentTab('applications');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSwipeClick={() => {
                setCurrentTab('swipe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* PETS WAITING FOR YOU Showcase */}
            <section className="py-12 lg:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-6 sm:p-10">
                  
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 pb-6 border-b-2 border-[#0F5C94]/15">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F6D97B] border-2 border-[#0F5C94] text-[#0F5C94] text-xs font-black uppercase tracking-wider mb-2">
                        <PawIcon className="w-3.5 h-3.5 fill-[#FB4504]" />
                        <span>Ready for Adoption</span>
                      </div>

                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-titan text-[#0F5C94] tracking-normal">
                        PETS WAITING FOR YOU
                      </h2>

                      <p className="text-sm sm:text-base text-[#0F5C94]/80 font-medium mt-1">
                        Meet verified companions in Bangalore waiting for a loving family today.
                      </p>
                    </div>

                    {/* Primary CTA button to match/explore */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        id="home-shuffle-pets-cta"
                        onClick={handleShufflePets}
                        className="px-5 py-3.5 rounded-xl bg-[#F6D97B] hover:bg-[#ebd070] text-[#0F5C94] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                        title="Shuffle animal recommendations"
                      >
                        <span className="text-sm">🔀</span>
                        <span>Shuffle Animals</span>
                      </button>
                      <button
                        id="home-find-my-match-cta"
                        onClick={() => {
                          setCurrentTab('swipe');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-3.5 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>Find My Match</span>
                        <CustomIcon name="right-arrow" className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Pet Cards Grid (First 6 pets) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {pets.slice(0, 6).map((pet) => (
                      <PetCard
                        key={pet.id}
                        pet={pet}
                        isFavorite={likedPetIds.includes(pet.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onSelectPet={setSelectedPetForProfile}
                      />
                    ))}
                  </div>

                  {/* View All Button */}
                  <div className="mt-10 text-center pt-6 border-t-2 border-[#0F5C94]/15">
                    <button
                      id="home-view-all-pets-btn"
                      onClick={() => {
                        setCurrentTab('browse');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#F6D97B]/40 text-[#0F5C94] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <CustomIcon name="discover" className="w-4 h-4 text-[#9A5D16]" />
                      <span>View All {pets.length} Available Pets</span>
                      <CustomIcon name="right-arrow" className="w-4 h-4 text-[#0F5C94]" />
                    </button>
                  </div>

                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: BROWSE / FIND A PET */}
        {currentTab === 'browse' && (
          <PetBrowseGrid
            pets={pets}
            favoriteIds={likedPetIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectPet={setSelectedPetForProfile}
            onOpenMatchFinder={() => {
              setCurrentTab('quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShufflePets={handleShufflePets}
          />
        )}

        {/* VIEW 3: SWIPE TO MATCH */}
        {currentTab === 'swipe' && (
          <SwipeCardDeck
            pets={pets}
            likedPetIds={likedPetIds}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onOpenMatches={() => setIsMatchesModalOpen(true)}
            onSelectPet={setSelectedPetForProfile}
            onApplyPet={(pet) => setSelectedPetForApplication(pet)}
          />
        )}

        {/* VIEW 4: MATCH FINDER & QUIZ */}
        {currentTab === 'quiz' && (
          <MatchQuizFinder
            pets={pets}
            favoriteIds={likedPetIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectPet={setSelectedPetForProfile}
          />
        )}

        {/* VIEW 5: HOW IT WORKS DEDICATED VIEW */}
        {currentTab === 'how-it-works' && (
          <div className="py-12 bg-[#FFFDF9] relative z-10">
            <HowItWorks
              onDiscoverClick={() => {
                setCurrentTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onMeetClick={() => {
                setCurrentTab('quiz');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onConnectClick={() => {
                setCurrentTab('applications');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Extra Adoption FAQs and Guidance */}
            <div className="max-w-4xl mx-auto px-4 py-16">
              <div className="text-center mb-10">
                <span className="px-3 py-1 rounded-full bg-[#F8E6BF] text-[#9A5D16] text-xs font-black uppercase">
                  Adoption FAQ
                </span>
                <h2 className="text-3xl font-black text-[#0F5C94] font-['Outfit'] mt-2">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-[#FAF5EB] p-6 rounded-2xl border border-[#F8E6BF]">
                  <h4 className="text-base font-black text-[#0F5C94]">
                    What happens after I submit an application?
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1 leading-relaxed">
                    Your application goes straight to the shelter coordinator. They review your home environment preferences, conduct a brief verification, and coordinate a meet-and-greet session. You can track this in real-time under My Applications.
                  </p>
                </div>

                <div className="bg-[#FAF5EB] p-6 rounded-2xl border border-[#F8E6BF]">
                  <h4 className="text-base font-black text-[#0F5C94]">
                    Are all pets vaccinated and health checked?
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1 leading-relaxed">
                    Yes! Every companion featured on FUREVER undergoes thorough veterinary health screening, deworming, vaccinations, and spay/neuter procedures appropriate for their age.
                  </p>
                </div>

                <div className="bg-[#FAF5EB] p-6 rounded-2xl border border-[#F8E6BF]">
                  <h4 className="text-base font-black text-[#0F5C94]">
                    Can I apply for multiple pets?
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1 leading-relaxed">
                    You can save as many pets as you like to your favorites or swipe deck matches, and submit applications for those that fit your household best.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: MY APPLICATIONS */}
        {currentTab === 'applications' && (
          <MyApplicationsView
            applications={applications}
            onExplorePets={() => {
              setCurrentTab('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectPetById={handleSelectPetById}
          />
        )}

      </main>

      {/* Pet Profile Modal */}
      <PetProfileModal
        pet={selectedPetForProfile}
        isOpen={selectedPetForProfile !== null}
        isFavorite={selectedPetForProfile ? likedPetIds.includes(selectedPetForProfile.id) : false}
        onClose={() => setSelectedPetForProfile(null)}
        onToggleFavorite={handleToggleFavorite}
        onApply={(pet) => {
          setSelectedPetForProfile(null);
          setSelectedPetForApplication(pet);
        }}
      />

      {/* Adoption Form Application Modal */}
      <AdoptionFormModal
        pet={selectedPetForApplication}
        isOpen={selectedPetForApplication !== null}
        onClose={() => setSelectedPetForApplication(null)}
        onSubmitSuccess={handleNewApplication}
        onGoToApplications={() => {
          setSelectedPetForApplication(null);
          setCurrentTab('applications');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Saved / Liked Matches Modal */}
      <SavedMatchesModal
        isOpen={isMatchesModalOpen}
        onClose={() => setIsMatchesModalOpen(false)}
        likedPets={likedPetsList}
        onRemoveMatch={handleRemoveMatch}
        onSelectPet={(pet) => {
          setIsMatchesModalOpen(false);
          setSelectedPetForProfile(pet);
        }}
        onApplyPet={(pet) => {
          setIsMatchesModalOpen(false);
          setSelectedPetForApplication(pet);
        }}
        onStartSwiping={() => {
          setIsMatchesModalOpen(false);
          setCurrentTab('swipe');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Brand Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onFindYourMatch={() => {
          setCurrentTab('swipe');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
