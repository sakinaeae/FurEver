import React, { useState, useEffect } from 'react';
import { CustomIcon } from './CustomIcon';
import { AdoptionApplication, ApplicationStatus, Pet } from '../backend/types';
import { PawIcon } from './PawDecorations';
import { AnimalMarqueeTape } from './AnimalMarqueeTape';
import { UserProfile } from './UserSignInModal';

interface MyApplicationsViewProps {
  applications: AdoptionApplication[];
  onExplorePets: () => void;
  onSelectPetById: (petId: string) => void;
  showToast: (msg: string) => void;
  pets?: Pet[];
  userProfile?: UserProfile | null;
  onUpdateApplicationStatus?: (appId: string, status: ApplicationStatus) => void;
  onRemovePet?: (petId: string) => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({
  applications,
  onExplorePets,
  onSelectPetById,
  showToast,
  pets = [],
  userProfile = null,
  onUpdateApplicationStatus,
  onRemovePet,
}) => {
  const [activeAppDetail, setActiveAppDetail] = useState<AdoptionApplication | null>(null);
  const [petIdToRemoveConfirm, setPetIdToRemoveConfirm] = useState<string | null>(null);

  const isLister = userProfile?.role === 'Pet Lister';

  // Find all pets listed by this user
  const myListedPets = isLister
    ? pets.filter(p => p.petListerId === userProfile?.userId)
    : [];

  useEffect(() => {
    if (!isLister) {
      const hasPending = applications.some(app => app.currentStatus === 'Pending');
      if (hasPending) {
        showToast("The pet's owner/foster will reach out to you shortly.");
      }
    }
  }, [applications, isLister, showToast]);

  const getStatusBadge = (status?: ApplicationStatus) => {
    const s = status || 'Pending';
    switch (s) {
      case 'Approved':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#EBF7EE] text-[#0F942D] border border-[#0F942D]/20">Approved</span>;
      case 'Adopted':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#0F942D] text-white">Adopted</span>;
      case 'Under Review':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FAF3E7] text-[#9A5D16] border border-[#9A5D16]/20">Under Review</span>;
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E8F3FA] text-[#0F5C94] border border-[#0F5C94]/20">Pending</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-red-50 text-[#FB4504] border border-red-200">Not Approved</span>;
    }
  };

  if (isLister) {
    return (
      <div className="py-10 lg:py-16 min-h-[calc(100vh-5rem)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Pet Lister Dashboard Header: NO status on top */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F6D97B] text-[#0F5C94] text-xs font-black uppercase tracking-wider mb-2 border-2 border-[#0F5C94]">
                <CustomIcon name="discover" className="w-3.5 h-3.5 text-[#0F942D]" />
                <span>Pet Lister Portal</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-titan text-[#0F5C94] tracking-normal">
                MY LISTED PETS
              </h1>

              <p className="text-xs sm:text-sm text-[#0F5C94]/85 font-medium mt-1 max-w-xl">
                Review and manage all adoption applications submitted by prospective families for your listed foster pets.
              </p>
            </div>
          </div>

          {/* Listed Pets Grid / List */}
          {myListedPets.length > 0 ? (
            <div className="space-y-10">
              {myListedPets.map((pet) => {
                // Find applications for this specific pet
                const petApps = applications.filter(app => app.petId === pet.id);

                return (
                  <div
                    key={pet.id}
                    className="bg-[#FAF5EB] rounded-3xl p-6 sm:p-8 border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] space-y-6"
                  >
                    {/* Pet Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#0F5C94]/20">
                      <div className="flex items-center gap-4">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-center border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl sm:text-3xl font-titan text-[#0F5C94]">
                              {pet.name}
                            </h3>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#F6D97B] text-[#0F5C94] border border-[#0F5C94]">
                              {pet.animalType}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-[#9A5D16] mt-0.5">
                            {pet.breed} · {pet.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-[#0F5C94]/20">
                          <span className="text-xs font-black text-[#0F5C94]">Listing Status:</span>
                          <span className="text-xs font-black text-[#FB4504] bg-[#FFFBEA] px-2 py-0.5 rounded-md border border-[#F6D97B]">
                            {pet.status}
                          </span>
                        </div>

                        {onRemovePet && (
                          <div className="flex items-center gap-1.5">
                            {petIdToRemoveConfirm === pet.id ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onRemovePet(pet.id);
                                    setPetIdToRemoveConfirm(null);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-[#FB4504] text-white border border-[#FB4504] text-[10px] font-black uppercase rounded-lg shadow-xs transition-all cursor-pointer animate-pulse"
                                >
                                  ⚠️ Confirm Delete?
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPetIdToRemoveConfirm(null)}
                                  className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setPetIdToRemoveConfirm(pet.id);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-[#FB4504] text-[#FB4504] hover:text-white border border-red-200 hover:border-[#FB4504] text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer"
                              >
                                ✕ Remove Pet
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Applications for this specific pet */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-black text-[#0F5C94] uppercase tracking-wider flex items-center gap-1.5">
                        <CustomIcon name="file" className="w-4 h-4 text-[#FB4504]" />
                        <span>Adoption Applicants ({petApps.length})</span>
                      </h4>

                      {petApps.length > 0 ? (
                        <div className="space-y-4">
                          {petApps.map((app) => (
                            <div
                              key={app.id}
                              className="bg-white p-5 rounded-2xl border-2 border-[#0F5C94]/20 shadow-xs space-y-4 hover:border-[#0F5C94]/40 transition-colors"
                            >
                              {/* Applicant Header details */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                                <div>
                                  <span className="text-xs font-black text-[#9A5D16] uppercase block">Prospective Parent</span>
                                  <span className="text-base font-black text-[#0F5C94]">
                                    {app.applicantName}
                                  </span>
                                  <span className="text-[10px] text-stone-500 font-bold ml-2">
                                    Applied: {app.dateApplied}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-stone-500">App Status:</span>
                                  {getStatusBadge(app.currentStatus)}
                                </div>
                              </div>

                              {/* Comprehensive Grid of Applicant Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold text-[#0F5C94]">
                                <div className="bg-[#FAF5EB]/50 p-3 rounded-xl border border-[#F8E6BF]/40">
                                  <span className="text-[10px] text-stone-500 font-bold uppercase block mb-0.5">Contact Details</span>
                                  <p>📞 {app.applicantPhone}</p>
                                  <p className="mt-0.5">✉️ {app.applicantEmail}</p>
                                </div>

                                <div className="bg-[#FAF5EB]/50 p-3 rounded-xl border border-[#F8E6BF]/40">
                                  <span className="text-[10px] text-stone-500 font-bold uppercase block mb-0.5">Housing & Location</span>
                                  <p>🏠 {app.housingType}</p>
                                  <p className="mt-0.5">📍 {app.applicantAddress || 'Not Provided'}</p>
                                </div>

                                <div className="bg-[#FAF5EB]/50 p-3 rounded-xl border border-[#F8E6BF]/40">
                                  <span className="text-[10px] text-stone-500 font-bold uppercase block mb-0.5">Pet Compatibility</span>
                                  <p>🐾 Experience: {app.petExperience}</p>
                                  <p className="mt-0.5">🐶 Has other pets: {app.hasOtherPets ? 'Yes' : 'No'}</p>
                                </div>
                              </div>

                              {/* Statement / Match Compatibility */}
                              <div className="bg-[#FAF5EB] p-4 rounded-xl border border-[#F8E6BF] space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-[#9A5D16] font-black uppercase tracking-wider block">
                                    Fit Statement & Story
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                                    app.eligibilityResult === 'APPLICABLE' 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}>
                                    Eligibility: {app.eligibilityResult}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-600 italic font-medium leading-relaxed">
                                  "{app.fitReason}"
                                </p>
                                {app.ineligibilityReason && (
                                  <p className="text-[10px] text-[#FB4504] font-bold">
                                    Compatibility Note: {app.ineligibilityReason}
                                  </p>
                                )}
                              </div>

                              {/* Interactive Application Decision Panel */}
                              <div className="pt-2 flex flex-wrap items-center gap-2 justify-end border-t border-stone-100">
                                <span className="text-[10px] font-black uppercase text-stone-400 mr-2">Update Decision:</span>
                                
                                <button
                                  type="button"
                                  onClick={() => onUpdateApplicationStatus?.(app.id, 'Under Review')}
                                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF3E7] text-[#9A5D16] border border-[#9A5D16]/30 text-xs font-black cursor-pointer transition-colors"
                                >
                                  Under Review
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onUpdateApplicationStatus?.(app.id, 'Approved')}
                                  className="px-3 py-1.5 rounded-lg bg-[#EBF7EE] hover:bg-emerald-100 text-[#0F942D] border border-[#0F942D]/30 text-xs font-black cursor-pointer transition-colors"
                                >
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onUpdateApplicationStatus?.(app.id, 'Adopted')}
                                  className="px-3 py-1.5 rounded-lg bg-[#0F5C94] hover:bg-[#0b4875] text-white text-xs font-black cursor-pointer transition-all"
                                >
                                  Adopted
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onUpdateApplicationStatus?.(app.id, 'Rejected')}
                                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#FB4504] border border-red-200 text-xs font-black cursor-pointer transition-colors"
                                >
                                  Reject
                                </button>
                              </div>

                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center bg-white rounded-2xl border-2 border-[#0F5C94]/10">
                          <p className="text-xs text-[#0F5C94]/70 font-bold">
                            No applications submitted for this pet yet. When users apply to adopt, their comprehensive info will appear here instantly!
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty Listed Pets State */
            <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-10 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F6D97B] border-2 border-[#0F5C94] flex items-center justify-center mx-auto text-[#0F5C94] shadow-[3px_3px_0px_#0F5C94]">
                <PawIcon className="w-8 h-8 fill-[#FB4504]" />
              </div>
              <h3 className="text-2xl font-titan text-[#0F5C94]">
                No Listed Pets Yet
              </h3>
              <p className="text-xs sm:text-sm text-[#0F5C94]/80 font-medium">
                You haven't listed any pets for adoption. Tap "List a Pet" in the navigation bar to post your first rescue companion!
              </p>
            </div>
          )}

          <AnimalMarqueeTape className="mt-12 mb-2 sm:mt-16 sm:mb-4" />
        </div>
      </div>
    );
  }

  // Standard ADOPTER view: Original design remains fully intact and untouched
  const filteredApplications = applications;

  // Render Status Message based on status
  const renderStatusMessage = (status: ApplicationStatus) => {
    return (
      <div className="p-4 bg-[#FAF5EB] rounded-xl border border-[#F8E6BF] text-xs font-bold text-[#0F5C94]">
        The pet's owner/foster will reach out to you shortly.
      </div>
    );
  };

  return (
    <div className="py-10 lg:py-16 min-h-[calc(100vh-5rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F6D97B] text-[#0F5C94] text-xs font-black uppercase tracking-wider mb-2 border-2 border-[#0F5C94]">
              <CustomIcon name="file" className="w-3.5 h-3.5 text-[#0F942D]" />
              <span>Real-Time Status Tracker</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-titan text-[#0F5C94] tracking-normal">
              STATUS
            </h1>

            <p className="text-xs sm:text-sm text-[#0F5C94]/85 font-medium mt-1 max-w-xl">
              Track the live progress of your adoption requests, shelter review notes, and meet-and-greet schedules.
            </p>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-6">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                id={`app-card-${app.id}`}
                className="bg-[#FAF5EB] rounded-3xl p-6 sm:p-8 border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] transition-all space-y-6"
              >
                {/* Top Row: Pet Details + Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.petImage}
                      alt={app.petName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-center border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] shrink-0"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl sm:text-3xl font-titan text-[#0F5C94]">
                          {app.petName}
                        </h3>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#F6D97B] text-[#0F5C94] border border-[#0F5C94]">
                          {app.petType}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-[#9A5D16] mt-0.5">
                        {app.petBreed} · {app.petLocation}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-[#0F5C94]/70 font-bold mt-1">
                        <span>ID: <strong className="text-[#0F5C94]">{app.id}</strong></span>
                        <span>•</span>
                        <span>Applied: <strong>{app.dateApplied}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="self-start sm:self-center flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F5C94]/70">Status:</span>
                    {getStatusBadge(app.currentStatus)}
                  </div>
                </div>

                {/* VISUAL STATUS MESSAGE COMPONENT */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-[#0F5C94]/20 shadow-[2px_2px_0px_#0F5C94]/10">
                  <h4 className="text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-2">
                    Application Status
                  </h4>
                  {renderStatusMessage(app.currentStatus)}
                </div>

                {/* Shelter Note or Info Summary */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-[#0F5C94]/20 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#F6D97B] border border-[#0F5C94] text-[#0F5C94] shrink-0">
                    <CustomIcon name="message" className="w-4 h-4 text-[#0F5C94]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-[#0F5C94] uppercase">
                      Coordinator Update
                    </h5>
                    <p className="text-xs text-[#0F5C94]/85 font-medium mt-0.5 leading-relaxed">
                      Your eligibility is currently checked. If there are additional documents needed, our counselors will contact you.
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#0F5C94]/15">
                  <div className="flex items-center gap-2 text-xs font-black text-[#0F942D]">
                    <CustomIcon name="tick" className="w-4 h-4 text-[#0F942D]" />
                    <span>Direct Shelter Application · Verified Process</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      id={`app-view-pet-btn-${app.id}`}
                      onClick={() => onSelectPetById(app.petId)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-[#F6D97B] text-[#0F5C94] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] transition-all cursor-pointer"
                    >
                      View {app.petName}'s Profile
                    </button>

                    <button
                      id={`app-details-btn-${app.id}`}
                      onClick={() => setActiveAppDetail(app)}
                      className="px-4 py-2 rounded-xl bg-[#0F5C94] hover:bg-[#0b4875] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[2px_2px_0px_#FB4504] transition-all cursor-pointer"
                    >
                      Application Details
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty Applications State */
          <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-10 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F6D97B] border-2 border-[#0F5C94] flex items-center justify-center mx-auto text-[#0F5C94] shadow-[3px_3px_0px_#0F5C94]">
              <PawIcon className="w-8 h-8 fill-[#FB4504]" />
            </div>
            <h3 className="text-2xl font-titan text-[#0F5C94]">
              No applications in this view
            </h3>
            <p className="text-xs sm:text-sm text-[#0F5C94]/80 font-medium">
              Ready to find your companion? Explore our available pets, choose a match, and submit an application to begin your journey.
            </p>
            <button
              id="empty-app-explore-btn"
              onClick={onExplorePets}
              className="px-6 py-3 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <CustomIcon name="discover" className="w-4 h-4" />
              <span>Explore Available Pets</span>
            </button>
          </div>
        )}

        {/* Detailed Application Modal */}
        {activeAppDetail && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-3 border-[#0F5C94] shadow-[8px_8px_0px_#0F5C94] space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between border-b-2 border-[#0F5C94]/15 pb-3">
                <div>
                  <span className="text-xs font-black text-[#9A5D16] uppercase tracking-wider">Application Summary</span>
                  <h3 className="text-xl font-titan text-[#0F5C94]">
                    ID: {activeAppDetail.id}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveAppDetail(null)}
                  className="p-2 rounded-xl bg-white hover:bg-[#FB4504] hover:text-white text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-[#FAF5EB] p-3 rounded-xl border-2 border-[#0F5C94]/20">
                  <span className="font-bold text-[#0F5C94]/60 block text-[10px] uppercase">Target Pet</span>
                  <span className="text-sm font-titan text-[#0F5C94]">
                    {activeAppDetail.petName} ({activeAppDetail.petBreed})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#FAF5EB] p-3 rounded-xl border-2 border-[#0F5C94]/20">
                    <span className="font-bold text-[#0F5C94]/60 block text-[10px] uppercase">Applicant</span>
                    <span className="font-bold text-[#0F5C94]">You</span>
                  </div>
                  <div className="bg-[#FAF5EB] p-3 rounded-xl border-2 border-[#0F5C94]/20">
                    <span className="font-bold text-[#0F5C94]/60 block text-[10px] uppercase">Contact</span>
                    <span className="font-bold text-[#0F5C94]">{activeAppDetail.applicantPhone}</span>
                  </div>
                </div>

                <div className="bg-[#FAF5EB] p-3 rounded-xl border-2 border-[#0F5C94]/20">
                  <span className="font-bold text-[#0F5C94]/60 block text-[10px] uppercase">Housing & Lifestyle</span>
                  <span className="font-bold text-[#0F5C94]">
                    {activeAppDetail.housingType} · {activeAppDetail.petExperience}
                  </span>
                </div>

                <div className="bg-[#FAF5EB] p-3 rounded-xl border-2 border-[#0F5C94]/20">
                  <span className="font-bold text-[#0F5C94]/60 block text-[10px] uppercase">Fit Statement</span>
                  <p className="text-[#0F5C94]/85 italic mt-0.5 font-medium">
                    "{activeAppDetail.fitReason}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveAppDetail(null)}
                className="w-full py-3 rounded-xl bg-[#0F5C94] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#FB4504] cursor-pointer"
              >
                Close Summary
              </button>
            </div>
          </div>
        )}

        {/* Moving Animal Icons Marquee Tape above Footer */}
        <AnimalMarqueeTape className="mt-12 mb-2 sm:mt-16 sm:mb-4" />
      </div>
    </div>
  );
};
