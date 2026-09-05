import React, { useState, useEffect } from 'react';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';
import { Pet } from '../backend/types';
import { UserProfile } from './UserSignInModal';

interface ListPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetListed: (newPet: Pet) => void;
  currentProfile?: UserProfile | null;
}

const COMMON_BREEDS = [
  'Golden Retriever',
  'Indie',
  'Beagle',
  'German Shepherd',
  'Poodle',
  'Bulldog',
  'Labrador',
  'Persian',
  'Siamese',
  'Maine Coon',
  'British Shorthair',
  'Ragdoll',
  'Lop',
  'Netherland Dwarf',
  'Lionhead',
];

const BANGALORE_LOCALITIES = [
  'Indiranagar',
  'Koramangala',
  'Whitefield',
  'HSR Layout',
  'Jayanagar',
  'JP Nagar',
  'Hebbal',
  'Sarjapur Road',
  'Sadashivanagar',
  'Banashankari',
  'Yelahanka',
  'Kalyan Nagar',
  'Rajajinagar',
  'Basavanagudi',
  'Malleshwaram',
  'Ulsoor',
  'Marathahalli',
  'Bellandur',
];

export const ListPetModal: React.FC<ListPetModalProps> = ({
  isOpen,
  onClose,
  onPetListed,
  currentProfile,
}) => {
  const [petName, setPetName] = useState('');
  const [animalType, setAnimalType] = useState<'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other' | ''>('');
  
  // Breed Selection State
  const [selectedBreed, setSelectedBreed] = useState('');
  const [customBreed, setCustomBreed] = useState('');
  
  // Numeric Inputs
  const [ageNum, setAgeNum] = useState('');
  const [weightNum, setWeightNum] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  
  // Location Selection State
  const [selectedLocality, setSelectedLocality] = useState('');
  const [customLocality, setCustomLocality] = useState('');

  // Medical Information Fields
  const [isVaccinated, setIsVaccinated] = useState(true);
  const [isSpayedNeutered, setIsSpayedNeutered] = useState(true);
  const [isMicrochipped, setIsMicrochipped] = useState(true);
  const [healthNotes, setHealthNotes] = useState('Fully vaccinated & active');

  const [description, setDescription] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [ownerName, setOwnerName] = useState(currentProfile?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(currentProfile?.phone || '');
  const [ownerEmail, setOwnerEmail] = useState(currentProfile?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newlyCreatedPet, setNewlyCreatedPet] = useState<Pet | null>(null);

  // Dynamic traits/personality tags (up to 5)
  const [traits, setTraits] = useState<string[]>(['Friendly', 'Playful', 'Loving']);
  const [customTrait, setCustomTrait] = useState('');

  const popularTraits = ['Friendly', 'Playful', 'Calm', 'Energetic', 'Loving', 'Smart', 'Shy', 'Independent', 'Cuddly', 'Protective'];

  // Reset breed when animal type changes to force manual selection
  useEffect(() => {
    setSelectedBreed('');
    setCustomBreed('');
  }, [animalType]);

  // Pre-fill contact details when currentProfile finishes loading or changes
  useEffect(() => {
    if (currentProfile) {
      if (!ownerName) setOwnerName(currentProfile.name || '');
      if (!ownerPhone) setOwnerPhone(currentProfile.phone || '');
      if (!ownerEmail) setOwnerEmail(currentProfile.email || '');
    }
  }, [currentProfile]);

  const handleAddTrait = (traitToAdd: string) => {
    const trimmed = traitToAdd.trim();
    if (!trimmed) return;
    if (traits.includes(trimmed)) return;
    if (traits.length >= 5) {
      setError('You can select or add up to 5 personality traits.');
      return;
    }
    setTraits([...traits, trimmed]);
    setError(null);
  };

  const handleRemoveTrait = (traitToRemove: string) => {
    setTraits(traits.filter(t => t !== traitToRemove));
  };

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP, etc.).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size is too large. Please select an image under 10MB.');
      return;
    }

    setError(null);
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setUploadedImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!uploadedImagePreview) {
      setError('Please upload a photo of your pet before submitting.');
      return;
    }

    if (!petName.trim()) {
      setError('Please provide a pet name.');
      return;
    }

    if (description.trim().length < 40) {
      setError(`Pet Story & Behavior Notes must be at least 40 characters long (currently ${description.trim().length} characters).`);
      return;
    }

    if (!animalType) {
      setError('Please select an animal type.');
      return;
    }

    if (!gender) {
      setError('Please select a gender.');
      return;
    }

    if (!selectedLocality) {
      setError('Please select a pet location locality.');
      return;
    }

    // Determine final breed
    const finalBreed = selectedBreed === 'Other' ? customBreed.trim() : selectedBreed;
    if (!selectedBreed) {
      setError('Please select a breed.');
      return;
    }
    if (selectedBreed === 'Other' && !customBreed.trim()) {
      setError('Please type your custom breed.');
      return;
    }

    // Validate Age
    const ageInteger = parseInt(ageNum, 10);
    if (isNaN(ageInteger) || ageInteger < 0 || ageInteger > 100) {
      setError('Age must be a valid number between 0 and 100 years.');
      return;
    }

    // Validate Weight
    const weightInteger = parseInt(weightNum, 10);
    if (isNaN(weightInteger) || weightInteger < 1 || weightInteger > 99) {
      setError('Weight must be a valid 1 or 2-digit number (1-99 kg).');
      return;
    }

    // Determine Location
    const finalLocation = selectedLocality === 'Other' 
      ? `${customLocality.trim() || 'Bengaluru'}` 
      : `${selectedLocality}, Bengaluru`;

    if (!ownerName.trim() || !ownerPhone.trim()) {
      setError('Please provide your foster/owner contact details.');
      return;
    }

    if (/\d/.test(petName)) {
      setError('Pet Name must not contain numbers.');
      return;
    }

    if (/\d/.test(ownerName)) {
      setError('Your Name must not contain numbers.');
      return;
    }

    if (ownerPhone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (ownerEmail.trim() && !emailRegex.test(ownerEmail.trim())) {
      setError('Please provide a valid standard email address.');
      return;
    }

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      petListerId: currentProfile?.userId || 'default-lister',
      name: petName.trim(),
      animalType,
      breed: finalBreed,
      age: `${ageInteger} Years`,
      ageCategory: ageInteger < 2 ? 'Young' : ageInteger < 8 ? 'Adult' : 'Senior',
      gender,
      weight: `${weightInteger} kg`,
      location: finalLocation,
      image: uploadedImagePreview,
      description: description.trim(),
      medicalInfo: {
        vaccinated: isVaccinated,
        spayedNeutered: isSpayedNeutered,
        microchipped: isMicrochipped,
        healthNotes: healthNotes.trim() || 'Health verified by foster parent',
      },
      goodWith: ['Families', 'Kids', 'Friendly Homes'],
      personality: traits,
      shelterName: `${ownerName.trim()}'s Foster Home`,
      status: 'AVAILABLE',
      activityLevel: 'Moderate',
      adoptionFee: 'Free Adoption',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    // Send newly listed pet data to Express Backend API
    fetch('/api/adoption-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'PET_LISTING',
        pet: newPet,
        owner: {
          name: ownerName.trim(),
          phone: ownerPhone.trim(),
          email: ownerEmail.trim(),
        },
      }),
    }).catch((err) => console.warn('[Backend Notice] Pet listing fallback to local state:', err));

    onPetListed(newPet);
    setNewlyCreatedPet(newPet);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setPetName('');
    setAgeNum('');
    setWeightNum('');
    setSelectedBreed('');
    setCustomBreed('');
    setSelectedLocality('Indiranagar');
    setCustomLocality('');
    setDescription('');
    setIsVaccinated(true);
    setIsSpayedNeutered(true);
    setIsMicrochipped(true);
    setHealthNotes('Fully vaccinated & active');
    setUploadedImagePreview(null);
    setUploadedFileName('');
    setTraits(['Friendly', 'Playful', 'Loving']);
    setCustomTrait('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        id="list-pet-modal-card"
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-[8px_8px_0px_#0F5C94] border-3 border-[#0F5C94] my-8 animate-scaleUp"
      >
        {/* Close button */}
        <button
          id="list-pet-close-btn"
          onClick={handleReset}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white hover:bg-[#FB4504] hover:text-white text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all cursor-pointer"
          title="Close"
        >
          <CustomIcon name="cross" className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-5 border-b-3 border-[#0F5C94]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F6D97B] text-[#0F5C94] text-xs font-black uppercase tracking-wider mb-2 border-2 border-[#0F5C94]">
            <PawIcon className="w-3.5 h-3.5 fill-[#0F5C94]" />
            <span>FOSTER & PET OWNER PORTAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-titan text-[#0F5C94]">
            PUT A PET UP FOR ADOPTION
          </h2>
          <p className="text-xs sm:text-sm text-[#0F5C94]/85 font-bold mt-0.5">
            List a rescue or foster pet so loving families across Bengaluru can discover and apply!
          </p>
        </div>

        {/* SUCCESS VIEW */}
        {isSuccess && newlyCreatedPet ? (
          <div className="p-7 sm:p-9 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-2xl bg-[#EBF7EE] text-[#0F942D] border-3 border-[#0F942D] flex items-center justify-center mx-auto shadow-[4px_4px_0px_#0F942D]">
              <CustomIcon name="circle-tick" className="w-12 h-12" />
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl sm:text-4xl font-titan text-[#0F5C94]">
                {newlyCreatedPet.name} is now listed!
              </h3>
              <p className="text-sm sm:text-base text-[#0F942D] font-black">
                Your pet listing is now live on FurEver.
              </p>
              <p className="text-xs sm:text-sm text-[#0F5C94]/85 max-w-md mx-auto font-medium">
                Adopters can now view {newlyCreatedPet.name} in the browse grid and swipe deck to submit adoption applications directly to you.
              </p>
            </div>

            <div className="bg-[#FAF5EB] p-4 rounded-2xl border-2 border-[#0F5C94]/30 max-w-sm mx-auto flex items-center gap-3 text-left">
              <img
                src={newlyCreatedPet.image}
                alt={newlyCreatedPet.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border-2 border-[#0F5C94]"
              />
              <div>
                <span className="font-titan text-base text-[#0F5C94] block">{newlyCreatedPet.name}</span>
                <span className="text-xs font-bold text-[#9A5D16]">{newlyCreatedPet.breed} · {newlyCreatedPet.age}</span>
                <span className="text-[10px] font-black uppercase text-[#0F942D] block mt-0.5">● Listed & Active</span>
              </div>
            </div>

            <div className="pt-2 max-w-xs mx-auto">
              <button
                id="list-pet-done-btn"
                onClick={handleReset}
                className="w-full py-3.5 px-6 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              >
                DONE & SEE LISTINGS
              </button>
            </div>
          </div>
        ) : (
          /* INPUT FORM */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 max-h-[65vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black flex items-center gap-2">
                <CustomIcon name="exclamation" className="w-4 h-4 shrink-0 text-[#FB4504]" />
                <span>{error}</span>
              </div>
            )}

            {/* Row 1: Pet Name & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                  Pet Name <span className="text-[#FB4504]">*</span>
                </label>
                <input
                  id="list-pet-input-name"
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value.replace(/[0-9]/g, ''))}
                  placeholder="e.g. Milo, Bella, Bruno"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                  Animal Type <span className="text-[#FB4504]">*</span>
                </label>
                <select
                  id="list-pet-select-type"
                  value={animalType}
                  onChange={(e) => setAnimalType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94] focus:outline-none focus:border-[#0F5C94] focus:bg-white"
                >
                  <option value="" disabled>Select Animal Type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Row 2: Breed & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                  Breed / Variant <span className="text-[#FB4504]">*</span>
                </label>
                <select
                  value={selectedBreed}
                  onChange={(e) => setSelectedBreed(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94] focus:outline-none focus:border-[#0F5C94]"
                >
                  <option value="" disabled>Select Breed</option>
                  {COMMON_BREEDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option value="Other">Other (Type custom breed)</option>
                </select>
                {selectedBreed === 'Other' && (
                  <input
                    type="text"
                    value={customBreed}
                    onChange={(e) => setCustomBreed(e.target.value)}
                    placeholder="Enter breed name..."
                    required
                    className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                  Age (Years) <span className="text-[#FB4504]">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={ageNum}
                  onChange={(e) => setAgeNum(e.target.value)}
                  placeholder="e.g. 2 (Only numbers <= 100)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40"
                />
              </div>
            </div>

            {/* Row 3: Gender & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                  Gender <span className="text-[#FB4504]">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94]"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                  Weight (kg) <span className="text-[#FB4504]">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={weightNum}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 2) {
                      setWeightNum(val);
                    }
                  }}
                  placeholder="e.g. 12 (Max 2 digits)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40"
                />
              </div>
            </div>

            {/* Row 4: Pet Location Dropdown (Matching rest of app) */}
            <div>
              <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1">
                <CustomIcon name="location" className="w-3.5 h-3.5 text-[#9A5D16]" />
                Pet Location / Locality <span className="text-[#FB4504]">*</span>
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94] focus:outline-none focus:border-[#0F5C94]"
              >
                <option value="" disabled>Select Locality</option>
                {BANGALORE_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
                <option value="Other">Other (Custom area)</option>
              </select>
              {selectedLocality === 'Other' && (
                <input
                  type="text"
                  value={customLocality}
                  onChange={(e) => setCustomLocality(e.target.value)}
                  placeholder="Type Bangalore locality name..."
                  required
                  className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40"
                />
              )}
            </div>

            {/* NEW: Comprehensive Medical Data Inputs */}
            <div className="p-4 rounded-2xl border-2 border-[#F6D97B] bg-[#FFFBEA] space-y-3.5 shadow-xs">
              <span className="text-xs font-black uppercase text-[#9A5D16] tracking-wider flex items-center gap-1">
                Medical & Veterinary Records
              </span>

              <div className="grid grid-cols-3 gap-2">
                <label className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-[#0F5C94]/15 hover:border-[#0F5C94]/30 cursor-pointer text-center">
                  <span className="text-[10px] font-black text-stone-500 uppercase">Vaccinated</span>
                  <input
                    type="checkbox"
                    checked={isVaccinated}
                    onChange={(e) => setIsVaccinated(e.target.checked)}
                    className="w-4 h-4 mt-1.5 accent-[#0F5C94] cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-[#0F5C94] mt-1">{isVaccinated ? 'Yes' : 'No'}</span>
                </label>

                <label className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-[#0F5C94]/15 hover:border-[#0F5C94]/30 cursor-pointer text-center">
                  <span className="text-[10px] font-black text-stone-500 uppercase">Spayed/Neutered</span>
                  <input
                    type="checkbox"
                    checked={isSpayedNeutered}
                    onChange={(e) => setIsSpayedNeutered(e.target.checked)}
                    className="w-4 h-4 mt-1.5 accent-[#0F5C94] cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-[#0F5C94] mt-1">{isSpayedNeutered ? 'Yes' : 'No'}</span>
                </label>

                <label className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-[#0F5C94]/15 hover:border-[#0F5C94]/30 cursor-pointer text-center">
                  <span className="text-[10px] font-black text-stone-500 uppercase">Microchipped</span>
                  <input
                    type="checkbox"
                    checked={isMicrochipped}
                    onChange={(e) => setIsMicrochipped(e.target.checked)}
                    className="w-4 h-4 mt-1.5 accent-[#0F5C94] cursor-pointer"
                  />
                  <span className="text-[10px] font-bold text-[#0F5C94] mt-1">{isMicrochipped ? 'Yes' : 'No'}</span>
                </label>
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#9A5D16] uppercase mb-1">Health & Medical Notes</label>
                <input
                  type="text"
                  value={healthNotes}
                  onChange={(e) => setHealthNotes(e.target.value)}
                  placeholder="e.g. Fully vaccinated & dewormed"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#0F5C94]/20 text-xs font-bold text-[#0F5C94]"
                />
              </div>
            </div>

            {/* Upload Pet Photo Section */}
            <div>
              <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>
                  Upload Pet Photo <span className="text-[#FB4504]">*</span>
                </span>
                <span className="text-[10px] text-[#0F5C94]/70 font-bold">PNG, JPG, WEBP (Max 10MB)</span>
              </label>

              {/* If image uploaded -> Show Preview Card */}
              {uploadedImagePreview ? (
                <div className="relative p-3 bg-[#FAF5EB] rounded-2xl border-2 border-[#0F5C94] flex items-center gap-4 animate-fadeIn shadow-[3px_3px_0px_#0F5C94]">
                  <img
                    src={uploadedImagePreview}
                    alt="Uploaded pet preview"
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-[#0F5C94] shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-black text-[#0F5C94] block truncate">
                      {uploadedFileName || 'Pet Photo Ready'}
                    </span>
                    <span className="text-[11px] font-bold text-[#0F942D] flex items-center gap-1 mt-0.5">
                      <CustomIcon name="circle-tick" className="w-3.5 h-3.5" />
                      Image loaded & ready to post
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImagePreview(null);
                        setUploadedFileName('');
                      }}
                      className="mt-2 text-[11px] font-black text-[#FB4504] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>✕ Remove / Upload different photo</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Drag & Drop File Upload Area */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer bg-[#FAF5EB] ${
                    isDragOver
                      ? 'border-[#FB4504] bg-[#F6D97B]/30 scale-[1.01]'
                      : 'border-[#0F5C94]/40 hover:border-[#0F5C94] hover:bg-[#FAF5EB]/80'
                  }`}
                >
                  <input
                    id="list-pet-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#0F5C94] text-[#FB4504] flex items-center justify-center shadow-[2px_2px_0px_#0F5C94]">
                      <CustomIcon name="paw" className="w-6 h-6 text-[#FB4504]" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#0F5C94] uppercase tracking-wider">
                        Drag & Drop Pet Photo Here
                      </p>
                      <p className="text-xs text-[#0F5C94]/80 font-bold mt-0.5">
                        or <span className="text-[#FB4504] underline">browse files</span> from your computer or phone
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Personality & Traits Tags Selector (Up to 5) */}
            <div className="p-4 rounded-2xl border-2 border-[#0F5C94]/30 bg-[#FAF5EB]/50 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider">
                  Personality & Traits <span className="text-[#0F5C94]/60">(Select or Add up to 5)</span>
                </label>
                <span className="text-[10px] font-black text-[#0F5C94]/70 bg-white px-2 py-0.5 rounded-md border border-[#0F5C94]/20">
                  {traits.length}/5 Selected
                </span>
              </div>

              {/* Popular Selectable Tags */}
              <div className="flex flex-wrap gap-1.5">
                {popularTraits.map((trait) => {
                  const isSelected = traits.includes(trait);
                  return (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => isSelected ? handleRemoveTrait(trait) : handleAddTrait(trait)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F5C94] text-white border-[#0F5C94] shadow-[1px_1px_0px_#FB4504]'
                          : 'bg-white text-[#0F5C94] border-[#0F5C94]/20 hover:border-[#0F5C94]/40'
                      }`}
                    >
                      {trait} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTrait}
                  onChange={(e) => setCustomTrait(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTrait(customTrait);
                      setCustomTrait('');
                    }
                  }}
                  placeholder="Type custom trait (e.g. Toilet Trained)"
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#0F5C94]/30 text-xs font-bold text-[#0F5C94]"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddTrait(customTrait);
                    setCustomTrait('');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0F5C94] text-white hover:bg-[#0b4875] font-black text-xs uppercase tracking-wider border border-[#0F5C94] cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Selected tags list */}
              {traits.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-[#0F5C94]/10">
                  <span className="text-[10px] font-black text-[#9A5D16] uppercase self-center mr-1">Your tags:</span>
                  {traits.map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black bg-white text-[#FB4504] border border-[#FB4504]/30 shadow-xs"
                    >
                      {trait}
                      <button
                        type="button"
                        onClick={() => handleRemoveTrait(trait)}
                        className="text-[#FB4504] hover:text-[#e03a00] font-black ml-1 text-[11px] cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description / Story */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider">
                  Pet Story & Behavior Notes <span className="text-[#FB4504]">*</span>
                </label>
                <span className={`text-[10px] font-black uppercase tracking-wider ${description.trim().length < 40 ? 'text-[#FB4504]' : 'text-[#0F942D]'}`}>
                  {description.trim().length} / 40 min chars
                </span>
              </div>
              <textarea
                id="list-pet-textarea-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe their temperament, health condition, vaccine status, and what kind of home would make them happiest..."
                rows={3}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white resize-none"
              />
            </div>

            {/* Foster / Owner Contact Info */}
            <div className="bg-[#FAF5EB] p-3.5 rounded-2xl border-2 border-[#0F5C94]/30 space-y-2.5">
              <span className="text-xs font-black uppercase text-[#9A5D16] tracking-wider block">
                Foster / Owner Contact Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value.replace(/[0-9]/g, ''))}
                  placeholder="Your Full Name *"
                  required
                  className="px-3 py-2 rounded-xl bg-stone-100 border border-stone-300 text-xs text-[#0F5C94] font-bold placeholder-stone-400 focus:bg-white focus:outline-none"
                />
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, '');
                    if (onlyDigits.length <= 10) {
                      setOwnerPhone(onlyDigits);
                    }
                  }}
                  placeholder="Phone Number *"
                  required
                  className="px-3 py-2 rounded-xl bg-stone-100 border border-stone-300 text-xs text-[#0F5C94] font-bold placeholder-stone-400 focus:bg-white focus:outline-none"
                />
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="Email Address"
                  className="px-3 py-2 rounded-xl bg-stone-100 border border-stone-300 text-xs text-[#0F5C94] font-bold placeholder-stone-400 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="list-pet-submit-btn"
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0F942D] hover:bg-[#0b7523] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PawIcon className="w-4 h-4 fill-white" />
                <span>POST PET FOR ADOPTION</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
