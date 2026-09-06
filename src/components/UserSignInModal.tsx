import React, { useState, useEffect } from 'react';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';
import { auth, db } from '../lib/firebase';
import { createUserProfile, updateUserProfile } from '../lib/db';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'adopter' | 'Pet Lister';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  housingType: string;
  petExperience: string;
}

interface UserSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (profile: UserProfile) => void;
  currentProfile: UserProfile | null;
  onSignOut: () => void;
  onOpenListPetModal?: () => void;
}

export const UserSignInModal: React.FC<UserSignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  currentProfile,
  onSignOut,
}) => {
  const [view, setView] = useState<'login' | 'signup' | 'complete_profile'>('login');
  const [role, setRole] = useState<UserRole>('adopter');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [housingType, setHousingType] = useState('');
  const [petExperience, setPetExperience] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile editing state when logged in
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editHousing, setEditHousing] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      setEditName(currentProfile.name);
      setEditPhone(currentProfile.phone);
      setEditHousing(currentProfile.housingType);
      setEditExperience(currentProfile.petExperience);
      setIsEditingProfile(false);
    }
  }, [currentProfile, isOpen]);

  const handleToggleRole = async () => {
    if (!currentProfile || !auth.currentUser) return;
    setError(null);
    setSuccessMessage(null);
    const newRole = currentProfile.role === 'adopter' ? 'Pet Lister' : 'adopter';
    
    const updatedProfile = {
      ...currentProfile,
      role: newRole,
    };

    try {
      await updateUserProfile(auth.currentUser.uid, { role: newRole });
      onSignIn(updatedProfile);
      setSuccessMessage(`Successfully switched to ${newRole === 'adopter' ? 'Adopter' : 'Pet Lister'} Mode!`);
    } catch (err) {
      setError('Failed to switch role.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        onSignIn(profile);
        setSuccessMessage('Logged in successfully!');
        setTimeout(() => onClose(), 500);
      } else {
        // Needs to complete profile
        setName(user.displayName || '');
        setView('complete_profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    if (!name.trim() || !phone.trim() || !housingType || !petExperience) {
      setError('Please fill in all required fields.');
      return;
    }

    if (phone.replace(/[^0-9]/g, '').length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    const newProfile: UserProfile = {
      name: name.trim(),
      email: auth.currentUser.email || '',
      phone: phone.trim(),
      role,
      housingType,
      petExperience,
    };

    try {
      // The User interface in types.ts is what createUserProfile expects. 
      // We will cast it for now to match the frontend expectations, or structure it correctly.
      await createUserProfile({
        userId: auth.currentUser.uid,
        ...newProfile
      } as any);
      
      onSignIn(newProfile);
      setSuccessMessage('Account created successfully!');
      setTimeout(() => onClose(), 500);
    } catch (err: any) {
      setError('Failed to create account.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile || !auth.currentUser) return;
    setError(null);

    if (!editName.trim() || !editPhone.trim()) {
      setError('Name and phone cannot be empty.');
      return;
    }

    const updatedProfile = {
      ...currentProfile,
      name: editName.trim(),
      phone: editPhone.trim(),
      housingType: editHousing,
      petExperience: editExperience,
    };

    try {
      await updateUserProfile(auth.currentUser.uid, {
        name: editName.trim(),
        phone: editPhone.trim(),
        housingType: editHousing,
        petExperience: editExperience,
      });

      onSignIn(updatedProfile);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setIsEditingProfile(false), 500);
    } catch (err: any) {
      setError('Failed to update profile.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-[8px_8px_0px_#0F5C94] border-3 border-[#0F5C94] my-8 animate-scaleUp">
        <button onClick={onClose} className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white hover:bg-[#FB4504] hover:text-white text-[#0F5C94] border-2 border-[#0F5C94] transition-all cursor-pointer">
          <CustomIcon name="cross" className="w-4 h-4" />
        </button>

        {currentProfile ? (
          <div>
            <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-5 border-b-3 border-[#0F5C94]">
              <span className="px-3 py-1 rounded-full bg-[#F6D97B] text-[#0F5C94] text-[10px] font-black uppercase tracking-wider border border-[#0F5C94]">
                {currentProfile.role === 'adopter' ? 'Adopter Account' : 'Pet Lister Account'}
              </span>
              <h2 className="text-2xl font-titan text-[#0F5C94] mt-2">
                MY PROFILE & SETTINGS
              </h2>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                {isEditingProfile ? 'Update your personal details below.' : 'View your profile details, edit them, or log out.'}
              </p>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="p-5 sm:p-7 space-y-4">
                {error && <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black">{error}</div>}
                {successMessage && <div className="p-3 rounded-xl bg-green-50 border-2 border-green-500 text-green-700 text-xs font-black">{successMessage}</div>}

                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Email (Locked)</label>
                  <input type="email" value={currentProfile.email} disabled className="w-full px-3.5 py-2.5 rounded-xl bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed text-xs font-bold" />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold" />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Phone Number</label>
                  <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold" />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Housing Type</label>
                  <select value={editHousing} onChange={(e) => setEditHousing(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold text-[#0F5C94]">
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="House with a Yard">House with a Yard</option>
                    <option value="Farm / Acreage">Farm / Acreage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Pet Experience</label>
                  <select value={editExperience} onChange={(e) => setEditExperience(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold text-[#0F5C94]">
                    <option value="Current pet owner">Current pet owner</option>
                    <option value="Previous pet owner">Previous pet owner</option>
                    <option value="No experience">No experience</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="submit" className="flex-1 py-3.5 rounded-xl bg-[#0F5C94] text-white font-black text-xs uppercase border-2 border-[#0F5C94] shadow-[3px_3px_0px_#FB4504] cursor-pointer">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-3.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-black text-xs uppercase border-2 border-stone-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-5 sm:p-7 space-y-4">
                {successMessage && <div className="p-3 rounded-xl bg-green-50 border-2 border-green-500 text-green-700 text-xs font-black">{successMessage}</div>}

                <div className="bg-[#FAF5EB] p-4 rounded-2xl border-2 border-[#0F5C94]/20 space-y-3">
                  <div>
                    <span className="text-[10px] font-black text-[#0F5C94]/60 uppercase tracking-wider block">Full Name</span>
                    <span className="text-sm font-bold text-[#0F5C94]">{currentProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#0F5C94]/60 uppercase tracking-wider block">Email Address</span>
                    <span className="text-sm font-bold text-[#0F5C94]">{currentProfile.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#0F5C94]/60 uppercase tracking-wider block">Phone Number</span>
                    <span className="text-sm font-bold text-[#0F5C94]">{currentProfile.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#0F5C94]/60 uppercase tracking-wider block">Housing Type</span>
                    <span className="text-sm font-bold text-[#0F5C94]">{currentProfile.housingType || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#0F5C94]/60 uppercase tracking-wider block">Pet Experience</span>
                    <span className="text-sm font-bold text-[#0F5C94]">{currentProfile.petExperience || 'Not specified'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border-2 border-[#F6D97B] bg-[#FFFBEA] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black text-[#9A5D16] uppercase tracking-wider block">Account Role</span>
                    <span className="text-sm font-black text-[#0F5C94]">
                      {currentProfile.role === 'adopter' ? 'Adopter Mode' : 'Pet Lister Mode'}
                    </span>
                    <p className="text-[10px] text-stone-500 font-bold mt-0.5">
                      {currentProfile.role === 'adopter' 
                        ? 'Want to list your foster or rescue pets?' 
                        : 'Want to browse & apply to adopt pets?'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleRole}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0F5C94] text-white hover:bg-[#0b4875] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[2px_2px_0px_#FB4504] transition-all hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                  >
                    Switch to {currentProfile.role === 'adopter' ? 'Pet Lister' : 'Adopter'}
                  </button>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="flex-1 py-3.5 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-xs uppercase border-2 border-[#0F5C94] shadow-[3px_3px_0px_#FB4504] cursor-pointer"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut(auth);
                      onSignOut();
                      onClose();
                    }}
                    className="px-4 py-3.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-black text-xs uppercase border-2 border-red-300 cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-5 border-b-3 border-[#0F5C94]">
              <h2 className="text-2xl font-titan text-[#0F5C94]">
                {view === 'complete_profile' ? 'COMPLETE PROFILE' : 'WELCOME'}
              </h2>
              <p className="text-xs font-bold text-stone-600 mt-1">
                {view === 'complete_profile' ? 'Just a few more details to get you started.' : 'Sign in securely with Google to sync your favorites and applications.'}
              </p>
            </div>

            <div className="p-5 sm:p-7 space-y-4">
              {error && <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black">{error}</div>}
              {successMessage && <div className="p-3 rounded-xl bg-green-50 border-2 border-green-500 text-green-700 text-xs font-black">{successMessage}</div>}
              
              {view !== 'complete_profile' ? (
                <div className="py-4 text-center">
                  <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white text-[#0F5C94] font-black text-sm uppercase border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:bg-blue-50 cursor-pointer transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCompleteProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">I want to... <span className="text-[#FB4504]">*</span></label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setRole('adopter')}
                        className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs uppercase cursor-pointer ${role === 'adopter' ? 'bg-[#0F5C94] text-white border-[#0F5C94]' : 'bg-white border-[#0F5C94]/30 text-[#0F5C94]'}`}>
                        Adopt
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('Pet Lister')}
                        className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs uppercase cursor-pointer ${role === 'Pet Lister' ? 'bg-[#0F5C94] text-white border-[#0F5C94]' : 'bg-white border-[#0F5C94]/30 text-[#0F5C94]'}`}>
                        List a pet
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Full Name <span className="text-[#FB4504]">*</span></label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Phone Number (10 digits) <span className="text-[#FB4504]">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="9999999999" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Housing Type <span className="text-[#FB4504]">*</span></label>
                    <select value={housingType} onChange={(e) => setHousingType(e.target.value)} required className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold ${housingType ? 'text-[#0F5C94]' : 'text-gray-400'}`}>
                      <option value="" disabled>Select Housing Type...</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="House with a Yard">House with a Yard</option>
                      <option value="Farm / Acreage">Farm / Acreage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Pet Experience <span className="text-[#FB4504]">*</span></label>
                    <select value={petExperience} onChange={(e) => setPetExperience(e.target.value)} required className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold ${petExperience ? 'text-[#0F5C94]' : 'text-gray-400'}`}>
                      <option value="" disabled>Select Experience...</option>
                      <option value="Current pet owner">Current pet owner</option>
                      <option value="Previous pet owner">Previous pet owner</option>
                      <option value="No experience">No experience</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="w-full py-3.5 mt-2 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-sm uppercase border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] cursor-pointer">
                    Complete & Enter
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
