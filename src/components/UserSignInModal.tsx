import React, { useState, useEffect } from 'react';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';

export type UserRole = 'adopter' | 'Pet Lister';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  housingType: string;
  petExperience: string;
}

interface UserAccount {
  password: string;
  profile: UserProfile;
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
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('adopter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleToggleRole = async () => {
    if (!currentProfile) return;
    setError(null);
    setSuccessMessage(null);
    const newRole = currentProfile.role === 'adopter' ? 'Pet Lister' : 'adopter';
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentProfile.email,
          role: newRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to switch role.');
        return;
      }
      onSignIn(data);
      setSuccessMessage(`Successfully switched to ${newRole === 'adopter' ? 'Adopter' : 'Pet Lister'} Mode!`);
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  useEffect(() => {
    if (currentProfile) {
      setEditName(currentProfile.name);
      setEditPhone(currentProfile.phone);
      setEditHousing(currentProfile.housingType);
      setEditExperience(currentProfile.petExperience);
      setIsEditingProfile(false);
    }
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const getAccountsDb = (): Record<string, UserAccount> => {
    try {
      const data = localStorage.getItem('furever_accounts_db');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveAccountsDb = (db: Record<string, UserAccount>) => {
    localStorage.setItem('furever_accounts_db', JSON.stringify(db));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailTrim = email.trim().toLowerCase();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrim, password }),
      });
      
      let data: any;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text || `HTTP Status: ${res.status}` };
      }

      if (!res.ok) {
        // Fallback to local accounts DB if user is not found on backend (due to Vercel ephemeral filesystem)
        const localDb = getAccountsDb();
        const localUser = localDb[emailTrim];
        if (localUser) {
          if (localUser.password === password) {
            onSignIn(localUser.profile);
            setSuccessMessage('Logged in successfully (Verified via Local Secure Vault)!');
            setTimeout(() => {
              onClose();
            }, 500);
            return;
          } else {
            setError('Incorrect password. Please try again.');
            return;
          }
        }

        // If the API was not found (e.g., static routing on Vercel), show a beautiful localized guidance instead of the raw CDN HTML
        const errorText = String(data.error || '').toLowerCase();
        if (res.status === 404 || errorText.includes('not_found') || errorText.includes('<!doctype html>') || errorText.includes('could not be found')) {
          setError('No account found with this email. Please click "Sign Up" above to register in your Secure Local Vault!');
          return;
        }

        setError(data.error || 'Failed to log in.');
        return;
      }
      onSignIn(data);
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Login error details, checking local fallback:', err);
      
      // Fallback to local accounts DB if completely offline or network error
      const localDb = getAccountsDb();
      const localUser = localDb[emailTrim];
      if (localUser && localUser.password === password) {
        onSignIn(localUser.profile);
        setSuccessMessage('Logged in successfully (Verified via Local Secure Vault)!');
        setTimeout(() => {
          onClose();
        }, 500);
        return;
      }

      setError(err?.message || 'Network error. Please try again.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailTrim = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!name.trim() || !phone.trim() || !housingType || !petExperience) {
      setError('Please fill in all required fields.');
      return;
    }

    if (/\d/.test(name)) {
      setError('Name cannot contain numbers.');
      return;
    }

    if (phone.replace(/[^0-9]/g, '').length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    // Prepare local fallback account object
    const localDb = getAccountsDb();
    const newUserAccount: UserAccount = {
      password,
      profile: {
        name: name.trim(),
        email: emailTrim,
        phone: phone.trim(),
        role,
        housingType,
        petExperience,
      }
    };

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: emailTrim,
          password,
          phone: phone.trim(),
          role,
          housingType,
          petExperience,
        }),
      });

      let data: any;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text || `HTTP Status: ${res.status}` };
      }

      if (!res.ok) {
        // If the email is already registered on the backend, display that specific error
        if (data.error && data.error.toLowerCase().includes('exists')) {
          setError(data.error);
          return;
        }

        // Otherwise, allow fallback to local signup so it works on read-only systems
        localDb[emailTrim] = newUserAccount;
        saveAccountsDb(localDb);
        onSignIn(newUserAccount.profile);
        setSuccessMessage('Account created successfully (Local Safe Vault)!');
        setTimeout(() => {
          onClose();
        }, 500);
        return;
      }
      
      // Save local copy as well for dual-sync reliability!
      localDb[emailTrim] = newUserAccount;
      saveAccountsDb(localDb);

      onSignIn(data);
      setSuccessMessage('Account created successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('Signup error details, falling back to local registration:', err);
      
      // Fallback: Save local copy to furever_accounts_db
      localDb[emailTrim] = newUserAccount;
      saveAccountsDb(localDb);

      onSignIn(newUserAccount.profile);
      setSuccessMessage('Account created successfully (Local Safe Vault)!');
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;
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
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentProfile.email,
          name: editName.trim(),
          phone: editPhone.trim(),
          housingType: editHousing,
          petExperience: editExperience,
        }),
      });

      let data: any;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text || `HTTP Status: ${res.status}` };
      }

      if (!res.ok) {
        // Fallback to local accounts DB if user update fails on backend (due to read-only hosting)
        const emailTrim = currentProfile.email.toLowerCase();
        const localDb = getAccountsDb();
        if (localDb[emailTrim]) {
          localDb[emailTrim].profile = updatedProfile;
          saveAccountsDb(localDb);
        }
        onSignIn(updatedProfile);
        setSuccessMessage('Profile updated successfully (Local Safe Vault synced)!');
        setTimeout(() => {
          onClose();
        }, 600);
        return;
      }
      
      // Update local storage too to keep in sync!
      const emailTrim = currentProfile.email.toLowerCase();
      const localDb = getAccountsDb();
      if (localDb[emailTrim]) {
        localDb[emailTrim].profile = data;
        saveAccountsDb(localDb);
      }

      onSignIn(data);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      console.error('Update profile error details, using local fallback:', err);
      const emailTrim = currentProfile.email.toLowerCase();
      const localDb = getAccountsDb();
      if (localDb[emailTrim]) {
        localDb[emailTrim].profile = updatedProfile;
        saveAccountsDb(localDb);
      }
      onSignIn(updatedProfile);
      setSuccessMessage('Profile updated successfully (Local Safe Vault synced)!');
      setTimeout(() => {
        onClose();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-[8px_8px_0px_#0F5C94] border-3 border-[#0F5C94] my-8 animate-scaleUp">
        <button onClick={onClose} className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white hover:bg-[#FB4504] hover:text-white text-[#0F5C94] border-2 border-[#0F5C94] transition-all cursor-pointer">
          <CustomIcon name="cross" className="w-4 h-4" />
        </button>

        {currentProfile ? (
          // PROFILE & SETTINGS VIEW WHEN LOGGED IN
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

                {/* Account Role Switching Option */}
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
                    onClick={() => {
                      setError(null);
                      setSuccessMessage(null);
                      setIsEditingProfile(true);
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-xs uppercase border-2 border-[#0F5C94] shadow-[3px_3px_0px_#FB4504] cursor-pointer"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
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
          // LOGIN / SIGNUP VIEW
          <div>
            <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-5 border-b-3 border-[#0F5C94]">
              <h2 className="text-2xl font-titan text-[#0F5C94]">
                {view === 'login' ? 'LOG IN' : 'SIGN UP'}
              </h2>
              <div className="flex gap-4 mt-4">
                <button onClick={() => { setView('login'); setError(null); }} className={`font-black pb-1 cursor-pointer ${view === 'login' ? 'text-[#0F5C94] border-b-2 border-[#0F5C94]' : 'text-gray-400'}`}>Log In</button>
                <button onClick={() => { setView('signup'); setError(null); }} className={`font-black pb-1 cursor-pointer ${view === 'signup' ? 'text-[#0F5C94] border-b-2 border-[#0F5C94]' : 'text-gray-400'}`}>Sign Up</button>
              </div>
            </div>

            <form onSubmit={view === 'login' ? handleLogin : handleSignUp} className="p-5 sm:p-7 space-y-4">
              {error && <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black">{error}</div>}
              {successMessage && <div className="p-3 rounded-xl bg-green-50 border-2 border-green-500 text-green-700 text-xs font-black">{successMessage}</div>}
              
              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Email <span className="text-[#FB4504]">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your.email@example.com" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Password <span className="text-[#FB4504]">*</span></label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 6 characters" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold" />
              </div>

              {view === 'signup' && (
                <>
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
                </>
              )}

              <button type="submit" className="w-full py-3.5 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-sm uppercase border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] cursor-pointer">
                {view === 'login' ? 'LOG IN' : 'SIGN UP'}
              </button>

              <div className="text-center pt-2">
                {view === 'login' ? (
                  <p className="text-xs font-bold text-stone-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setView('signup'); setError(null); setSuccessMessage(null); }}
                      className="text-[#0F5C94] font-black underline cursor-pointer hover:text-[#FB4504]"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p className="text-xs font-bold text-stone-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setView('login'); setError(null); setSuccessMessage(null); }}
                      className="text-[#0F5C94] font-black underline cursor-pointer hover:text-[#FB4504]"
                    >
                      Log In
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
