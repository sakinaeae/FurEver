const fs = require('fs');
let content = fs.readFileSync('src/components/UserSignInModal.tsx', 'utf8');

content = `import React, { useState, useEffect } from 'react';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';

export type UserRole = 'adopter' | 'Pet Lister';
export interface UserProfile {
  userId?: string;
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
  const [view, setView] = useState<'login'>('login');
  const [role, setRole] = useState<UserRole>('adopter');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [housingType, setHousingType] = useState('');
  const [petExperience, setPetExperience] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !housingType || !petExperience) {
      setError('Please fill in all required fields.');
      return;
    }

    if (phone.replace(/[^0-9]/g, '').length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    const newProfile: UserProfile = {
      userId: 'local-user-' + Date.now(),
      name: name.trim(),
      email: name.trim().toLowerCase().replace(/\s/g, '') + '@example.com',
      phone: phone.replace(/[^0-9]/g, ''),
      role,
      housingType,
      petExperience,
    };

    onSignIn(newProfile);
    onClose();
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;
    
    if (!editName.trim() || !editPhone.trim() || !editHousing || !editExperience) {
      setError('Please fill in all required fields.');
      return;
    }

    if (editPhone.replace(/[^0-9]/g, '').length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    const updatedProfile: UserProfile = {
      ...currentProfile,
      name: editName.trim(),
      phone: editPhone.replace(/[^0-9]/g, ''),
      housingType: editHousing,
      petExperience: editExperience,
    };

    onSignIn(updatedProfile);
    setIsEditingProfile(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer">
          <CustomIcon name="cross" className="w-4 h-4" />
        </button>

        {currentProfile ? (
          <div>
            <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-5 border-b-3 border-[#0F5C94]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#F6D97B] border-2 border-[#0F5C94] flex items-center justify-center text-[#0F5C94] shadow-[2px_2px_0px_#0F5C94]">
                  <CustomIcon name="user" className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-titan text-[#0F5C94] leading-tight">
                    {currentProfile.name}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-lg bg-[#E8F3FA] text-[#0F5C94] text-[10px] font-black uppercase tracking-wider border border-[#0F5C94]/20">
                    {currentProfile.role === 'Pet Lister' ? (
                      <><CustomIcon name="home" className="w-3 h-3" /> Pet Lister</>
                    ) : (
                      <><PawIcon className="w-3 h-3" /> Adopter</>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="p-5 sm:p-7 space-y-4">
                {error && <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black">{error}</div>}
                
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Full Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Phone</label>
                  <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Housing</label>
                  <select value={editHousing} onChange={(e) => setEditHousing(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none">
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="House with a Yard">House with a Yard</option>
                    <option value="Farm / Acreage">Farm / Acreage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Experience</label>
                  <select value={editExperience} onChange={(e) => setEditExperience(e.target.value)} required className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none">
                    <option value="Current pet owner">Current pet owner</option>
                    <option value="Previous pet owner">Previous pet owner</option>
                    <option value="No experience">No experience</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-black text-xs uppercase border-2 border-stone-300 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3.5 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] cursor-pointer">
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-5 sm:p-7 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between bg-stone-50 p-4 rounded-2xl border-2 border-stone-100">
                    <div>
                      <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Current Role</p>
                      <p className="text-sm font-bold text-[#0F5C94] mt-0.5">
                        {currentProfile.role === 'adopter' ? 'Pet Adopter' : 'Pet Lister'}
                      </p>
                      <p className="text-[11px] font-semibold text-stone-500 mt-1">
                        {currentProfile.role === 'adopter' 
                         ? 'Want to list your foster or rescue pets?'
                         : 'Want to browse & apply to adopt pets?'}
                      </p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        const newRole = currentProfile.role === 'adopter' ? 'Pet Lister' : 'adopter';
                        onSignIn({ ...currentProfile, role: newRole });
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0F5C94] text-white hover:bg-[#0b4875] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[2px_2px_0px_#FB4504] transition-all hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
                    >
                      Switch to {currentProfile.role === 'adopter' ? 'Pet Lister' : 'Adopter'}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setIsEditingProfile(true)} className="flex-1 py-3.5 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-xs uppercase border-2 border-[#0F5C94] shadow-[3px_3px_0px_#FB4504] cursor-pointer">
                    Edit Details
                  </button>
                  <button type="button" onClick={() => { onSignOut(); onClose(); }} className="px-4 py-3.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-black text-xs uppercase border-2 border-red-300 cursor-pointer">
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-[#FAF5EB] px-6 sm:px-8 pt-7 pb-5 border-b-3 border-[#0F5C94]">
              <h2 className="text-2xl font-titan text-[#0F5C94]">WELCOME</h2>
              <p className="text-xs font-bold text-stone-600 mt-1">Please create a local profile to start adopting or listing pets.</p>
            </div>
            
            <div className="p-5 sm:p-7 space-y-4">
              {error && <div className="p-3 rounded-xl bg-red-50 border-2 border-[#FB4504] text-[#FB4504] text-xs font-black">{error}</div>}
              
              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">I want to... <span className="text-[#FB4504]">*</span></label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setRole('adopter')} className={\`flex-1 py-2.5 rounded-xl border-2 font-black text-xs uppercase cursor-pointer \${role === 'adopter' ? 'bg-[#0F5C94] text-white border-[#0F5C94]' : 'bg-white border-[#0F5C94]/30 text-[#0F5C94]'}\`}>Adopt</button>
                    <button type="button" onClick={() => setRole('Pet Lister')} className={\`flex-1 py-2.5 rounded-xl border-2 font-black text-xs uppercase cursor-pointer \${role === 'Pet Lister' ? 'bg-[#0F5C94] text-white border-[#0F5C94]' : 'bg-white border-[#0F5C94]/30 text-[#0F5C94]'}\`}>List a pet</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Full Name <span className="text-[#FB4504]">*</span></label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Phone (10 digits) <span className="text-[#FB4504]">*</span></label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="9999999999" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-[#0F5C94] text-xs font-bold focus:border-[#0F5C94] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Housing Type <span className="text-[#FB4504]">*</span></label>
                  <select value={housingType} onChange={(e) => setHousingType(e.target.value)} required className={\`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold focus:border-[#0F5C94] focus:outline-none \${housingType ? 'text-[#0F5C94]' : 'text-gray-400'}\`}>
                    <option value="" disabled>Select Housing Type...</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="House with a Yard">House with a Yard</option>
                    <option value="Farm / Acreage">Farm / Acreage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-1">Pet Experience <span className="text-[#FB4504]">*</span></label>
                  <select value={petExperience} onChange={(e) => setPetExperience(e.target.value)} required className={\`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF5EB] border-2 border-[#0F5C94]/30 text-xs font-bold focus:border-[#0F5C94] focus:outline-none \${petExperience ? 'text-[#0F5C94]' : 'text-gray-400'}\`}>
                    <option value="" disabled>Select Experience...</option>
                    <option value="Current pet owner">Current pet owner</option>
                    <option value="Previous pet owner">Previous pet owner</option>
                    <option value="No experience">No experience</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-3.5 mt-2 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-sm uppercase border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] cursor-pointer">
                  Enter App
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};`;
fs.writeFileSync('src/components/UserSignInModal.tsx', content);
