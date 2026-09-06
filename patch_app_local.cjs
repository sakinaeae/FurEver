const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace all imports related to Firebase
content = content.replace(
  /import \{ db, auth, petsCollection, applicationsCollection, likesCollection, createLike, removeLike, createApplication, updateApplicationStatus, deleteApplication, deletePet \} from '\.\/lib\/db';\nimport \{ onSnapshot, query, where \} from 'firebase\/firestore';\nimport \{ updateLikesForCurrentUser \} from '\.\/lib\/db';\nimport \{ seedDatabaseIfEmpty \} from '\.\/lib\/seed';/g,
  `// Local state fallback imports
import { INITIAL_PETS } from './data/petsData';`
);

// We also need to remove 'updateLikesForCurrentUser' if it was imported differently, let's just wipe out all 'import ... from lib/db'
content = content.replace(/import \{.*\} from '\.\/lib\/db';\n/g, '');
content = content.replace(/import \{.*\} from 'firebase\/firestore';\n/g, '');
content = content.replace(/import \{ seedDatabaseIfEmpty \} from '\.\/lib\/seed';\n/g, '');

// Now we find the start of App component and replace the states.
const startHookStr = 'export default function App() {\n';
const hooksStartIdx = content.indexOf(startHookStr) + startHookStr.length;

// Let's rewrite the initial state definitions.
content = content.replace(
  /  const \[pets, setPets\] = useState<Pet\[\]>\(\[\]\);\n  const \[applications, setApplications\] = useState<AdoptionApplication\[\]>\(\[\]\);\n  const \[likedPetIds, setLikedPetIds\] = useState<string\[\]>\(\[\]\);/g,
  `  const [pets, setPets] = useState<Pet[]>(() => {
    const saved = localStorage.getItem('furever_pets');
    return saved ? JSON.parse(saved) : INITIAL_PETS;
  });
  const [applications, setApplications] = useState<AdoptionApplication[]>(() => {
    const saved = localStorage.getItem('furever_applications');
    return saved ? JSON.parse(saved) : [];
  });
  const [likedPetIds, setLikedPetIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('furever_likes');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => { localStorage.setItem('furever_pets', JSON.stringify(pets)); }, [pets]);
  useEffect(() => { localStorage.setItem('furever_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('furever_likes', JSON.stringify(likedPetIds)); }, [likedPetIds]);`
);

// Remove the massive useEffect that listens to Firestore
content = content.replace(
  /  \/\/ Initialize Firestore listeners\n  useEffect\(\(\) => \{[\s\S]*?  \}, \[\]\);\n\n  useEffect\(\(\) => \{[\s\S]*?  \}, \[userProfile\]\);/g,
  `  // Local storage profile sync
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('furever_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('furever_user_profile');
    }
  }, [userProfile]);`
);

// Rewrite the handlers to use local state instead of db.* functions
content = content.replace(
  /  const handleToggleFavorite = async \(petId: string, e: React\.MouseEvent\) => \{[\s\S]*?  \};/g,
  `  const handleToggleFavorite = async (petId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile) {
      setIsSignInModalOpen(true);
      return;
    }
    
    setLikedPetIds(prev => {
      if (prev.includes(petId)) return prev.filter(id => id !== petId);
      return [...prev, petId];
    });
  };`
);

content = content.replace(
  /  const handleUserSignIn = \(profile: UserProfile\) => \{/g,
  `  const handleUserSignIn = (profile: UserProfile) => {
    // Reassign listing IDs to the mock user if needed, but not strictly necessary for local mock`
);

content = content.replace(
  /  const handleApplySubmit = async \(applicationDetails: any\) => \{[\s\S]*?  \};/g,
  `  const handleApplySubmit = async (applicationDetails: any) => {
    if (!userProfile || !selectedPetForApplication) return;
    const newApp: AdoptionApplication = {
      id: 'app-' + Date.now(),
      petId: selectedPetForApplication.id,
      userId: userProfile.userId || '',
      petListerId: selectedPetForApplication.petListerId || 'system',
      petName: selectedPetForApplication.name,
      petBreed: selectedPetForApplication.breed,
      petImage: selectedPetForApplication.image,
      petType: selectedPetForApplication.animalType,
      petLocation: selectedPetForApplication.location,
      ...applicationDetails,
      dateApplied: new Date().toISOString(),
      currentStatus: 'Pending',
      eligibilityResult: 'APPLICABLE',
      ineligibilityReason: '',
    };
    setApplications(prev => [newApp, ...prev]);
    setPets(prev => prev.map(p => p.id === selectedPetForApplication.id ? { ...p, status: 'PENDING' } : p));
    showToast(\`🎉 Application for \${selectedPetForApplication.name} submitted!\`);
  };`
);

content = content.replace(
  /  const handleUpdateApplicationStatus = async \(appId: string, status: ApplicationStatus\) => \{[\s\S]*?  \};/g,
  `  const handleUpdateApplicationStatus = async (appId: string, status: ApplicationStatus) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, currentStatus: status } : a));
    
    const targetApp = applications.find(a => a.id === appId);
    if (status === 'Adopted' && targetApp) {
      setPets(prev => prev.map(p => p.id === targetApp.petId ? { ...p, status: 'ADOPTED' } : p));
    }
  };`
);

content = content.replace(
  /  const handleRemoveMatch = async \(petId: string\) => \{[\s\S]*?  \};/g,
  `  const handleRemoveMatch = async (petId: string) => {
    setLikedPetIds(prev => prev.filter(id => id !== petId));
  };`
);

content = content.replace(
  /  const handleDeleteApplication = async \(appId: string\) => \{[\s\S]*?  \};/g,
  `  const handleDeleteApplication = async (appId: string) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
    showToast('🗑️ Application withdrawn and deleted successfully.');
  };`
);

content = content.replace(
  /  const handleRemovePet = async \(petId: string\) => \{[\s\S]*?  \};/g,
  `  const handleRemovePet = async (petId: string) => {
    setPets(prev => prev.filter(p => p.id !== petId));
    showToast('Pet removed successfully.');
  };`
);

content = content.replace(
  /  const handlePetListed = async \(newPet: Pet\) => \{[\s\S]*?  \};/g,
  `  const handlePetListed = async (newPet: Pet) => {
    setPets(prev => [newPet, ...prev]);
  };`
);

fs.writeFileSync('src/App.tsx', content);
