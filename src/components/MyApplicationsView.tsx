import React, { useState } from 'react';
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
  onDeleteApplication?: (appId: string) => void;
  onOpenSignIn?: () => void;
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
  onDeleteApplication,
  onOpenSignIn,
}) => {
  const [activeAppDetail, setActiveAppDetail] = useState<AdoptionApplication | null>(null);
  const [petIdToRemoveConfirm, setPetIdToRemoveConfirm] = useState<string | null>(null);
  const [appToDeleteConfirm, setAppToDeleteConfirm] = useState<AdoptionApplication | null>(null);

  const isLister = userProfile?.role === 'Pet Lister' || userProfile?.role?.toLowerCase() === 'pet lister';

  if (!userProfile) {
    return (
      <div className="py-20 lg:py-32 min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
        <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-8 sm:p-10 text-center max-w-lg mx-auto space-y-4 w-full animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-[#F6D97B] border-2 border-[#0F5C94] flex items-center justify-center mx-auto text-[#0F5C94] shadow-[3px_3px_0px_#0F5C94]">
            <CustomIcon name="user" className="w-8 h-8 text-[#0F5C94]" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFFBEA] text-[#9A5D16] border border-[#F6D97B]">
            Authentication Required
          </span>
          <h3 className="text-2xl sm:text-3xl font-titan text-[#0F5C94]">
            Sign In to View Status
          </h3>
          <p className="text-xs sm:text-sm text-[#0F5C94]/80 font-medium max-w-sm mx-auto">
            Please log in or create an account to view your adoption application status or access your listed pets.
          </p>
          {onOpenSignIn && (
            <div className="pt-2 max-w-xs mx-auto">
              <button
                type="button"
                onClick={onOpenSignIn}
                className="w-full py-3 rounded-xl bg-[#FB4504] hover:bg-[#e03a00] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] cursor-pointer transition-all"
              >
                Sign In Now
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Helper for Status Badge
  const getStatusBadge = (status?: ApplicationStatus) => {
    const s = status || 'Pending';
    switch (s) {
      case 'Approved':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#EBF7EE] text-[#0F942D] border border-[#0F942D]/30">Approved</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-red-50 text-[#FB4504] border border-red-200">Rejected</span>;
      case 'Under Review':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FAF3E7] text-[#9A5D16] border border-[#9A5D16]/20">Under Review</span>;
      case 'Adopted':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#0F5C94] text-white">Adopted</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFFBEA] text-[#9A5D16] border border-[#F6D97B]">Pending Review</span>;
    }
  };

  // PET LISTER VIEW
  if (isLister) {
    const myListedPets = pets.filter(p => p.petListerId === userProfile.userId);

    return (
      <div className="py-10 lg:py-16 min-h-[calc(100vh-5rem)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F6D97B] text-[#0F5C94] text-xs font-black uppercase tracking-wider mb-2 border-2 border-[#0F5C94]">
                <CustomIcon name="file" className="w-3.5 h-3.5 text-[#0F942D]" />
                <span>Pet Lister Dashboard</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-titan text-[#0F5C94] tracking-normal">
                MY LISTED PETS & APPLICATIONS
              </h1>
              <p className="text-xs sm:text-sm text-[#0F5C94]/85 font-medium mt-1 max-w-xl">
                Manage your listed rescue pets and review prospective adopter applications. Approve or reject applicants directly.
              </p>
            </div>
          </div>

          {/* Listed Pets Grid / List */}
          {myListedPets.length > 0 ? (
            <div className="space-y-10">
              {myListedPets.map((pet) => {
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
                                <span className="text-[10px] font-black text-red-600">Remove?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onRemovePet(pet.id);
                                    setPetIdToRemoveConfirm(null);
                                    showToast(`Removed ${pet.name} listing`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-xs cursor-pointer"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPetIdToRemoveConfirm(null)}
                                  className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                                >
                                  No
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPetIdToRemoveConfirm(pet.id)}
                                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#FB4504] font-black text-xs border border-red-200 cursor-pointer transition-colors"
                              >
                                Delete Listing
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Applications for this Pet */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-titan text-[#0F5C94] uppercase tracking-wider">
                          Adopter Applications ({petApps.length})
                        </h4>
                      </div>

                      {petApps.length > 0 ? (
                        <div className="space-y-3">
                          {petApps.map((app) => (
                            <div
                              key={app.id}
                              className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-[#0F5C94]/15 shadow-sm space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-[#FAF5EB] border border-[#0F5C94]/20 flex items-center justify-center font-titan text-[#0F5C94]">
                                    {app.applicantName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h5 className="font-titan text-base text-[#0F5C94]">
                                      {app.applicantName}
                                    </h5>
                                    <p className="text-[11px] font-bold text-stone-500">
                                      {app.applicantEmail} · {app.applicantPhone}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {getStatusBadge(app.status)}
                                  <button
                                    type="button"
                                    onClick={() => setActiveAppDetail(app)}
                                    className="px-3 py-1 rounded-lg bg-[#0F5C94]/10 hover:bg-[#0F5C94]/20 text-[#0F5C94] text-xs font-bold cursor-pointer transition-colors"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>

                              {/* Statement / Match Compatibility */}
                              <div className="bg-[#FAF5EB] p-3 rounded-xl border border-[#F8E6BF] space-y-1.5">
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
                              </div>

                              {/* Interactive Application Decision Panel (Approve & Reject Only per user instructions) */}
                              <div className="pt-2 flex flex-wrap items-center gap-2 justify-end border-t border-stone-100">
                                <span className="text-[10px] font-black uppercase text-stone-400 mr-2">Update Decision:</span>

                                <button
                                  type="button"
                                  onClick={() => onUpdateApplicationStatus?.(app.id, 'Approved')}
                                  className="px-3 py-1.5 rounded-lg bg-[#EBF7EE] hover:bg-emerald-100 text-[#0F942D] border border-[#0F942D]/30 text-xs font-black cursor-pointer transition-colors"
                                >
                                  Approve
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

          {/* Detailed Application Modal */}
          {activeAppDetail && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn">
              <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-3 border-[#0F5C94] shadow-[8px_8px_0px_#0F5C94] space-y-4 animate-scaleUp">
                <div className="flex items-center justify-between border-b-2 border-[#0F5C94]/15 pb-3">
                  <div>
                    <span className="text-xs font-black text-[#9A5D16] uppercase tracking-wider">Application Summary</span>
                    <h3 className="text-xl font-titan text-[#0F5C94]">
                      Applicant: {activeAppDetail.applicantName}
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
                      <span className="font-bold text-[#0F5C94]/60 block text-[10px] uppercase">Email</span>
                      <span className="font-bold text-[#0F5C94] truncate block">{activeAppDetail.applicantEmail}</span>
                    </div>
                    <div className="bg-[#FAF5EB] p-3 rounded-xl border-2 border-[#0F5C94]/20">
                      <span className="font-bold text-[#0F5C94]/60 block text-[10px] uppercase">Contact</span>
                      <span className="font-bold text-[#0F5C94]">{activeAppDetail.applicantPhone}</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF5EB] p-3 rounded-xl border-2 border-[#0F5C94]/20">
                    <span className="font-bold text-[#0F5C94]/60 block text-[10px] uppercase">Housing & Lifestyle</span>
                    <span className="font-bold text-[#0F5C94]">
                      {activeAppDetail.housingType} · {activeAppDetail.petExperience} · Other pets: {activeAppDetail.hasOtherPets ? 'Yes' : 'No'}
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

          <AnimalMarqueeTape className="mt-12 mb-2 sm:mt-16 sm:mb-4" />
        </div>
      </div>
    );
  }

  // STANDARD ADOPTER VIEW
  const filteredApplications = applications;

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
                className="bg-[#FAF5EB] rounded-3xl p-6 sm:p-8 border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] space-y-6"
              >
                {/* Application Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-dashed border-[#0F5C94]/20">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F6D97B] border-2 border-[#0F5C94] flex items-center justify-center font-titan text-2xl text-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] shrink-0">
                      🐾
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl sm:text-3xl font-titan text-[#0F5C94]">
                          {app.petName}
                        </h3>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FFFBEA] text-[#9A5D16] border border-[#F6D97B]">
                          {app.petBreed}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-[#9A5D16] mt-0.5">
                        Application ID: {app.id} · Submitted {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Status Message & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="p-4 bg-white rounded-2xl border-2 border-[#0F5C94]/15 text-xs font-bold text-[#0F5C94] space-y-1 flex-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-[#9A5D16] block">Review Status Update</span>
                    <p>
                      {app.status === 'Approved'
                        ? '🎉 Congratulations! Your application has been approved by the pet lister. They will contact you shortly to coordinate the meet-and-greet.'
                        : app.status === 'Rejected'
                        ? 'Thank you for your interest. Unfortunately, the pet lister has decided to move forward with another applicant for this companion.'
                        : 'Your adoption application has been submitted successfully and is currently under review by the shelter/foster.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveAppDetail(app)}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF3E7] text-[#0F5C94] font-black text-xs uppercase tracking-wider border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94] cursor-pointer transition-all"
                    >
                      View Details
                    </button>

                    {onDeleteApplication && (
                      appToDeleteConfirm?.id === app.id ? (
                        <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border-2 border-red-300">
                          <span className="text-[10px] font-black text-red-600">Delete?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteApplication(app.id);
                              setAppToDeleteConfirm(null);
                              showToast('Application withdrawn');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-xs cursor-pointer"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setAppToDeleteConfirm(null)}
                            className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAppToDeleteConfirm(app)}
                          className="px-4 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-black text-xs uppercase tracking-wider border-2 border-red-300 shadow-[3px_3px_0px_#dc2626] cursor-pointer transition-all"
                        >
                          Withdraw
                        </button>
                      )
                    )}
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
                    <span className="font-bold text-[#0F5C94]">{activeAppDetail.applicantName}</span>
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

        <AnimalMarqueeTape className="mt-12 mb-2 sm:mt-16 sm:mb-4" />
      </div>
    </div>
  );
};
