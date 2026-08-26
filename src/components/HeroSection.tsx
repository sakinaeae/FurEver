import React from 'react';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';

interface HeroSectionProps {
  onFindYourMatch: () => void;
  onExplorePets: () => void;
  availableCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFindYourMatch,
  onExplorePets,
  availableCount,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
        <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 xl:gap-18 items-center">
            
            {/* Left Column: Bobi Photo Card */}
            <div className="md:col-span-5 relative flex items-center justify-center pt-2 md:pt-0 md:pr-2">
              <div className="relative mx-auto max-w-[280px] sm:max-w-xs md:max-w-sm w-full">
                
                {/* Tilted Photo Frame */}
                <div className="w-[240px] sm:w-[280px] md:w-[300px] lg:w-[330px] h-[340px] sm:h-[400px] md:h-[420px] lg:h-[450px] bg-[#FAF5EB] rounded-2xl -rotate-2 shadow-[8px_8px_0px_#0F5C94] overflow-hidden relative border-3 border-[#0F5C94] mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800"
                    alt="Cute Pug Bobi waiting for adoption"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Bottom Card Text */}
                  <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 text-white z-10">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-titan block tracking-normal text-white">BOBI</span>
                    <p className="font-bold uppercase tracking-[0.18em] text-[10px] sm:text-xs text-[#F6D97B]">Pug Mix • 2 yrs • Indiranagar</p>
                  </div>
                </div>

                {/* Yellow Stamp Badge */}
                <div className="absolute -top-3 -right-2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#F6D97B] rounded-full flex items-center justify-center rotate-12 shadow-[3px_3px_0px_#0F5C94] border-2 border-[#0F5C94] z-20">
                  <div className="font-titan text-[10px] sm:text-xs md:text-sm text-center uppercase leading-tight text-[#0F5C94]">
                    Adopt<br /><span className="text-[#FB4504]">Me!</span>
                  </div>
                </div>

                {/* Floating Match Pill */}
                <div className="absolute -bottom-3 -left-2 z-20 bg-[#FB4504] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-[3px_3px_0px_#0F5C94] border-2 border-[#0F5C94] flex items-center gap-1.5 font-black text-[10px] sm:text-xs uppercase tracking-wider transform -rotate-2">
                  <PawIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-white" />
                  <span>People's Favourite</span>
                </div>

              </div>
            </div>

            {/* Right Column: Hero Headline & Text */}
            <div className="md:col-span-7 space-y-6 md:space-y-7 text-left md:pl-2">
              
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F6D97B] border-2 border-[#0F5C94] text-[#0F5C94] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#0F5C94]">
                <PawIcon className="w-4 h-4 fill-[#FB4504]" />
                <span>Pet Adoption, Reimagined</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F942D]" />
                <span className="text-[#0F942D] font-black">{availableCount} Pets Waiting</span>
              </div>

              {/* Hero Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#0F5C94] tracking-tight leading-[1.1] max-w-lg">
                Find a <span className="font-titan text-[#FB4504] tracking-normal">friend.</span><br />
                Give them a <span className="font-titan text-[#FB4504] tracking-normal">forever.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base lg:text-lg text-[#0F5C94]/85 font-medium max-w-md mx-0 leading-relaxed">
                A thoughtful way to discover pets, find the right match and manage your journey to adoption.
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3.5">
                <button
                  id="hero-find-match-btn"
                  onClick={onFindYourMatch}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-[#0F5C94] hover:bg-[#0c4a77] text-white font-black text-sm sm:text-base tracking-wide border-2 border-[#0F5C94] shadow-[4px_4px_0px_#FB4504] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#FB4504] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Find Your Match</span>
                  <CustomIcon name="sparkle" white className="w-4 h-4" />
                </button>

                <button
                  id="hero-explore-pets-btn"
                  onClick={onExplorePets}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-[#F6D97B]/40 text-[#0F5C94] font-black text-sm sm:text-base tracking-wide border-2 border-[#0F5C94] shadow-[4px_4px_0px_#FB4504] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#FB4504] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CustomIcon name="discover" className="w-4 h-4" />
                  <span>Explore Pets</span>
                  <CustomIcon name="right-arrow" className="w-4 h-4" />
                </button>
              </div>

              {/* Trust & Guarantee Highlights */}
              <div className="pt-3 grid grid-cols-3 gap-2 sm:gap-4 border-t-2 border-[#0F5C94]/15 max-w-lg mx-0 font-bold text-xs uppercase tracking-wider text-[#9A5D16]">
                <div className="flex items-center gap-1.5 text-left">
                  <CustomIcon name="circle-tick" className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] sm:text-xs">Health Checked</span>
                </div>
                <div className="flex items-center gap-1.5 text-left">
                  <CustomIcon name="circle-tick" className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] sm:text-xs">100% Ethical</span>
                </div>
                <div className="flex items-center gap-1.5 text-left">
                  <CustomIcon name="circle-tick" className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] sm:text-xs">Live Tracking</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
