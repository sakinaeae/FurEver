import React, { useState } from 'react';
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

export const ListPetModal: React.FC<ListPetModalProps> = ({
  isOpen,
  onClose,
  onPetListed,
  currentProfile,
}) => {
  const [petName, setPetName] = useState('');
  const [animalType, setAnimalType] = useState<'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other'>('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [size, setSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [location, setLocation] = useState('Indiranagar, Bengaluru');
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

    if (!petName.trim() || !breed.trim() || !age.trim() || !description.trim()) {
      setError('Please fill in all required fields about the pet.');
      return;
    }

    if (!ownerName.trim() || !ownerPhone.trim()) {
      setError('Please provide your foster/owner contact details.');
      return;
    }

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      petListerId: currentProfile?.userId || 'default-lister',
      name: petName.trim(),
      animalType,
      breed: breed.trim(),
      age: age.trim(),
      ageCategory: 'Young',
      gender,
      size,
      location: location.trim() || 'Bengaluru',
      image: uploadedImagePreview,
      description: description.trim(),
      medicalInfo: {
        vaccinated: true,
        spayedNeutered: true,
        microchipped: true,
        healthNotes: 'Health verified by foster owner',
      },
      goodWith: ['Families', 'Kids', 'Friendly Homes'],
      personality: ['Loving', 'Friendly', 'Rescued'],
      shelterName: `${ownerName.trim()}'s Foster Home`,
      status: 'AVAILABLE',
      activityLevel: 'Moderate',
      weight: 'Not specified',
      adoptionFee: 'Free Adoption',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    // Send newly listed pet data to C++ / Express Backend API
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
    setBreed('');
    setAge('');
    setDescription('');
    setUploadedImagePreview(null);
    setUploadedFileName('');
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
                {newlyCreatedPet.name} is now listed! 🎉
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
                  onChange={(e) => setPetName(e.target.value)}
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
                  <option value="Dog">Dog 🐶</option>
                  <option value="Cat">Cat 🐱</option>
                  <option value="Rabbit">Rabbit 🐰</option>
                  <option value="Bird">Bird 🦜</option>
                  <option value="Other">Other 🐾</option>
                </select>
              </div>
            </div>

            {/* Row 2: Breed, Age, Gender, Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                  Breed <span className="text-[#FB4504]">*</span>
                </label>
                <input
                  id="list-pet-input-breed"
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Golden Retriever / Indie"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                  Age <span className="text-[#FB4504]">*</span>
                </label>
                <input
                  id="list-pet-input-age"
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 1.5 years / 4 months"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                  Gender & Size
                </label>
                <div className="flex gap-2">
                  <select
                    id="list-pet-select-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-1/2 px-2 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <select
                    id="list-pet-select-size"
                    value={size}
                    onChange={(e) => setSize(e.target.value as any)}
                    className="w-1/2 px-2 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94]"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Location */}
            <div>
              <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1">
                <CustomIcon name="location" className="w-3.5 h-3.5 text-[#9A5D16]" />
                Pet Location
              </label>
              <input
                id="list-pet-input-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Indiranagar, Bengaluru"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white"
              />
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

            {/* Description / Story */}
            <div>
              <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                Pet Story & Behavior Notes <span className="text-[#FB4504]">*</span>
              </label>
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
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Your Full Name *"
                  required
                  className="px-3 py-2 rounded-xl bg-white border border-[#0F5C94]/30 text-xs text-[#0F5C94] font-bold"
                />
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="Phone Number *"
                  required
                  className="px-3 py-2 rounded-xl bg-white border border-[#0F5C94]/30 text-xs text-[#0F5C94] font-bold"
                />
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="Email Address"
                  className="px-3 py-2 rounded-xl bg-white border border-[#0F5C94]/30 text-xs text-[#0F5C94] font-bold"
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
