import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CustomIcon } from './CustomIcon';
import { Pet, AdoptionApplication } from '../types';
import { PawIcon } from './PawDecorations';

interface AdoptionFormModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newApp: AdoptionApplication) => void;
  onGoToApplications: () => void;
}

export const AdoptionFormModal: React.FC<AdoptionFormModalProps> = ({
  pet,
  isOpen,
  onClose,
  onSubmitSuccess,
  onGoToApplications,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [housingType, setHousingType] = useState<'House with Yard' | 'Apartment' | 'Townhouse' | 'Farm / Acreage'>('Apartment');
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [petExperience, setPetExperience] = useState<'First-time owner' | 'Experienced' | 'Lifelong pet parent'>('Experienced');
  const [fitReason, setFitReason] = useState('');

  // UI state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<AdoptionApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !pet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !fitReason.trim()) {
      setErrorMessage('Looks like you missed something. Please complete the required fields.');
      return;
    }

    // Basic email check
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate Unique Application ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `FUR-2026-${randomNum}`;
      const now = new Date();
      const dateString = now.toISOString().split('T')[0];

      const newApplication: AdoptionApplication = {
        id: generatedId,
        petId: pet.id,
        petName: pet.name,
        petBreed: pet.breed,
        petImage: pet.image,
        petType: pet.animalType,
        petLocation: pet.location,
        applicantName: fullName.trim(),
        applicantEmail: email.trim(),
        applicantPhone: phone.trim(),
        applicantAddress: address.trim() || pet.location,
        housingType,
        hasOtherPets,
        petExperience,
        fitReason: fitReason.trim(),
        dateApplied: dateString,
        currentStatus: 'Pending',
        timelineNotes: {
          appliedAt: `${dateString} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          shelterNote: `Application successfully logged for ${pet.name}. Shelter coordinator is assigned to review your profile.`,
        },
      };

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FB4504', '#0F5C94', '#0F942D', '#F6D97B', '#9A5D16'],
        });
      } catch (err) {
        // Fallback gracefully if confetti fails
      }

      setIsSubmitting(false);
      setSubmittedApp(newApplication);
      onSubmitSuccess(newApplication);
    }, 600);
  };

  const handleResetModal = () => {
    setSubmittedApp(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        id="adoption-form-modal-card"
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-[8px_8px_0px_#0F5C94] border-3 border-[#0F5C94] my-8 animate-scaleUp"
      >
        {/* Close Button */}
        <button
          id="adoption-form-close-btn"
          onClick={handleResetModal}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white hover:bg-[#FB4504] hover:text-white text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all cursor-pointer"
          title="Close"
        >
          <CustomIcon name="cross" className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-5 border-b-3 border-[#0F5C94]">
          <h2 className="text-2xl sm:text-3xl font-titan text-[#0F5C94]">
            Let's get to know you.
          </h2>
          <p className="text-xs sm:text-sm text-[#0F5C94]/85 font-bold mt-0.5">
            Applying to adopt <strong className="text-[#FB4504]">{pet.name}</strong> ({pet.breed})
          </p>

          {/* Quick Pet Mini Header Card */}
          <div className="mt-3 flex items-center gap-3 bg-white p-2.5 rounded-xl border-2 border-[#0F5C94]/30">
            <img src={pet.image} alt={pet.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover object-center border border-[#0F5C94] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-titan text-[#0F5C94] text-base truncate">{pet.name}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FAF5EB] text-[#9A5D16] border border-[#0F5C94]/20">
                  {pet.age} · {pet.gender}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#0F5C94]/70 truncate">{pet.location} · {pet.shelterName}</p>
            </div>
          </div>
        </div>

        {/* SUCCESS VIEW */}
        {submittedApp ? (
          <div className="p-7 sm:p-9 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#EBF7EE] text-[#0F942D] border-2 border-[#0F942D] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#0F942D]">
              <CustomIcon name="circle-tick" className="w-10 h-10" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-[#FAF5EB] border border-[#0F5C94]/30 text-[#9A5D16] text-[11px] font-black uppercase">
                Reference ID: {submittedApp.id}
              </span>
              <h3 className="text-2xl sm:text-3xl font-titan text-[#0F5C94] mt-2">
                Application submitted!
              </h3>
              <p className="text-sm font-black text-[#0F942D] mt-1">
                Your application is now under review.
              </p>
              <p className="text-xs sm:text-sm text-[#0F5C94]/85 max-w-md mx-auto mt-2 leading-relaxed font-medium">
                Thank you, <strong>{submittedApp.applicantName}</strong>! The adoption coordinator for {submittedApp.petName} has received your application. You can track all stages and shelter feedback in My Applications.
              </p>
            </div>

            {/* Quick Status Preview */}
            <div className="bg-[#FAF5EB] p-4 rounded-xl border-2 border-[#0F5C94]/30 max-w-md mx-auto text-left text-xs space-y-1.5 font-bold">
              <div className="flex justify-between">
                <span className="text-[#0F5C94]/60">Applicant:</span>
                <span className="text-[#0F5C94]">{submittedApp.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0F5C94]/60">Pet:</span>
                <span className="text-[#0F5C94]">{submittedApp.petName} ({submittedApp.petBreed})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0F5C94]/60">Date:</span>
                <span className="text-[#0F5C94]">{submittedApp.dateApplied}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[#0F5C94]/20">
                <span className="text-[#0F5C94]/60">Initial Status:</span>
                <span className="text-[#0F942D] font-black">● Under Review / Pending</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                id="modal-success-view-applications-btn"
                onClick={() => {
                  handleResetModal();
                  onGoToApplications();
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0F942D] hover:bg-[#0b7423] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Track Status</span>
                <CustomIcon name="right-arrow" className="w-4 h-4" />
              </button>

              <button
                id="modal-success-browse-more-btn"
                onClick={handleResetModal}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-[#F6D97B] text-[#0F5C94] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] cursor-pointer"
              >
                Browse More Pets
              </button>
            </div>
          </div>
        ) : (
          /* APPLICATION INPUT FORM */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4 max-h-[60vh] overflow-y-auto">
            
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black flex items-center gap-2">
                <CustomIcon name="exclamation" className="w-4 h-4 shrink-0 text-[#FB4504]" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Field: Full Name */}
            <div>
              <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CustomIcon name="user" className="w-3.5 h-3.5 text-[#9A5D16]" />
                Full Name <span className="text-[#FB4504]">*</span>
              </label>
              <input
                id="app-input-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Deshmukh"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white"
              />
            </div>

            {/* Field: Contact Number & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CustomIcon name="mail" className="w-3.5 h-3.5 text-[#9A5D16]" />
                  Email Address <span className="text-[#FB4504]">*</span>
                </label>
                <input
                  id="app-input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. maya@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CustomIcon name="phone" className="w-3.5 h-3.5 text-[#9A5D16]" />
                  Contact Number <span className="text-[#FB4504]">*</span>
                </label>
                <input
                  id="app-input-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98200 12345"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white"
                />
              </div>
            </div>

            {/* Field: Housing & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CustomIcon name="home" className="w-3.5 h-3.5 text-[#9A5D16]" />
                  Housing Type
                </label>
                <select
                  id="app-select-housing"
                  value={housingType}
                  onChange={(e) => setHousingType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94] focus:outline-none focus:border-[#0F5C94] focus:bg-white"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House with Yard">House with Yard</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Farm / Acreage">Farm / Acreage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CustomIcon name="sparkle" className="w-3.5 h-3.5 text-[#9A5D16]" />
                  Pet Experience
                </label>
                <select
                  id="app-select-experience"
                  value={petExperience}
                  onChange={(e) => setPetExperience(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-black text-[#0F5C94] focus:outline-none focus:border-[#0F5C94] focus:bg-white"
                >
                  <option value="Experienced">Experienced pet parent</option>
                  <option value="First-time owner">First-time pet owner</option>
                  <option value="Lifelong pet parent">Lifelong pet parent</option>
                </select>
              </div>
            </div>

            {/* Field: Why fit? */}
            <div>
              <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CustomIcon name="message" className="w-3.5 h-3.5 text-[#9A5D16]" />
                Why would you be a good fit for this pet? <span className="text-[#FB4504]">*</span>
              </label>
              <textarea
                id="app-textarea-fit-reason"
                value={fitReason}
                onChange={(e) => setFitReason(e.target.value)}
                placeholder={`Tell us a little about your daily routine, home environment, and why ${pet.name} would be happy with you...`}
                rows={3}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="app-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-sm tracking-wider uppercase border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>ADOPTING NOW...</span>
                ) : (
                  <>
                    <PawIcon className="w-4 h-4 fill-white" />
                    <span>ADOPT NOW!</span>
                  </>
                )}
              </button>

              <p className="text-center text-[10px] font-bold text-[#0F5C94]/60 mt-2">
                By submitting, you agree to a standard home check and coordinator verification.
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
