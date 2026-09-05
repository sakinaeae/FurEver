import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CustomIcon } from './CustomIcon';
import { Pet, AdoptionApplication } from '../backend/types';
import { UserProfile } from './UserSignInModal';
import { PawIcon } from './PawDecorations';

interface AdoptionFormModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newApp: AdoptionApplication) => void;
  onExplorePets: () => void;
  onTrackStatus?: () => void;
  currentProfile?: UserProfile | null;
  applications?: AdoptionApplication[];
}

type EligibilityResult = {
  isApplicable: boolean;
  reason?: string;
};

export const AdoptionFormModal: React.FC<AdoptionFormModalProps> = ({
  pet,
  isOpen,
  onClose,
  onSubmitSuccess,
  onExplorePets,
  onTrackStatus,
  currentProfile,
  applications = [],
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [hasOtherPets, setHasOtherPets] = useState(false);
  const [petExperience, setPetExperience] = useState<'First-time owner' | 'Experienced' | 'Lifelong pet parent'>('Experienced');
  const [fitReason, setFitReason] = useState('');

  // UI & Result states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user profile when modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      if (currentProfile) {
        if (!fullName) setFullName(currentProfile.name);
        if (!email) setEmail(currentProfile.email);
        if (!phone) setPhone(currentProfile.phone);
      }
    }
  }, [isOpen, currentProfile]);

  if (!isOpen || !pet) return null;

  // Real-time word count calculation for fitReason
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const wordCount = getWordCount(fitReason);

  // Eligibility Evaluation Function
  const checkEligibility = (
    fitText: string,
    housing: string,
    experience: string,
    targetPet: Pet
  ): EligibilityResult => {
    // Rule 1 — Fit response length check (< 40 words)
    const count = getWordCount(fitText);
    if (count < 40) {
      return {
        isApplicable: false,
        reason: 'Please provide a more detailed response about why you would be a good fit for this pet. A minimum of 40 words is required.',
      };
    }

    // Rule 2 — Housing suitability check
    // Large or high-energy pets, or pets requiring a yard, are not suitable for small apartments without yard
    const isLargePet = targetPet.activityLevel === 'High';
    const requiresYard = targetPet.goodWith?.some((g) =>
      ['Yard Homes', 'Fenced Yard', 'Farm Life', 'Spacious Homes', 'Active Runners'].includes(g)
    );

    if ((isLargePet || requiresYard) && housing === 'Apartment') {
      return {
        isApplicable: false,
        reason: 'This pet requires a larger living space or a house with a yard suitable for their size and energy level.',
      };
    }

    // Rule 3 — Pet experience check
    const requiresExperiencedOwner = targetPet.goodWith?.some((g) =>
      ['Experienced Owners', 'Experienced Handlers', 'Experienced'].includes(g)
    ) || targetPet.personality?.some((p) =>
      ['Protective', 'Genius', 'Focused', 'Athletic'].includes(p)
    );

    if (requiresExperiencedOwner && experience === 'First-time owner') {
      return {
        isApplicable: false,
        reason: 'This pet requires an adopter with more experience caring for animals.',
      };
    }

    // All rules passed!
    return { isApplicable: true };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const alreadyApplied = applications.some(app => app.petId === pet.id);
    if (alreadyApplied) {
      setErrorMessage('This pet is already under the adoption process and cannot accept further applications.');
      return;
    }

    // Basic Input Validation
    if (!fullName.trim() || !email.trim() || !phone.trim() || !fitReason.trim()) {
      setErrorMessage('Looks like you missed something. Please complete the required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Perform Eligibility Check
    const result = checkEligibility(fitReason, currentProfile?.housingType || 'Apartment', currentProfile?.petExperience || 'No experience', pet);

    if (!result.isApplicable) {
      // OUTCOME B — NOT APPLICABLE
      setIsSubmitting(false);
      setEligibilityResult(result);
      return;
    }

    // OUTCOME A — APPLICABLE
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
      housingType: currentProfile?.housingType || 'Apartment',
      hasOtherPets,
      petExperience: currentProfile?.petExperience || 'No experience',
      fitReason: fitReason.trim(),
      dateApplied: dateString,
      eligibilityResult: 'APPLICABLE',
      ineligibilityReason: ''
    };

    // Fire celebratory confetti for Outcome A
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FB4504', '#0F5C94', '#0F942D', '#F6D97B', '#9A5D16'],
      });
    } catch (err) {
      // Fallback if confetti is blocked
    }

    // Send to C++ / Express Backend API
    fetch('/api/adoption-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApplication),
    })
    .then(async (res) => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit application');
      }
      return res.json();
    })
    .then(() => {
        setIsSubmitting(false);
        setEligibilityResult({ isApplicable: true });
        onSubmitSuccess(newApplication);
    })
    .catch((err) => {
      console.error(err);
      setErrorMessage(err.message);
      setIsSubmitting(false);
    });
  };

  const handleResetModal = () => {
    setEligibilityResult(null);
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
              <p className="text-xs font-semibold text-[#0F5C94]/70 truncate">{pet.location} · {pet.shelterName || 'Furever Shelter'}</p>
            </div>
          </div>
        </div>

        {/* OUTCOME A — SUCCESSFUL / APPLICABLE VIEW */}
        {eligibilityResult?.isApplicable ? (
          <div className="p-7 sm:p-9 text-center space-y-6 animate-fadeIn bg-emerald-50/20">
            {/* Pop-up Alert Card */}
            <div className="bg-white p-6 rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F942D] max-w-md mx-auto space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-2xl bg-[#EBF7EE] text-[#0F942D] border-2 border-[#0F5C94] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#0F942D]">
                <CustomIcon name="circle-tick" className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EBF7EE] text-[#0F942D] border border-[#0F942D]/20 animate-pulse">
                  System Pre-Approval Verified
                </span>
                <h3 className="text-2xl sm:text-3xl font-titan text-[#0F5C94]">
                  You are eligible! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-[#0F5C94] font-black leading-relaxed">
                  The pet lister will contact you shortly.
                </p>
              </div>

              <div className="bg-[#FAF5EB] p-3 rounded-2xl border-2 border-dashed border-[#0F5C94]/20 text-[11px] text-[#9A5D16] font-bold">
                🐾 Your contact details and adoption compatibility scores have been successfully delivered to the foster's dashboard.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 max-w-sm mx-auto flex flex-col sm:flex-row gap-3 justify-center">
              {onTrackStatus && (
                <button
                  type="button"
                  onClick={() => {
                    handleResetModal();
                    onTrackStatus();
                  }}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#FB4504] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Track Status</span>
                  <CustomIcon name="file" className="w-4 h-4 text-white" />
                </button>
              )}

              <button
                id="outcome-applicable-back-btn"
                onClick={() => {
                  handleResetModal();
                  onExplorePets();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse More Pets</span>
                <CustomIcon name="right-arrow" className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ) : eligibilityResult && !eligibilityResult.isApplicable ? (
          /* OUTCOME B — NOT APPLICABLE VIEW */
          <div className="p-7 sm:p-9 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-2xl bg-amber-50 text-[#FB4504] border-3 border-[#FB4504] flex items-center justify-center mx-auto shadow-[4px_4px_0px_#FB4504]">
              <CustomIcon name="exclamation" className="w-12 h-12 text-[#FB4504]" />
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl sm:text-4xl font-titan text-[#FB4504]">
                Not Applicable
              </h3>
              <p className="text-sm sm:text-base text-[#0F5C94] font-bold">
                Unfortunately, this pet may not be the right fit based on the information provided.
              </p>

              {/* Specific Explanation Card */}
              <div className="bg-[#FAF5EB] p-4 sm:p-5 rounded-2xl border-2 border-[#0F5C94]/30 max-w-md mx-auto text-left">
                <span className="text-[10px] font-black uppercase text-[#9A5D16] tracking-wider block mb-1">
                  Reason for Non-Suitability:
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#0F5C94] leading-relaxed">
                  {eligibilityResult.reason}
                </p>
              </div>
            </div>

            {/* Clear Button: EXPLORE OTHER PETS */}
            <div className="pt-2 max-w-xs mx-auto">
              <button
                id="outcome-not-applicable-explore-btn"
                onClick={() => {
                  handleResetModal();
                  onExplorePets();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-sm uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#FB4504] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CustomIcon name="discover" className="w-4 h-4 white" />
                <span>EXPLORE OTHER PETS</span>
              </button>
            </div>
          </div>
        ) : currentProfile?.role === 'Pet Lister' ? (
          <div className="p-7 sm:p-9 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-stone-50 border-3 border-stone-300 flex items-center justify-center mx-auto shadow-[4px_4px_0px_#A3A3A3]">
              <CustomIcon name="cross" className="w-8 h-8 text-stone-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-titan text-[#0F5C94]">
                Form Disabled
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-bold max-w-sm mx-auto">
                Your account is currently registered as a Pet Lister. Pet Listers cannot fill adoption forms for any animals.
              </p>
            </div>
            <div className="pt-3 max-w-xs mx-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-black text-xs uppercase border border-stone-300 cursor-pointer"
              >
                Close Window
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
                <input
                  type="text"
                  value={currentProfile?.housingType || 'Not specified'}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 border-2 border-[#0F5C94]/10 text-xs font-black text-[#0F5C94]/60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CustomIcon name="sparkle" className="w-3.5 h-3.5 text-[#9A5D16]" />
                  Pet Experience
                </label>
                <input
                  type="text"
                  value={currentProfile?.petExperience || 'Not specified'}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 border-2 border-[#0F5C94]/10 text-xs font-black text-[#0F5C94]/60 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Field: Why fit? */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-[#0F5C94] uppercase tracking-wider flex items-center gap-1.5">
                  <CustomIcon name="message-box" className="w-3.5 h-3.5 text-[#9A5D16]" />
                  Why would you be a good fit for this pet? <span className="text-[#FB4504]">*</span>
                </label>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${wordCount >= 40 ? 'bg-[#EBF7EE] text-[#0F942D] border border-[#0F942D]' : 'bg-[#FAF5EB] text-[#FB4504] border border-[#FB4504]/30'}`}>
                  {wordCount} / 40 words min
                </span>
              </div>
              <textarea
                id="app-textarea-fit-reason"
                value={fitReason}
                onChange={(e) => setFitReason(e.target.value)}
                placeholder={`Tell us a little about your daily routine, home environment, and why ${pet.name} would be happy with you... (minimum 40 words required)`}
                rows={4}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white resize-none"
              />
              <p className="text-[10px] font-semibold text-[#0F5C94]/60 mt-1">
                Tip: A detailed response of 40+ words helps ensure a successful eligibility check.
              </p>
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
                  <span>CHECKING ELIGIBILITY...</span>
                ) : (
                  <>
                    <PawIcon className="w-4 h-4 fill-white" />
                    <span>ADOPT NOW!</span>
                  </>
                )}
              </button>

              <p className="text-center text-[10px] font-bold text-[#0F5C94]/60 mt-2">
                By submitting, your application will undergo automated eligibility verification.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
