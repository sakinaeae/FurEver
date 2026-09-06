import React, { useState, useEffect } from 'react';
import { Pet, AdoptionApplication, User, Like, ApplicationStatus } from './backend/types';
import { INITIAL_PETS } from './data/petsData';
import { shuffleArray } from './utils/shuffle';
// Firebase
import { UserProfile } from './components/UserSignInModal';

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
import { SavedMatchesModal } from './components/SavedMatchesModal';
import { UserSignInModal } from './components/UserSignInModal';
import { ListPetModal } from './components/ListPetModal';
import { Footer } from './components/Footer';
import { FloatingBackgroundIcons } from './components/FloatingBackgroundIcons';
import { CustomIcon } from './components/CustomIcon';
import { PawIcon } from './components/PawDecorations';
import { AnimalMarqueeTape } from './components/AnimalMarqueeTape';
import { MyApplicationsView } from './components/MyApplicationsView';

export default function App() {
  // Navigation tab: 'home' | 'browse' | 'swipe' | 'quiz' | 'how-it-works' | 'status'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Application Data States (synced with localStorage & fallback to INITIAL_PETS)
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const saved = localStorage.getItem('furever_pets_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with INITIAL_PETS to guarantee all pets are accessible
          const existingIds = new Set(parsed.map((p: Pet) => p.id));
          const missingInitial = INITIAL_PETS.filter((p) => !existingIds.has(p.id));
          return [...parsed, ...missingInitial];
        }
      }
    } catch (e) {
      console.error('Error loading pets from localStorage', e);
    }
    return INITIAL_PETS;
  });

  const [isListPetModalOpen, setIsListPetModalOpen] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('furever_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const getUserKey = (profile: UserProfile | null) => {
    if (!profile) return 'guest';
    return (profile.userId || profile.email).toLowerCase();
  };

  // Applications (all system applications synced with localStorage)
  const [applications, setApplications] = useState<AdoptionApplication[]>(() => {
    try {
      const saved = localStorage.getItem('furever_all_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading applications from localStorage', e);
    }
    return [];
  });

  // Liked & Favorited Pets (synced with localStorage per user)
  const [likedPetIds, setLikedPetIds] = useState<string[]>(() => {
    try {
      const savedProfileStr = localStorage.getItem('furever_user_profile');
      const profile = savedProfileStr ? JSON.parse(savedProfileStr) : null;
      if (!profile) return [];
      const key = getUserKey(profile);
      const saved = localStorage.getItem(`furever_liked_pet_ids_${key}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading likes from localStorage', e);
    }
    return [];
  });

  // Sync pets to localStorage whenever pets update
  useEffect(() => {
    if (pets.length > 0) {
      localStorage.setItem('furever_pets_list', JSON.stringify(pets));
    }
  }, [pets]);

  // Sync applications to localStorage
  useEffect(() => {
    localStorage.setItem('furever_all_applications', JSON.stringify(applications));
  }, [applications]);

  // Sync likes to localStorage per user
  useEffect(() => {
    if (userProfile) {
      const key = getUserKey(userProfile);
      localStorage.setItem(`furever_liked_pet_ids_${key}`, JSON.stringify(likedPetIds));
    }
  }, [likedPetIds, userProfile]);

  // Modals & Interaction States
  const [selectedPetForProfile, setSelectedPetForProfile] = useState<Pet | null>(null);
  const [selectedPetForApplication, setSelectedPetForApplication] = useState<Pet | null>(null);
  const [isMatchesModalOpen, setIsMatchesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local storage profile sync
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('furever_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('furever_user_profile');
    }
  }, [userProfile]);

  // Helper to persist likes for current user
  const updateLikesForCurrentUser = (newUserLikedPetIds: string[]) => {
    setLikedPetIds(newUserLikedPetIds);
  };

  // Helper to persist applications
  const updateApplicationsForCurrentUser = (newUserApps: AdoptionApplication[]) => {
    setApplications(newUserApps);
  };

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShufflePets = () => {
    setPets((prevPets) => shuffleArray(prevPets));
  };

  // Add new pet listing
  const handlePetListed = async (newPet: Pet) => {
    setPets(prev => {
      const updated = [newPet, ...prev];
      localStorage.setItem('furever_pets_list', JSON.stringify(updated));
      return updated;
    });
    showToast(`${newPet.name} listed successfully!`);
  };

  // Toggle favorite / like
  const handleToggleFavorite = (petId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const exists = likedPetIds.includes(petId);
    const pet = pets.find((p) => p.id === petId);
    
    if (exists) {
      showToast(`Removed ${pet ? pet.name : 'pet'} from saved matches`);
      const updatedLikes = likedPetIds.filter((id) => id !== petId);
      updateLikesForCurrentUser(updatedLikes);
    } else {
      showToast(`Added ${pet ? pet.name : 'pet'} to saved matches`);
      const updatedLikes = [...likedPetIds, petId];
      updateLikesForCurrentUser(updatedLikes);
    }
  };

  // Swipe handlers
  const handleSwipeRight = (pet: Pet) => {
    if (!likedPetIds.includes(pet.id)) {
      const updatedLikes = [...likedPetIds, pet.id];
      updateLikesForCurrentUser(updatedLikes);
    }
    showToast(`You liked ${pet.name}! Added to matches`);
  };

  const handleSwipeLeft = (pet: Pet) => {
    showToast(`Passed on ${pet.name}`);
  };

  const handleRemoveMatch = (petId: string) => {
    const updatedLikes = likedPetIds.filter((id) => id !== petId);
    updateLikesForCurrentUser(updatedLikes);
  };

  // Handle user sign-in
  const handleUserSignIn = (profile: UserProfile) => {
    setUserProfile(profile);
    const key = getUserKey(profile);
    try {
      const savedLikes = localStorage.getItem(`furever_liked_pet_ids_${key}`);
      setLikedPetIds(savedLikes ? JSON.parse(savedLikes) : []);
    } catch (e) {
      setLikedPetIds([]);
    }
    showToast(`Welcome, ${profile.name}!`);
  };

  // Handle new submitted application
  const handleNewApplication = async (newApp: AdoptionApplication) => {
    if (userProfile) {
      newApp.userId = userProfile.userId || '';
      newApp.applicantEmail = userProfile.email || newApp.applicantEmail;
    }
    setApplications(prev => [newApp, ...prev]);
    setPets(prev => prev.map(p => p.id === newApp.petId ? { ...p, status: 'PENDING' } : p));
    showToast(`Application for ${newApp.petName} submitted successfully!`);
  };

  // Update status of an application
  const handleUpdateApplicationStatus = async (appId: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, currentStatus: status } : a));
    
    const targetApp = applications.find(a => a.id === appId);
    if (status === 'Adopted' && targetApp) {
      setPets(prev => prev.map(p => p.id === targetApp.petId ? { ...p, status: 'ADOPTED' } : p));
    }
  };

  // Remove / delete a listed pet
  const handleRemovePet = async (petId: string) => {
    setPets(prev => prev.filter(p => p.id !== petId));
    showToast('Pet removed successfully.');
  };

  // Delete / Withdraw an application (for adopters)
  const handleDeleteApplication = async (appId: string) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
    showToast('Application withdrawn and deleted successfully.');
  };

  const adoptablePets = pets.filter(p => !(userProfile && userProfile.role === 'Pet Lister' && p.petListerId === userProfile.userId));
  const likedPetsList = adoptablePets.filter((p) => likedPetIds.includes(p.id));
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
        onOpenMatches={() => setIsMatchesModalOpen(true)}
        onFindYourMatch={() => {
          setCurrentTab('swipe');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        pets={pets}
        onSelectPet={setSelectedPetForProfile}
        currentProfile={userProfile}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
        onOpenListPetModal={() => {
          if (!userProfile) {
            setIsSignInModalOpen(true);
            showToast('Please log in as a Pet Lister to list a pet.');
            return;
          }
          if (userProfile?.role?.toLowerCase() === 'adopter') {
            showToast('Adopters cannot list pets. Only registered Pet Listers can list animals for adoption.');
            return;
          }
          setIsListPetModalOpen(true);
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 relative z-10">
        
        {/* VIEW 1: HOME PAGE */}
        {currentTab === 'home' && (
          <div>
            {/* Hero Section with 3 direct options */}
            <HeroSection
              onBrowsePets={() => {
                setCurrentTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSwipeMatch={() => {
                setCurrentTab('swipe');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onMatchQuiz={() => {
                setCurrentTab('quiz');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              availableCount={availablePetsCount}
            />

            {/* Moving Animal Icons Marquee Tape */}
            <AnimalMarqueeTape />

            {/* How It Works Section */}
            <HowItWorks
              userRole={userProfile?.role}
              onDiscoverClick={() => {
                setCurrentTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onMeetClick={() => {
                if (userProfile?.role === 'Pet Lister' || userProfile?.role?.toLowerCase() === 'pet lister') {
                  showToast('Pet Listers cannot adopt pets. Only registered Adopters can apply.');
                } else {
                  setCurrentTab('quiz');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onConnectClick={() => {
                setCurrentTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSwipeClick={() => {
                if (userProfile?.role === 'Pet Lister' || userProfile?.role?.toLowerCase() === 'pet lister') {
                  showToast('Pet Listers cannot adopt pets. Only registered Adopters can apply.');
                } else {
                  setCurrentTab('swipe');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onListPetClick={() => {
                if (!userProfile) {
                  setIsSignInModalOpen(true);
                  showToast('Please log in as a Pet Lister to list a pet.');
                  return;
                }
                if (userProfile?.role?.toLowerCase() === 'adopter') {
                  showToast('Adopters cannot list pets. Only registered Pet Listers can list animals for adoption.');
                  return;
                }
                setIsListPetModalOpen(true);
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
                    {pets.slice(0, 6).map((pet) => {
                      const hasApp = applications.some((app) => app.petId === pet.id);
                      const isUnderAdoption = pet.status !== 'AVAILABLE' || hasApp;
                      return (
                        <PetCard
                          key={pet.id}
                          pet={pet}
                          isFavorite={likedPetIds.includes(pet.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onSelectPet={setSelectedPetForProfile}
                          isUnderAdoption={isUnderAdoption}
                        />
                      );
                    })}
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
            pets={adoptablePets}
            favoriteIds={likedPetIds}
            onToggleFavorite={handleToggleFavorite}
            onSelectPet={setSelectedPetForProfile}
            onOpenMatchFinder={() => {
              setCurrentTab('quiz');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShufflePets={handleShufflePets}
            applications={applications}
          />
        )}

        {/* VIEW 3: SWIPE TO MATCH */}
        {currentTab === 'swipe' && (
          <SwipeCardDeck
            pets={adoptablePets}
            likedPetIds={likedPetIds}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onOpenMatches={() => setIsMatchesModalOpen(true)}
            onSelectPet={setSelectedPetForProfile}
            onApplyPet={(pet) => {
              if (!userProfile) {
                setIsSignInModalOpen(true);
                showToast('Please log in as an Adopter to fill the adoption form.');
                return;
              }
              if (userProfile?.role === 'Pet Lister' || userProfile?.role?.toLowerCase() === 'pet lister') {
                showToast('Pet Listers cannot fill adoption forms. Only registered Adopters can apply.');
                return;
              }
              setSelectedPetForApplication(pet);
            }}
            applications={applications}
          />
        )}

        {/* VIEW 4: MATCH FINDER & QUIZ */}
        {currentTab === 'quiz' && (
          <MatchQuizFinder
            pets={adoptablePets}
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
                setCurrentTab('browse');
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
                    Your application undergoes instant eligibility checks. When approved, the pet's foster or shelter owner will contact you directly to arrange a meet-and-greet!
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

        {/* VIEW 6: APPLICATIONS STATUS */}
        {currentTab === 'status' && (
          <MyApplicationsView
            applications={
              userProfile?.role === 'Pet Lister'
                ? applications.filter(app => {
                    const targetPet = pets.find(p => p.id === app.petId);
                    return (targetPet && targetPet.petListerId === userProfile.userId) || app.petListerId === userProfile.userId;
                  })
                : userProfile?.role?.toLowerCase() === 'adopter'
                ? applications.filter(app => 
                    (userProfile?.email && app.applicantEmail?.toLowerCase() === userProfile.email.toLowerCase()) || 
                    (userProfile?.userId && app.userId === userProfile.userId)
                  )
                : []
            }
            pets={pets}
            userProfile={userProfile}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onRemovePet={handleRemovePet}
            onDeleteApplication={handleDeleteApplication}
            onExplorePets={() => {
              setCurrentTab('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectPetById={(petId) => {
              const pet = pets.find(p => p.id === petId);
              if (pet) {
                setSelectedPetForProfile(pet);
              }
            }}
            showToast={showToast}
            onOpenSignIn={() => setIsSignInModalOpen(true)}
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
          if (!userProfile) {
            setIsSignInModalOpen(true);
            showToast('Please log in as an Adopter to fill the adoption form.');
            return;
          }
          if (userProfile?.role === 'Pet Lister' || userProfile?.role?.toLowerCase() === 'pet lister') {
            showToast('Pet Listers cannot fill adoption forms. Only registered Adopters can apply.');
            return;
          }
          setSelectedPetForProfile(null);
          setSelectedPetForApplication(pet);
        }}
        userRole={userProfile?.role}
        currentUserId={userProfile?.userId}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
        applications={applications}
      />

      {/* Adoption Form Application Modal */}
      <AdoptionFormModal
        pet={selectedPetForApplication}
        isOpen={selectedPetForApplication !== null}
        onClose={() => setSelectedPetForApplication(null)}
        onSubmitSuccess={handleNewApplication}
        onTrackStatus={() => {
          setSelectedPetForApplication(null);
          setCurrentTab('status');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExplorePets={() => {
          setSelectedPetForApplication(null);
          setCurrentTab('browse');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentProfile={userProfile}
        applications={applications}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
      />

      {/* User Sign In Modal */}
      <UserSignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        currentProfile={userProfile}
        onSignIn={handleUserSignIn}
        onSignOut={() => {
          setUserProfile(null);
          setLikedPetIds([]);
          showToast('Signed out successfully');
        }}
        onOpenListPetModal={() => setIsListPetModalOpen(true)}
      />

      {/* List Pet Modal (Foster & Owner Portal) */}
      <ListPetModal
        isOpen={isListPetModalOpen}
        onClose={() => setIsListPetModalOpen(false)}
        onPetListed={handlePetListed}
        currentProfile={userProfile}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
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
          if (!userProfile) {
            setIsMatchesModalOpen(false);
            setIsSignInModalOpen(true);
            showToast('Please log in as an Adopter to fill the adoption form.');
            return;
          }
          if (userProfile?.role === 'Pet Lister' || userProfile?.role?.toLowerCase() === 'pet lister') {
            showToast('Pet Listers cannot fill adoption forms. Only registered Adopters can apply.');
            return;
          }
          setIsMatchesModalOpen(false);
          setSelectedPetForApplication(pet);
        }}
        onStartSwiping={() => {
          setIsMatchesModalOpen(false);
          setCurrentTab('swipe');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        applications={applications}
      />

      {/* Brand Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onFindYourMatch={() => {
          setCurrentTab('swipe');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onListPetClick={() => {
          if (!userProfile) {
            setIsSignInModalOpen(true);
            showToast('Please log in as a Pet Lister to list a pet.');
            return;
          }
          if (userProfile?.role?.toLowerCase() === 'adopter') {
            showToast('Adopters cannot list pets. Only registered Pet Listers can list animals for adoption.');
            return;
          }
          setIsListPetModalOpen(true);
        }}
        userProfile={userProfile}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
      />

    </div>
  );
}
