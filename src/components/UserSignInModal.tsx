import React, { useState } from 'react';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';

export type UserRole = 'adopter' | 'owner';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface UserSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (profile: UserProfile) => void;
  currentProfile: UserProfile | null;
  onSignOut?: () => void;
  onOpenListPetModal?: () => void;
}

export const UserSignInModal: React.FC<UserSignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  currentProfile,
  onSignOut,
  onOpenListPetModal,
}) => {
  const [role, setRole] = useState<UserRole>(currentProfile?.role || 'adopter');
  const [name, setName] = useState(currentProfile?.name || '');
  const [email, setEmail] = useState(currentProfile?.email || '');
  const [phone, setPhone] = useState(currentProfile?.phone || '');
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(!currentProfile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
    };

    onSignIn(profile);
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        id="user-signin-modal-card"
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-[8px_8px_0px_#0F5C94] border-3 border-[#0F5C94] my-8 animate-scaleUp"
      >
        {/* Close button */}
        <button
          id="user-signin-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white hover:bg-[#FB4504] hover:text-white text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all cursor-pointer"
          title="Close"
        >
          <CustomIcon name="cross" className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-5 border-b-3 border-[#0F5C94]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F6D97B] text-[#0F5C94] text-xs font-black uppercase tracking-wider mb-2 border-2 border-[#0F5C94]">
            <PawIcon className="w-3.5 h-3.5 fill-[#0F5C94]" />
            <span>WELCOME TO FUREVER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-titan text-[#0F5C94]">
            {currentProfile && !isEditing ? 'YOUR PROFILE' : 'SIGN IN / GET STARTED'}
          </h2>
          <p className="text-xs sm:text-sm text-[#0F5C94]/85 font-bold mt-0.5">
            {currentProfile && !isEditing
              ? 'Manage your details for pet adoption applications.'
              : 'Choose your journey and enter your details to continue.'}
          </p>
        </div>

        {/* Content View */}
        {currentProfile && !isEditing ? (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="bg-[#FAF5EB] p-4 rounded-2xl border-2 border-[#0F5C94]/30 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#0F5C94]/15">
                <span className="text-xs font-black uppercase text-[#9A5D16] tracking-wider">Role</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#F6D97B] text-[#0F5C94] border border-[#0F5C94]">
                  {currentProfile.role === 'adopter' ? 'I WANT TO ADOPT' : "I'M A FOSTER / OWNER"}
                </span>
              </div>

              <div className="space-y-2 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-[#0F5C94]/60">Name:</span>
                  <span className="text-[#0F5C94] text-sm">{currentProfile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#0F5C94]/60">Email:</span>
                  <span className="text-[#0F5C94]">{currentProfile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#0F5C94]/60">Phone:</span>
                  <span className="text-[#0F5C94]">{currentProfile.phone}</span>
                </div>
              </div>
            </div>

            {currentProfile.role === 'owner' && (
              <div className="p-4 rounded-2xl bg-[#EBF7EE] border-2 border-[#0F942D] text-xs text-[#0F5C94] space-y-2">
                <div className="flex items-center gap-2 font-black text-[#0F942D]">
                  <PawIcon className="w-4 h-4 fill-[#0F942D]" />
                  <span>FOSTER & PET OWNER PORTAL ACTIVE</span>
                </div>
                <p className="font-semibold text-[#0F5C94]/90 leading-relaxed">
                  Have a rescue or pet looking for a home? You can put your pet up for adoption directly on FurEver!
                </p>
                {onOpenListPetModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenListPetModal();
                    }}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0F942D] hover:bg-[#0b7523] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PawIcon className="w-4 h-4 fill-white" />
                    <span>PUT A PET UP FOR ADOPTION NOW</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 rounded-xl bg-[#F6D97B] hover:bg-[#ebd070] text-[#0F5C94] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] cursor-pointer"
              >
                Edit Profile
              </button>

              {onSignOut && (
                <button
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-white hover:bg-[#FB4504] hover:text-white text-[#FB4504] font-black text-xs uppercase tracking-wider border-2 border-[#FB4504] shadow-[2px_2px_0px_#FB4504] cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black flex items-center gap-2">
                <CustomIcon name="exclamation" className="w-4 h-4 shrink-0 text-[#FB4504]" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Role Selector */}
            <div>
              <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-2">
                I am using FurEver because: <span className="text-[#FB4504]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: ADOPT */}
                <button
                  type="button"
                  onClick={() => setRole('adopter')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === 'adopter'
                      ? 'bg-[#F6D97B] border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94]'
                      : 'bg-[#FAF5EB] border-[#0F5C94]/20 hover:border-[#0F5C94]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-titan text-xs text-[#0F5C94]">I WANT TO ADOPT</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === 'adopter' ? 'border-[#0F5C94] bg-[#FB4504]' : 'border-stone-400'}`}>
                      {role === 'adopter' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#0F5C94]/85 font-medium leading-snug">
                    For people looking to adopt a pet.
                  </p>
                </button>

                {/* Option 2: FOSTER / OWNER */}
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    role === 'owner'
                      ? 'bg-[#F6D97B] border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94]'
                      : 'bg-[#FAF5EB] border-[#0F5C94]/20 hover:border-[#0F5C94]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-titan text-xs text-[#0F5C94]">I'M A FOSTER / PET OWNER</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === 'owner' ? 'border-[#0F5C94] bg-[#FB4504]' : 'border-stone-400'}`}>
                      {role === 'owner' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#0F5C94]/85 font-medium leading-snug">
                    For people who currently care for a pet & want to list/manage.
                  </p>
                </button>
              </div>
            </div>

            {/* Inputs: Name, Email, Phone */}
            <div>
              <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CustomIcon name="user" className="w-3.5 h-3.5 text-[#9A5D16]" />
                Full Name <span className="text-[#FB4504]">*</span>
              </label>
              <input
                id="signin-input-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Deshmukh"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CustomIcon name="mail" className="w-3.5 h-3.5 text-[#9A5D16]" />
                Email Address <span className="text-[#FB4504]">*</span>
              </label>
              <input
                id="signin-input-email"
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
                Phone Number <span className="text-[#FB4504]">*</span>
              </label>
              <input
                id="signin-input-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98200 12345"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs sm:text-sm text-[#0F5C94] font-bold placeholder-[#0F5C94]/40 focus:outline-none focus:border-[#0F5C94] focus:bg-white"
              />
            </div>

            <div className="pt-3">
              <button
                id="signin-submit-btn"
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-sm tracking-wider uppercase border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PawIcon className="w-4 h-4 fill-white" />
                <span>SIGN IN / GET STARTED</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
