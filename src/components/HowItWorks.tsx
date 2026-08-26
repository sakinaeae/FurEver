import React from 'react';
import { Search, Sparkles, FileCheck, ArrowRight, Layers } from 'lucide-react';
import { PawIcon } from './PawDecorations';

interface HowItWorksProps {
  onDiscoverClick: () => void;
  onMeetClick: () => void;
  onConnectClick: () => void;
  onSwipeClick?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onDiscoverClick,
  onMeetClick,
  onConnectClick,
  onSwipeClick,
}) => {
  return (
    <section className="py-12 lg:py-16 bg-[#ffca42] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
        <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-6 sm:p-10 lg:p-14">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FB4504] text-white text-xs font-black uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#0F5C94] border-2 border-[#0F5C94]">
              <PawIcon className="w-3.5 h-3.5 fill-white" />
              <span>THE ADOPTION JOURNEY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-titan text-[#0F5C94] tracking-normal mb-3">
              HOW IT WORKS
            </h2>
            <p className="text-sm sm:text-base text-[#0F5C94]/80 font-medium">
              We make welcoming a new best friend into your life simple, ethical, and joyful every step of the way.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 01: DISCOVER with quick connect buttons */}
            <div className="bg-white rounded-2xl p-6 border-3 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0F5C94] transition-all duration-200 flex flex-col justify-between">
              <div>
                {/* Top row */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl sm:text-5xl font-titan tracking-normal text-[#0F5C94]">
                    01
                  </span>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] bg-[#E8F3FA] text-[#0F5C94]">
                    <Search className="w-6 h-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-titan text-[#0F5C94] tracking-normal mb-1">
                  DISCOVER
                </h3>
                <p className="text-xs font-black uppercase tracking-wider text-[#FB4504] mb-3">
                  Ways to find & connect with pets
                </p>

                <p className="text-xs sm:text-sm text-[#0F5C94]/80 leading-relaxed font-medium mb-4">
                  Find your future best friend using whichever style fits you best:
                </p>

                {/* Button-like ways to connect */}
                <div className="space-y-2">
                  <button
                    onClick={onDiscoverClick}
                    className="w-full p-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#0F5C94] text-[#0F5C94] hover:text-white border-2 border-[#0F5C94] text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_#0F5C94] group"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-[#0F5C94] group-hover:text-white" />
                      <span>Find a Pet (Browse)</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onSwipeClick || onDiscoverClick}
                    className="w-full p-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#FB4504] text-[#0F5C94] hover:text-white border-2 border-[#0F5C94] text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_#0F5C94] group"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#FB4504] group-hover:text-white" />
                      <span>Swipe to Match</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onMeetClick}
                    className="w-full p-2.5 rounded-xl bg-[#FAF5EB] hover:bg-[#9A5D16] text-[#0F5C94] hover:text-white border-2 border-[#0F5C94] text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-[2px_2px_0px_#0F5C94] group"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#9A5D16] group-hover:text-white" />
                      <span>Match Finder Quiz</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Step 02: MEET */}
            <div className="bg-white rounded-2xl p-6 border-3 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0F5C94] transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl sm:text-5xl font-titan tracking-normal text-[#9A5D16]">
                    02
                  </span>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] bg-[#FAF3E7] text-[#9A5D16]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-titan text-[#0F5C94] tracking-normal mb-1">
                  MEET
                </h3>
                <p className="text-xs font-black uppercase tracking-wider text-[#FB4504] mb-3">
                  Find animals that fit your preferences.
                </p>

                <p className="text-xs sm:text-sm text-[#0F5C94]/80 leading-relaxed font-medium">
                  Compare personality traits, medical verifications, and compatibility with kids or other pets before taking the next meaningful step.
                </p>
              </div>
            </div>

            {/* Step 03: CONNECT */}
            <div className="bg-white rounded-2xl p-6 border-3 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0F5C94] transition-all duration-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl sm:text-5xl font-titan tracking-normal text-[#0F942D]">
                    03
                  </span>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] bg-[#EBF7EE] text-[#0F942D]">
                    <FileCheck className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-titan text-[#0F5C94] tracking-normal mb-1">
                  CONNECT
                </h3>
                <p className="text-xs font-black uppercase tracking-wider text-[#FB4504] mb-3">
                  Apply and follow your adoption journey.
                </p>

                <p className="text-xs sm:text-sm text-[#0F5C94]/80 leading-relaxed font-medium">
                  Complete a friendly, transparent application form, receive your tracking ID, and follow status updates from review to meet-and-greet.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={onConnectClick}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#0F5C94] flex items-center justify-center gap-1.5 transition-all hover:bg-[#0F5C94] hover:text-white cursor-pointer shadow-[2px_2px_0px_#0F5C94] bg-[#EBF7EE] text-[#0F942D]"
                >
                  <span>Check Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
