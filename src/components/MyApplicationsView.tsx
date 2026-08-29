import React, { useState } from 'react';
import { CustomIcon } from './CustomIcon';
import { AdoptionApplication, ApplicationStatus } from '../backend/types';
import { PawIcon } from './PawDecorations';
import { AnimalMarqueeTape } from './AnimalMarqueeTape';

interface MyApplicationsViewProps {
  applications: AdoptionApplication[];
  onExplorePets: () => void;
  onSelectPetById: (petId: string) => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({
  applications,
  onExplorePets,
  onSelectPetById,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [activeAppDetail, setActiveAppDetail] = useState<AdoptionApplication | null>(null);

  const filteredApplications = applications.filter((app) => {
    if (selectedStatusFilter === 'All') return true;
    if (selectedStatusFilter === 'Active') return app.currentStatus === 'Pending' || app.currentStatus === 'Under Review';
    if (selectedStatusFilter === 'Approved') return app.currentStatus === 'Approved' || app.currentStatus === 'Adopted';
    return app.currentStatus === selectedStatusFilter;
  });

  // Render Visual Timeline based on status
  const renderTimeline = (status: ApplicationStatus) => {
    if (status === 'Rejected') {
      return (
        <div className="flex items-center justify-between relative max-w-md w-full pt-4 pb-2">
          {/* Connector line */}
          <div className="absolute top-7 left-6 right-6 h-0.5 bg-red-200 -z-0" />

          {/* Stage 1: Applied */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#0F942D] text-white flex items-center justify-center text-xs font-black shadow-xs">
              ✓
            </div>
            <span className="text-[11px] font-bold text-[#0F942D] mt-1">Applied</span>
          </div>

          {/* Stage 2: Reviewed */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#0F942D] text-white flex items-center justify-center text-xs font-black shadow-xs">
              ✓
            </div>
            <span className="text-[11px] font-bold text-[#0F942D] mt-1">Reviewed</span>
          </div>

          {/* Stage 3: Not Approved */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#FB4504] text-white flex items-center justify-center text-xs font-black shadow-xs">
              ×
            </div>
            <span className="text-[11px] font-bold text-[#FB4504] mt-1">Not Approved</span>
          </div>
        </div>
      );
    }

    // Normal progression stages: Applied -> Under Review -> Approved -> Adopted
    const stages = [
      { key: 'Applied', label: 'Applied' },
      { key: 'Under Review', label: 'Under Review' },
      { key: 'Approved', label: 'Approved' },
      { key: 'Adopted', label: 'Adopted' },
    ];

    const getStageIndex = (s: ApplicationStatus) => {
      switch (s) {
        case 'Pending': return 0;
        case 'Under Review': return 1;
        case 'Approved': return 2;
        case 'Adopted': return 3;
        default: return 0;
      }
    };

    const currentStageIndex = getStageIndex(status);

    return (
      <div className="flex items-center justify-between relative max-w-lg w-full pt-4 pb-2">
        {/* Connector line */}
        <div className="absolute top-7.5 left-6 right-6 h-1 bg-[#F8E6BF] -z-0" />
        
        {/* Active progress highlight line */}
        <div
          className="absolute top-7.5 left-6 h-1 bg-[#0F942D] transition-all duration-500 -z-0"
          style={{ width: `${(currentStageIndex / (stages.length - 1)) * 90}%` }}
        />

        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isUpcoming = idx > currentStageIndex;

          return (
            <div key={stage.key} className="flex flex-col items-center z-10">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  isCompleted
                    ? 'bg-[#0F942D] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#0F5C94] text-white ring-4 ring-[#F6D97B] shadow-md scale-110'
                    : 'bg-white border-2 border-[#F8E6BF] text-stone-400'
                }`}
              >
                {isCompleted ? '✓' : isCurrent ? '●' : '○'}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-extrabold mt-1 text-center whitespace-nowrap ${
                  isCurrent
                    ? 'text-[#0F5C94] font-black'
                    : isCompleted
                    ? 'text-[#0F942D]'
                    : 'text-stone-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
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

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2 bg-[#FAF5EB] p-1.5 rounded-2xl border-2 border-[#0F5C94] shadow-[3px_3px_0px_#0F5C94]">
            {['All', 'Active', 'Approved'].map((tab) => (
              <button
                key={tab}
                id={`app-filter-tab-${tab.toLowerCase()}`}
                onClick={() => setSelectedStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedStatusFilter === tab
                    ? 'bg-[#0F5C94] text-white shadow-[2px_2px_0px_#FB4504]'
                    : 'text-[#0F5C94] hover:bg-[#F6D97B]'
                }`}
              >
                {tab}
              </button>
            ))}
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

                {/* VISUAL TIMELINE COMPONENT */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-[#0F5C94]/20 shadow-[2px_2px_0px_#0F5C94]/10">
                  <h4 className="text-xs font-black text-[#0F5C94] uppercase tracking-wider mb-2">
                    Adoption Journey Timeline
                  </h4>
                  {renderTimeline(app.currentStatus)}
                </div>

                {/* Shelter Coordinator Note */}
                {app.timelineNotes?.shelterNote && (
                  <div className="p-3.5 rounded-2xl bg-white border-2 border-[#0F5C94]/20 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#F6D97B] border border-[#0F5C94] text-[#0F5C94] shrink-0">
                      <CustomIcon name="message" className="w-4 h-4 text-[#0F5C94]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-[#0F5C94] uppercase">
                        Coordinator Update
                      </h5>
                      <p className="text-xs text-[#0F5C94]/85 font-medium mt-0.5 leading-relaxed">
                        {app.timelineNotes.shelterNote}
                      </p>
                    </div>
                  </div>
                )}

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
