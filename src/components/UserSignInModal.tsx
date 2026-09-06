import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, LogOut, Edit3, Check, Mail, Lock, Phone, User, Home, Shield, AlertCircle, X, ArrowRight } from 'lucide-react';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';

export type UserRole = 'adopter' | 'Pet Lister';
export interface UserProfile {
  userId?: string;
  name: string;
  email: string;
  password?: string;
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

const REGISTERED_USERS_KEY = 'furever_registered_users';

export const UserSignInModal: React.FC<UserSignInModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  currentProfile,
  onSignOut,
}) => {
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [view, setView] = useState<'login' | 'signup'>('login');
  
  // Sign Up form fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('adopter');
  const [housingType, setHousingType] = useState('');
  const [petExperience, setPetExperience] = useState('');

  // Login form fields (Email & Password only)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Profile Viewing & Editing states (All details editable)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editRole, setEditRole] = useState<UserRole>('adopter');
  const [editHousing, setEditHousing] = useState('');
  const [editExperience, setEditExperience] = useState('');

  // Load registered users from localStorage on modal open
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMessage(null);
      try {
        const stored = localStorage.getItem(REGISTERED_USERS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setRegisteredUsers(parsed);
            if (!currentProfile) {
              setView(parsed.length > 0 ? 'login' : 'signup');
            }
          }
        } else {
          setRegisteredUsers([]);
          if (!currentProfile) {
            setView('signup');
          }
        }
      } catch (err) {
        console.error('Error reading registered users:', err);
      }
    }
  }, [isOpen, currentProfile]);

  // Sync edit fields whenever currentProfile changes
  useEffect(() => {
    if (currentProfile) {
      setEditName(currentProfile.name || '');
      setEditEmail(currentProfile.email || '');
      setEditPhone(currentProfile.phone || '');
      setEditRole(currentProfile.role || 'adopter');
      setEditHousing(currentProfile.housingType || 'Apartment');
      setEditExperience(currentProfile.petExperience || 'Current pet owner');
      setEditPassword('');
      setIsEditingProfile(false);
    }
  }, [currentProfile, isOpen]);

  // Handle Full Name Input (strictly reject numbers)
  const handleNameChange = (val: string, isEdit = false) => {
    if (/\d/.test(val)) {
      setError('Name cannot contain numbers. Only letters, spaces, and hyphens are allowed.');
    } else {
      setError(null);
    }
    const clean = val.replace(/[0-9]/g, '');
    if (isEdit) {
      setEditName(clean);
    } else {
      setName(clean);
    }
  };

  // Handle Phone Input (Only digits, max 10 digits)
  const handlePhoneChange = (val: string, isEdit = false) => {
    const clean = val.replace(/\D/g, '').slice(0, 10);
    setError(null);
    if (isEdit) {
      setEditPhone(clean);
    } else {
      setPhone(clean);
    }
  };

  // Sign Up Submission
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Name validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }
    if (/\d/.test(trimmedName)) {
      setError('Name cannot contain numbers. Letters only.');
      return;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
      setError('Name can only contain letters, spaces, hyphens, and apostrophes.');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long.');
      return;
    }

    // 2. Email validation
    const cleanEmail = signupEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    // Check if email already registered
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setError(`An account with email "${cleanEmail}" already exists! Please log in.`);
      return;
    }

    // 3. Password validation
    if (!signupPassword) {
      setError('Please enter a password.');
      return;
    }
    if (signupPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    // 4. Phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) {
      setError('Please enter your phone number.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setError(`Phone number must be exactly 10 digits (currently ${cleanPhone.length} digits).`);
      return;
    }

    // 5. Housing & Experience
    if (!housingType) {
      setError('Please select your housing type.');
      return;
    }
    if (!petExperience) {
      setError('Please select your pet care experience.');
      return;
    }

    const newProfile: UserProfile = {
      userId: 'user-' + Date.now(),
      name: trimmedName,
      email: cleanEmail,
      password: signupPassword,
      phone: cleanPhone,
      role,
      housingType,
      petExperience,
    };

    const updatedUsers = [...registeredUsers, newProfile];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
    setRegisteredUsers(updatedUsers);

    onSignIn(newProfile);
    onClose();
  };

  // Log In Submission (Email and Password ONLY)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    const matchedUser = registeredUsers.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail
    );

    if (!matchedUser) {
      setError('No account found with this email address. Please sign up first.');
      return;
    }

    // If user has a stored password, check match
    if (matchedUser.password && matchedUser.password !== loginPassword) {
      setError('Incorrect password. Please try again.');
      return;
    }

    onSignIn(matchedUser);
    onClose();
  };

  // Quick Login for saved accounts on this device
  const handleQuickLogin = (user: UserProfile) => {
    setError(null);
    onSignIn(user);
    onClose();
  };

  // Profile Edit Submission (Allows changes to ALL details)
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;
    setError(null);

    const trimmedName = editName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError('Please enter a valid full name (at least 2 characters).');
      return;
    }
    if (/\d/.test(trimmedName)) {
      setError('Name cannot contain numbers. Letters only.');
      return;
    }

    const trimmedEmail = editEmail.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (editPhone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    if (!editHousing.trim()) {
      setError('Please select your housing type.');
      return;
    }
    if (!editExperience.trim()) {
      setError('Please select your pet care experience level.');
      return;
    }

    if (editPassword.trim() && editPassword.trim().length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      name: trimmedName,
      email: trimmedEmail,
      phone: editPhone,
      role: editRole,
      housingType: editHousing,
      petExperience: editExperience,
      ...(editPassword.trim() ? { password: editPassword.trim() } : {}),
    };

    // Update in registered users list
    const updatedUsers = registeredUsers.map((u) => {
      if (
        (currentProfile.userId && u.userId === currentProfile.userId) ||
        u.email.toLowerCase() === currentProfile.email.toLowerCase()
      ) {
        return updatedProfile;
      }
      return u;
    });

    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
    setRegisteredUsers(updatedUsers);

    onSignIn(updatedProfile);
    setIsEditingProfile(false);
    setSuccessMessage('Profile details updated successfully!');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFDF9] rounded-3xl border-4 border-[#0F5C94] shadow-[8px_8px_0px_#0F5C94] overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF5EB] hover:bg-[#FB4504] text-[#0F5C94] hover:text-white border-2 border-[#0F5C94] flex items-center justify-center cursor-pointer transition-all shadow-[2px_2px_0px_#0F5C94]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOGGED IN VIEW: Viewing Profile or Editing */}
        {currentProfile ? (
          <div>
            {/* Header with Avatar & Name */}
            <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-5 border-b-3 border-[#0F5C94]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F6D97B] border-2 border-[#0F5C94] flex items-center justify-center text-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] text-xl font-black">
                  {currentProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-titan text-[#0F5C94] leading-tight">
                    {currentProfile.name}
                  </h2>
                  <div className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-lg bg-[#E8F3FA] text-[#0F5C94] text-[10px] font-black uppercase tracking-wider border border-[#0F5C94]/20">
                    {currentProfile.role === 'Pet Lister' ? 'Pet Lister Mode' : 'Adopter Mode'}
                  </div>
                </div>
              </div>
            </div>

            {/* If User Clicked "Edit Profile" -> Show Full Edit Form */}
            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="p-5 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-[#0F5C94]/15">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#0F5C94] flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-[#FB4504]" /> Edit Profile Information
                  </h3>
                  <span className="text-[10px] text-stone-500 font-bold">All details editable</span>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black flex items-center gap-2">
                    <CustomIcon name="exclamation" className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                    Full Name (Letters Only) <span className="text-[#FB4504]">*</span>
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => handleNameChange(e.target.value, true)}
                    required
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94] text-[#0F5C94] text-xs font-bold focus:ring-2 focus:ring-[#FB4504] focus:outline-none shadow-[2px_2px_0px_#0F5C94]"
                  />
                  <span className="text-[10px] text-stone-500 font-medium mt-0.5 block">
                    No numbers allowed
                  </span>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                    Email Address <span className="text-[#FB4504]">*</span>
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => {
                      setEditEmail(e.target.value);
                      setError(null);
                    }}
                    required
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94] text-[#0F5C94] text-xs font-bold focus:ring-2 focus:ring-[#FB4504] focus:outline-none shadow-[2px_2px_0px_#0F5C94]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider">
                      Phone Number (10 Digits) <span className="text-[#FB4504]">*</span>
                    </label>
                    <span className="text-[10px] font-black text-stone-500">
                      {editPhone.length}/10 digits
                    </span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={editPhone}
                    onChange={(e) => handlePhoneChange(e.target.value, true)}
                    required
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94] text-[#0F5C94] text-xs font-bold focus:ring-2 focus:ring-[#FB4504] focus:outline-none shadow-[2px_2px_0px_#0F5C94]"
                  />
                </div>

                {/* Account Role Selector */}
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                    Account Role <span className="text-[#FB4504]">*</span>
                  </label>
                   <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setEditRole('adopter')}
                      className={`p-3 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all ${
                        editRole === 'adopter'
                          ? 'bg-[#0F5C94] text-white border-[#0F5C94] shadow-[2px_2px_0px_#FB4504]'
                          : 'bg-[#FAF5EB] text-[#0F5C94] border-[#0F5C94]/30 hover:bg-[#FAF5EB]/80'
                      }`}
                    >
                      <span className="text-xs font-black uppercase">Pet Adopter</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditRole('Pet Lister')}
                      className={`p-3 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all ${
                        editRole === 'Pet Lister'
                          ? 'bg-[#0F5C94] text-white border-[#0F5C94] shadow-[2px_2px_0px_#FB4504]'
                          : 'bg-[#FAF5EB] text-[#0F5C94] border-[#0F5C94]/30 hover:bg-[#FAF5EB]/80'
                      }`}
                    >
                      <span className="text-xs font-black uppercase">Pet Lister</span>
                    </button>
                  </div>
                </div>

                {/* Housing Type */}
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                    Housing Type <span className="text-[#FB4504]">*</span>
                  </label>
                  <select
                    value={editHousing}
                    onChange={(e) => {
                      setEditHousing(e.target.value);
                      setError(null);
                    }}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94] text-[#0F5C94] text-xs font-bold focus:ring-2 focus:ring-[#FB4504] focus:outline-none cursor-pointer shadow-[2px_2px_0px_#0F5C94]"
                  >
                    <option value="" disabled>Select Housing Type...</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="House with a Yard">House with a Yard</option>
                    <option value="Farm / Acreage">Farm / Acreage</option>
                  </select>
                </div>

                {/* Pet Experience */}
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                    Pet Experience <span className="text-[#FB4504]">*</span>
                  </label>
                  <select
                    value={editExperience}
                    onChange={(e) => {
                      setEditExperience(e.target.value);
                      setError(null);
                    }}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94] text-[#0F5C94] text-xs font-bold focus:ring-2 focus:ring-[#FB4504] focus:outline-none cursor-pointer shadow-[2px_2px_0px_#0F5C94]"
                  >
                    <option value="" disabled>Select Experience...</option>
                    <option value="Current pet owner">Current pet owner</option>
                    <option value="Previous pet owner">Previous pet owner</option>
                    <option value="No experience">No experience</option>
                  </select>
                </div>

                {/* Edit Password (Optional) */}
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                    Update Password (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      value={editPassword}
                      onChange={(e) => {
                        setEditPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="Leave blank to keep current password"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94] text-[#0F5C94] text-xs font-bold focus:ring-2 focus:ring-[#FB4504] focus:outline-none shadow-[2px_2px_0px_#0F5C94]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F5C94]/60 hover:text-[#0F5C94] cursor-pointer"
                      title={showEditPassword ? 'Hide password' : 'Show password'}
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditName(currentProfile.name || '');
                      setEditEmail(currentProfile.email || '');
                      setEditPhone(currentProfile.phone || '');
                      setEditRole(currentProfile.role || 'adopter');
                      setEditHousing(currentProfile.housingType || 'Apartment');
                      setEditExperience(currentProfile.petExperience || 'Current pet owner');
                      setEditPassword('');
                      setError(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-xs uppercase border-2 border-stone-300 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-xs uppercase border-2 border-[#0F5C94] shadow-[3px_3px_0px_#FB4504] cursor-pointer transition-all active:scale-[0.99]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              /* User Information Display Mode */
              <div className="p-5 sm:p-7 space-y-5">
                {successMessage && (
                  <div className="p-3 rounded-xl bg-green-50 border-2 border-green-500 text-green-700 text-xs font-black flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Account Role Switcher */}
                <div className="flex items-center justify-between bg-stone-50 p-4 rounded-2xl border-2 border-stone-200">
                  <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Account Role</p>
                    <div className="mt-0.5">
                      <p className="text-sm font-bold text-[#0F5C94]">
                        {currentProfile.role === 'adopter' ? 'Pet Adopter' : 'Pet Lister'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newRole: UserRole = currentProfile.role === 'adopter' ? 'Pet Lister' : 'adopter';
                      const updatedProfile: UserProfile = { ...currentProfile, role: newRole };
                      
                      const updatedUsers = registeredUsers.map((u) => {
                        if (
                          (currentProfile.userId && u.userId === currentProfile.userId) ||
                          u.email.toLowerCase() === currentProfile.email.toLowerCase()
                        ) {
                          return updatedProfile;
                        }
                        return u;
                      });
                      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
                      setRegisteredUsers(updatedUsers);

                      onSignIn(updatedProfile);
                      setSuccessMessage(`Switched to ${newRole === 'adopter' ? 'Pet Adopter' : 'Pet Lister'}!`);
                      setTimeout(() => setSuccessMessage(null), 3000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F6D97B] text-[#0F5C94] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CustomIcon name="refresh" className="w-3.5 h-3.5" />
                    <span>Switch to {currentProfile.role === 'adopter' ? 'Pet Lister' : 'Pet Adopter'}</span>
                  </button>
                </div>

                {/* User Info Details Card */}
                <div className="bg-[#FAF5EB] p-5 rounded-2xl border-2 border-[#0F5C94]/20 shadow-[2px_2px_0px_#0F5C94]/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#0F5C94]/15 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0F5C94]">
                      Your Profile Info
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-black uppercase text-stone-400 block">Full Name</span>
                      <span className="font-bold text-[#0F5C94]">{currentProfile.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-stone-400 block">Email Address</span>
                      <span className="font-bold text-[#0F5C94]">{currentProfile.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-stone-400 block">Phone Number</span>
                      <span className="font-bold text-[#0F5C94]">{currentProfile.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-stone-400 block">Role</span>
                      <span className="font-bold text-[#0F5C94]">{currentProfile.role}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-stone-400 block">Housing Type</span>
                      <span className="font-bold text-[#0F5C94]">{currentProfile.housingType || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-stone-400 block">Experience</span>
                      <span className="font-bold text-[#0F5C94]">{currentProfile.petExperience || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Edit Profile & Log Out */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(true);
                      setEditName(currentProfile.name || '');
                      setEditEmail(currentProfile.email || '');
                      setEditPhone(currentProfile.phone || '');
                      setEditRole(currentProfile.role || 'adopter');
                      setEditHousing(currentProfile.housingType || 'Apartment');
                      setEditExperience(currentProfile.petExperience || 'Current pet owner');
                      setEditPassword('');
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-xs uppercase border-2 border-[#0F5C94] shadow-[3px_3px_0px_#FB4504] cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSignOut();
                      onClose();
                    }}
                    className="py-3.5 px-6 rounded-xl bg-red-50 hover:bg-red-100 text-[#FB4504] font-black text-xs uppercase border-2 border-red-200 cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* NOT LOGGED IN: Log In or Sign Up */
          <div>
            {/* Tab Header */}
            <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-4 border-b-3 border-[#0F5C94]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-titan text-[#0F5C94]">
                  {view === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
                </h2>
              </div>

              {/* Segmented View Switcher */}
              <div className="flex rounded-2xl bg-stone-200/80 p-1 border-2 border-[#0F5C94]/20">
                <button
                  type="button"
                  id="tab-login"
                  onClick={() => {
                    setView('login');
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl font-titan text-xs uppercase transition-all cursor-pointer ${
                    view === 'login'
                      ? 'bg-[#0F5C94] text-white shadow-[2px_2px_0px_#FB4504]'
                      : 'text-[#0F5C94] hover:text-[#FB4504]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  id="tab-signup"
                  onClick={() => {
                    setView('signup');
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-xl font-titan text-xs uppercase transition-all cursor-pointer ${
                    view === 'signup'
                      ? 'bg-[#0F5C94] text-white shadow-[2px_2px_0px_#FB4504]'
                      : 'text-[#0F5C94] hover:text-[#FB4504]'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <p className="text-xs font-bold text-stone-600 mt-2">
                {view === 'login'
                  ? 'Sign in with your email and password.'
                  : 'Register your account to adopt or list shelter pets.'}
              </p>
            </div>

            <div className="p-5 sm:p-7 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* VIEW: LOG IN (Email and Password ONLY) */}
              {view === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                      Email Address <span className="text-[#FB4504]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          setError(null);
                        }}
                        required
                        placeholder="e.g. yourname@example.com"
                        className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-[#0F5C94]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                      Password <span className="text-[#FB4504]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          setError(null);
                        }}
                        required
                        placeholder="Enter your password"
                        className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none"
                      />
                      <Lock className="w-4 h-4 text-[#0F5C94]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F5C94]/60 hover:text-[#0F5C94] cursor-pointer"
                        title={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Log In */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-sm uppercase border-2 border-[#0F5C94] shadow-[4px_4px_0px_#FB4504] cursor-pointer transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Saved accounts shortcut if available */}
                  {registeredUsers.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-black text-[#0F5C94] uppercase tracking-wider mb-2">
                        Or select a saved account on this device:
                      </p>
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                        {registeredUsers.map((u) => (
                          <div
                            key={u.userId || u.email}
                            onClick={() => handleQuickLogin(u)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#F6D97B]/40 border-2 border-[#0F5C94]/20 cursor-pointer transition-all hover:translate-x-0.5"
                          >
                            <div className="text-left">
                              <p className="text-xs font-black text-[#0F5C94]">{u.name}</p>
                              <p className="text-[10px] font-bold text-stone-500 flex items-center gap-1 mt-0.5">
                                <CustomIcon name="mail" className="w-3 h-3 text-[#0F5C94]" />
                                <span>{u.email}</span>
                                <span>·</span>
                                <span className="text-[#FB4504] uppercase font-black">{u.role}</span>
                              </p>
                            </div>
                            <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-[#0F5C94] text-white uppercase shadow-[1px_1px_0px_#FB4504]">
                              Log In
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Switch to Sign Up */}
                  <div className="pt-2 text-center">
                    <p className="text-xs font-bold text-stone-600">
                      Don't have an account yet?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setView('signup');
                          setError(null);
                        }}
                        className="font-black text-[#FB4504] underline hover:text-[#e03a00] cursor-pointer"
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* VIEW: SIGN UP */}
              {view === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  {/* Already signed up before prompt */}
                  <div className="p-3 rounded-2xl bg-[#E8F3FA] border-2 border-[#0F5C94]/30 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0F5C94]">
                      Already signed up before?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setView('login');
                        setError(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#0F5C94] text-white font-black text-xs uppercase shadow-[2px_2px_0px_#FB4504] hover:bg-[#0b4875] cursor-pointer transition-all"
                    >
                      Login here
                    </button>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                      I want to... <span className="text-[#FB4504]">*</span>
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('adopter')}
                        className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs uppercase cursor-pointer transition-all ${
                          role === 'adopter'
                            ? 'bg-[#0F5C94] text-white border-[#0F5C94] shadow-[2px_2px_0px_#FB4504]'
                            : 'bg-white border-[#0F5C94]/30 text-[#0F5C94]'
                        }`}
                      >
                        Adopt Pets
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('Pet Lister')}
                        className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs uppercase cursor-pointer transition-all ${
                          role === 'Pet Lister'
                            ? 'bg-[#0F5C94] text-white border-[#0F5C94] shadow-[2px_2px_0px_#FB4504]'
                            : 'bg-white border-[#0F5C94]/30 text-[#0F5C94]'
                        }`}
                      >
                        List a Pet
                      </button>
                    </div>
                  </div>

                  {/* Full Name (Letters only, no numbers allowed) */}
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                      Full Name <span className="text-[#FB4504]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                        placeholder="e.g. Maya Deshmukh"
                        className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none"
                      />
                      <User className="w-4 h-4 text-[#0F5C94]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[10px] text-stone-500 font-semibold mt-0.5 block">
                      Numbers are strictly not allowed in name
                    </span>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                      Email Address <span className="text-[#FB4504]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => {
                          setSignupEmail(e.target.value);
                          setError(null);
                        }}
                        required
                        placeholder="e.g. maya@example.com"
                        className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-[#0F5C94]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                      Password <span className="text-[#FB4504]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => {
                          setSignupPassword(e.target.value);
                          setError(null);
                        }}
                        required
                        minLength={4}
                        placeholder="Create a password (min 4 chars)"
                        className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none"
                      />
                      <Lock className="w-4 h-4 text-[#0F5C94]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0F5C94]/60 hover:text-[#0F5C94] cursor-pointer"
                        title={showSignupPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Phone Number (Max 10 digits) */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider">
                        Phone Number <span className="text-[#FB4504]">*</span>
                      </label>
                      <span className="text-[10px] font-black text-stone-500">
                        {phone.length}/10 digits
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        required
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none"
                      />
                      <Phone className="w-4 h-4 text-[#0F5C94]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <span className="text-[10px] text-stone-500 font-semibold mt-0.5 block">
                      Must be exactly 10 digits (max 10 allowed)
                    </span>
                  </div>

                  {/* Housing Type */}
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                      Housing Type <span className="text-[#FB4504]">*</span>
                    </label>
                    <select
                      value={housingType}
                      onChange={(e) => setHousingType(e.target.value)}
                      required
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold focus:border-[#0F5C94] focus:outline-none cursor-pointer ${
                        housingType ? 'text-[#0F5C94]' : 'text-stone-400'
                      }`}
                    >
                      <option value="" disabled>Select Housing Type...</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="House with a Yard">House with a Yard</option>
                      <option value="Farm / Acreage">Farm / Acreage</option>
                    </select>
                  </div>

                  {/* Pet Experience */}
                  <div>
                    <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">
                      Pet Experience <span className="text-[#FB4504]">*</span>
                    </label>
                    <select
                      value={petExperience}
                      onChange={(e) => setPetExperience(e.target.value)}
                      required
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold focus:border-[#0F5C94] focus:outline-none cursor-pointer ${
                        petExperience ? 'text-[#0F5C94]' : 'text-stone-400'
                      }`}
                    >
                      <option value="" disabled>Select Experience...</option>
                      <option value="Current pet owner">Current pet owner</option>
                      <option value="Previous pet owner">Previous pet owner</option>
                      <option value="No experience">No experience</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-sm uppercase border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] cursor-pointer transition-transform active:scale-[0.99]"
                  >
                    Create Account & Enter
                  </button>

                  <p className="text-center text-xs font-bold text-stone-600 mt-3">
                    Already signed up?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setView('login');
                        setError(null);
                      }}
                      className="font-black text-[#0F5C94] underline hover:text-[#FB4504] cursor-pointer"
                    >
                      Login here
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
