import React, { useState, useEffect } from 'react';
import { Pet, AdoptionApplication, User, Like, ApplicationStatus } from './backend/types';
import { INITIAL_PETS } from './data/petsData';
import { shuffleArray } from './utils/shuffle';
// Firebase
import { db, auth, petsCollection, applicationsCollection, likesCollection, createLike, removeLike, createApplication, updateApplicationStatus, deleteApplication, deletePet } from './lib/db';
import { onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { seedDatabaseIfEmpty } from './lib/seed';
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

  // Application Data States (synced with localStorage)
  const [pets, setPets] = useState<Pet[]>([]);
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

  // Applications
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);

  // Liked & Favorited Pets (synced with localStorage)
  const [likedPetIds, setLikedPetIds] = useState<string[]>([]);

  // Modals & Interaction States
  const [selectedPetForProfile, setSelectedPetForProfile] = useState<Pet | null>(null);
  const [selectedPetForApplication, setSelectedPetForApplication] = useState<Pet | null>(null);
  const [isMatchesModalOpen, setIsMatchesModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Firestore listeners
  useEffect(() => {
    
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { getDoc, doc } = await import('firebase/firestore');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
        seedDatabaseIfEmpty();
      } else {
        setUserProfile(null);
      }
    });

    const unsubscribePets = onSnapshot(petsCollection, (snapshot) => {
      const p: Pet[] = [];
      snapshot.forEach(doc => p.push(doc.data() as Pet));
      // Optionally sort by dateAdded descending
      p.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      setPets(p);
    });

  return () => {
      unsubscribeAuth();
      unsubscribePets();
    };
  }, []);

  useEffect(() => {
    try {
      if (userProfile) {
        localStorage.setItem('furever_user_profile', JSON.stringify(userProfile));
      } else {
        localStorage.removeItem('furever_user_profile');
      }
    } catch (e) {
      console.error(e);
    }

    if (!auth.currentUser) {
      setLikedPetIds([]);
      setApplications([]);
      return;
    }

    const uid = auth.currentUser.uid;
    
    // Listen to likes for this user
    const qLikes = query(likesCollection, where("userId", "==", uid));
    const unsubscribeLikes = onSnapshot(qLikes, (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach(doc => ids.push((doc.data() as Like).petId));
      setLikedPetIds(ids);
    });

    // Listen to applications
    // A user can be the applicant (userId == uid) or the pet lister (petListerId == uid)
    const qAppsApplicant = query(applicationsCollection, where("userId", "==", uid));
    const qAppsLister = query(applicationsCollection, where("petListerId", "==", uid));
    
    const appsMap = new Map<string, AdoptionApplication>();

    const updateApps = () => {
      setApplications(Array.from(appsMap.values()).sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime()));
    };

    const unsubAppsApplicant = onSnapshot(qAppsApplicant, (snapshot) => {
      snapshot.forEach(doc => appsMap.set(doc.id, doc.data() as AdoptionApplication));
      snapshot.docChanges().forEach(change => {
        if (change.type === 'removed') appsMap.delete(change.doc.id);
      });
      updateApps();
    });

    const unsubAppsLister = onSnapshot(qAppsLister, (snapshot) => {
      snapshot.forEach(doc => appsMap.set(doc.id, doc.data() as AdoptionApplication));
      snapshot.docChanges().forEach(change => {
        if (change.type === 'removed') appsMap.delete(change.doc.id);
      });
      updateApps();
    });

    return () => {
      unsubscribeLikes();
      unsubAppsApplicant();
      unsubAppsLister();
    };
  }, [userProfile]);

  // Helper to persist likes for current user
  const updateLikesForCurrentUser = async (newUserLikedPetIds: string[]) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    
    // Find removed likes
    const removedIds = likedPetIds.filter(id => !newUserLikedPetIds.includes(id));
    for (const petId of removedIds) {
      await removeLike(`like-${petId}-${uid}`);
    }

    // Find added likes
    const addedIds = newUserLikedPetIds.filter(id => !likedPetIds.includes(id));
    for (const petId of addedIds) {
      await createLike({
        likeId: `like-${petId}-${uid}`,
        userId: uid,
        petId: petId,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Helper to persist applications is now handled by directly making DB calls where needed, 
  // but we provide a mock updateApplicationsForCurrentUser so we don't break old code before removing it.
  const updateApplicationsForCurrentUser = (newUserApps: AdoptionApplication[]) => {
    // No-op for now. DB operations will trigger onSnapshot.
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
    if (!auth.currentUser) return;
    newPet.petListerId = auth.currentUser.uid;
    await import('./lib/db').then(db => db.createPet(newPet));
    showToast(`🎉 ${newPet.name} is now listed for adoption!`);
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
      showToast(`Added ${pet ? pet.name : 'pet'} to saved matches ❤️`);
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
    showToast(`You liked ${pet.name}! Added to matches ❤️`);
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
    showToast(`Welcome, ${profile.name}!`);
  };

  // Handle new submitted application
  const handleNewApplication = async (newApp: AdoptionApplication) => {
    if (!auth.currentUser) {
      showToast('You must be signed in to submit an application.');
      return;
    }
    newApp.userId = auth.currentUser.uid;
    const db = await import('./lib/db');
    await db.createApplication(newApp);
    await db.updatePetStatus(newApp.petId, 'PENDING');
    showToast(`Application for ${newApp.petName} submitted successfully!`);
  };

  // Update status of an application
  const handleUpdateApplicationStatus = async (appId: string, status: ApplicationStatus) => {
    const db = await import('./lib/db');
    await db.updateApplicationStatus(appId, status);
    
    if (status === 'Adopted') {
      const targetApp = applications.find(a => a.id === appId);
      if (targetApp) {
        await db.updatePetStatus(targetApp.petId, 'ADOPTED');
      }
    }
    showToast(`Application marked as ${status}!`);
  };

  // Remove / delete a listed pet
  const handleRemovePet = async (petId: string) => {
    await import('./lib/db').then(db => db.deletePet(petId));
    showToast('🏡 Pet listing removed successfully.');
  };

  // Delete / Withdraw an application (for adopters)
  const handleDeleteApplication = async (appId: string) => {
    await import('./lib/db').then(db => db.deleteApplication(appId));
    showToast('🗑️ Application withdrawn and deleted successfully.');
  };


  const adoptablePets = pets.filter(p => !(userProfile && p.petListerId === userProfile.userId));
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
          if (userProfile?.role === 'adopter') {
            showToast('Adopters cannot list pets. Please sign out and sign in as a Pet Lister.');
          } else {
            setIsListPetModalOpen(true);
          }
        }}
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
              userRole={userProfile?.role}
              onDiscoverClick={() => {
                setCurrentTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onMeetClick={() => {
                if (userProfile?.role === 'pet-lister') {
                  showToast('Pet listers cannot adopt pets. Please sign out and sign in as an Adopter.');
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
                if (userProfile?.role === 'pet-lister') {
                  showToast('Pet listers cannot adopt pets. Please sign out and sign in as an Adopter.');
                } else {
                  setCurrentTab('swipe');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onListPetClick={() => {
                if (userProfile?.role === 'adopter') {
                  showToast('Adopters cannot list pets. Please sign out and sign in as a Pet Lister.');
                } else {
                  setIsListPetModalOpen(true);
                }
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
            pets={adoptablePets}
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
            pets={adoptablePets}
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
                ? applications
                : userProfile?.role === 'Adopter'
                ? applications.filter(app => app.applicantEmail === userProfile?.email)
                : (() => {
                    // Unregistered guest user - filter by locally submitted application IDs
                    try {
                      const storedIdsStr = localStorage.getItem('furever_submitted_ids');
                      if (storedIdsStr) {
                        const storedIds = JSON.parse(storedIdsStr) as string[];
                        return applications.filter(app => storedIds.includes(app.id));
                      }
                    } catch (e) {
                      console.error(e);
                    }
                    return [];
                  })()
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
        userRole={userProfile?.role}
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
      />

      {/* User Sign In Modal */}
      <UserSignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        currentProfile={userProfile}
        onSignIn={handleUserSignIn}
        onSignOut={() => {
          setUserProfile(null);
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
        onListPetClick={() => setIsListPetModalOpen(true)}
      />

    </div>
  );
}
