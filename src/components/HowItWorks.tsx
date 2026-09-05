import React from 'react';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';

interface HowItWorksProps {
  userRole?: string;
  onDiscoverClick: () => void;
  onMeetClick: () => void;
  onConnectClick: () => void;
  onSwipeClick?: () => void;
  onListPetClick?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  userRole,
  onDiscoverClick,
  onMeetClick,
  onConnectClick,
  onSwipeClick,
  onListPetClick,
}) => {
  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
        <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-6 sm:p-10 lg:p-14">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FB4504] text-white text-xs font-black uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#0F5C94] border-2 border-[#0F5C94]">
              <PawIcon className="w-3.5 h-3.5 fill-white" />
              <span>THE ADOPTION & FOSTER JOURNEY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-titan text-[#0F5C94] tracking-normal mb-3">
              HOW IT WORKS
            </h2>
            <p className="text-sm sm:text-base text-[#0F5C94]/80 font-medium leading-relaxed">
              Whether you are looking to adopt your next best friend or need to safely rehome/foster a pet, Furever makes the entire process joyful, transparent, and simple.
            </p>
          </div>

          {/* 4 Cards Layout: 3 for Adopters + 1 for Pet Owners/Fosters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 01: DISCOVER */}
            <div className="bg-white rounded-2xl p-5 border-3 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0F5C94] transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-titan tracking-normal text-[#0F5C94]">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] bg-[#E8F3FA] text-[#0F5C94]">
                    <CustomIcon name="search" className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-titan text-[#0F5C94] tracking-normal mb-1">
                  DISCOVER
                </h3>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#FB4504] mb-2.5">
                  Find & connect with pets
                </p>

                <p className="text-xs text-[#0F5C94]/80 leading-relaxed font-medium mb-3">
                  Browse available pets, use our Tinder-style Swipe Match, or take the Match Quiz:
                </p>

                <div className="space-y-1.5">
                  <button
                    onClick={onDiscoverClick}
                    className="w-full p-2 rounded-xl bg-[#FAF5EB] hover:bg-[#0F5C94] text-[#0F5C94] hover:text-white border-2 border-[#0F5C94] text-[11px] font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_#0F5C94] group"
                  >
                    <span className="flex items-center gap-1.5">
                      <CustomIcon name="search" className="w-3.5 h-3.5 group-hover:brightness-0 group-hover:invert transition-all" />
                      <span>Browse Pets</span>
                    </span>
                    <CustomIcon name="right-arrow" className="w-3.5 h-3.5 group-hover:brightness-0 group-hover:invert transition-all" />
                  </button>

                  <button
                    onClick={onSwipeClick}
                    className="w-full p-2 rounded-xl bg-[#FAF5EB] hover:bg-[#FB4504] text-[#0F5C94] hover:text-white border-2 border-[#0F5C94] text-[11px] font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_#0F5C94] group"
                  >
                    <span className="flex items-center gap-1.5">
                      <CustomIcon name="flame" className="w-3.5 h-3.5 group-hover:brightness-0 group-hover:invert transition-all" />
                      <span>Swipe Match</span>
                    </span>
                    <CustomIcon name="right-arrow" className="w-3.5 h-3.5 group-hover:brightness-0 group-hover:invert transition-all" />
                  </button>

                  <button
                    onClick={onMeetClick}
                    className="w-full p-2 rounded-xl bg-[#FAF5EB] hover:bg-[#9A5D16] text-[#0F5C94] hover:text-white border-2 border-[#0F5C94] text-[11px] font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_#0F5C94] group"
                  >
                    <span className="flex items-center gap-1.5">
                      <CustomIcon name="sparkle" className="w-3.5 h-3.5 group-hover:brightness-0 group-hover:invert transition-all" />
                      <span>Match Quiz</span>
                    </span>
                    <CustomIcon name="right-arrow" className="w-3.5 h-3.5 group-hover:brightness-0 group-hover:invert group-hover:text-white transition-all" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 02: MEET */}
            <div className="bg-white rounded-2xl p-5 border-3 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0F5C94] transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-titan tracking-normal text-[#9A5D16]">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] bg-[#FAF3E7] text-[#9A5D16]">
                    <CustomIcon name="sparkle" className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-titan text-[#0F5C94] tracking-normal mb-1">
                  MEET & EVALUATE
                </h3>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#FB4504] mb-2.5">
                  Detailed pet profiles
                </p>

                <p className="text-xs text-[#0F5C94]/80 leading-relaxed font-medium">
                  Compare personality traits, vaccination history, medical details, and compatibility with kids or existing pets before reaching out.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#0F5C94]/10">
                <span className="text-[11px] font-bold text-[#0F5C94]/70 flex items-center gap-1">
                  <CustomIcon name="circle-tick" className="w-3.5 h-3.5 text-[#0F942D]" />
                  Verified medical records
                </span>
              </div>
            </div>

            {/* Step 03: APPLY FOR ADOPTION */}
            <div className="bg-white rounded-2xl p-5 border-3 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0F5C94] transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-titan tracking-normal text-[#0F942D]">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] bg-[#EBF7EE] text-[#0F942D]">
                    <CustomIcon name="file" className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-titan text-[#0F5C94] tracking-normal mb-1">
                  APPLY TO ADOPT
                </h3>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#FB4504] mb-2.5">
                  Instant eligibility verification
                </p>

                <p className="text-xs text-[#0F5C94]/80 leading-relaxed font-medium">
                  Submit a simple adoption inquiry form. Get real-time eligibility status checks and direct contact with shelters or foster parents!
                </p>
              </div>

              <div className="mt-4">
                <button
                  onClick={onConnectClick}
                  className="w-full py-2 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 border-[#0F5C94] flex items-center justify-center gap-1.5 transition-all hover:bg-[#0F5C94] hover:text-white cursor-pointer shadow-[2px_2px_0px_#0F5C94] bg-[#EBF7EE] text-[#0F942D] group"
                >
                  <span>Explore & Apply</span>
                  <CustomIcon name="right-arrow" className="w-3.5 h-3.5 group-hover:brightness-0 group-hover:invert transition-all" />
                </button>
              </div>
            </div>

            {/* Step 04: FOR PET OWNERS & FOSTERS (PUT UP FOR ADOPTION) */}
            <div className="bg-white rounded-2xl p-5 border-3 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0F5C94] transition-all duration-200 flex flex-col justify-between ring-2 ring-[#0F942D]/40">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl sm:text-4xl font-titan tracking-normal text-[#FB4504]">
                    04
                  </span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] bg-[#FFEAE5] text-[#FB4504]">
                    <CustomIcon name="paw" className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-titan text-[#0F5C94] tracking-normal mb-1">
                  LIST A PET
                </h3>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#0F942D] mb-2.5">
                  For Fosters & Pet Owners
                </p>

                <p className="text-xs text-[#0F5C94]/80 leading-relaxed font-medium">
                  Have a pet that needs a loving home or temporary foster? Upload their photo, temperament details, and location to connect with vetted adopters.
                </p>
              </div>

              <div className="mt-4">
                {onListPetClick ? (
                  <button
                    onClick={onListPetClick}
                    className="w-full py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 border-[#0F5C94] flex items-center justify-center gap-2 transition-all hover:bg-[#0F942D] hover:text-white cursor-pointer shadow-[2px_2px_0px_#0F5C94] bg-[#F6D97B] text-[#0F5C94] group"
                  >
                    <span>Put Pet Up For Adoption</span>
                    <CustomIcon name="right-arrow" className="w-4 h-4 shrink-0 transition-all group-hover:![filter:brightness(0)_invert(1)]" blue />
                  </button>
                ) : (
                  <div className="text-[11px] font-bold text-[#0F942D] bg-[#EBF7EE] p-2 rounded-xl text-center border border-[#0F942D]/30">
                    Use "List Pet" in top bar
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
