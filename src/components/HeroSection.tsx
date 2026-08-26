import React from 'react';
import { ArrowRight, Sparkles, Compass, CheckCircle2 } from 'lucide-react';
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
    <section className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-20 bg-[#ffca42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
        <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center">
            
            {/* Left Column: Expressive Editorial Copy */}
            <div className="lg:col-span-7 space-y-7 text-left lg:pr-8">
              
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F6D97B] border-2 border-[#0F5C94] text-[#0F5C94] font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#0F5C94]">
                <PawIcon className="w-4 h-4 fill-[#FB4504]" />
                <span>Pet Adoption, Reimagined</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F942D]" />
                <span className="text-[#0F942D] font-black">{availableCount} Pets Waiting</span>
              </div>

              {/* Hero Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-[#0F5C94] tracking-tight leading-[1.1] max-w-lg">
                Find a <span className="font-titan text-[#FB4504] tracking-normal">friend.</span><br />
                Give them a <span className="font-titan text-[#FB4504] tracking-normal">forever.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#0F5C94]/85 font-medium max-w-md mx-0 leading-relaxed">
                A thoughtful way to discover pets, find the right match and manage your journey to adoption.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3.5">
                <button
                  id="hero-find-match-btn"
                  onClick={onFindYourMatch}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0F5C94] hover:bg-[#0c4a77] text-white font-black text-base tracking-wide border-2 border-[#0F5C94] shadow-[4px_4px_0px_#FB4504] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#FB4504] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Find Your Match</span>
                  <Sparkles className="w-4 h-4 text-[#F6D97B]" />
                </button>

                <button
                  id="hero-explore-pets-btn"
                  onClick={onExplorePets}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-[#F6D97B]/40 text-[#0F5C94] font-black text-base tracking-wide border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#0F5C94] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#9A5D16]" />
                  <span>Explore Pets</span>
                  <ArrowRight className="w-4 h-4 text-[#0F5C94]" />
                </button>
              </div>

              {/* Trust & Guarantee Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t-2 border-[#0F5C94]/15 max-w-lg mx-0 font-bold text-xs uppercase tracking-wider text-[#9A5D16]">
                <div className="flex items-center gap-1.5 text-left">
                  <CheckCircle2 className="w-4 h-4 text-[#0F942D] shrink-0" />
                  <span className="text-[11px] sm:text-xs">Health Checked</span>
                </div>
                <div className="flex items-center gap-1.5 text-left">
                  <CheckCircle2 className="w-4 h-4 text-[#0F942D] shrink-0" />
                  <span className="text-[11px] sm:text-xs">100% Ethical</span>
                </div>
                <div className="flex items-center gap-1.5 text-left">
                  <CheckCircle2 className="w-4 h-4 text-[#0F942D] shrink-0" />
                  <span className="text-[11px] sm:text-xs">Live Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Hero Visual Composition with BOBI */}
            <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0 lg:pl-4">
              <div className="relative mx-auto max-w-sm w-full">
                
                {/* Tilted Photo Frame */}
                <div className="w-[280px] sm:w-[330px] h-[400px] sm:h-[450px] bg-[#FAF5EB] rounded-2xl rotate-2 shadow-[8px_8px_0px_#0F5C94] overflow-hidden relative border-3 border-[#0F5C94] mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800"
                    alt="Cute Pug Bobi waiting for adoption"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating Bottom Card Text */}
                  <div className="absolute bottom-6 left-6 text-white z-10">
                    <span className="text-4xl sm:text-5xl font-titan block tracking-normal text-white">BOBI</span>
                    <p className="font-bold uppercase tracking-[0.18em] text-xs text-[#F6D97B]">Pug Mix • 2 yrs • Indiranagar</p>
                  </div>
                </div>

                {/* Yellow Stamp Badge */}
                <div className="absolute -top-3 -right-2 w-20 h-20 sm:w-24 sm:h-24 bg-[#F6D97B] rounded-full flex items-center justify-center rotate-12 shadow-[3px_3px_0px_#0F5C94] border-2 border-[#0F5C94] z-20">
                  <div className="font-titan text-xs sm:text-sm text-center uppercase leading-tight text-[#0F5C94]">
                    Adopt<br /><span className="text-[#FB4504]">Me!</span>
                  </div>
                </div>

                {/* Floating Match Pill */}
                <div className="absolute -bottom-3 -left-2 z-20 bg-[#FB4504] text-white px-4 py-2 rounded-xl shadow-[3px_3px_0px_#0F5C94] border-2 border-[#0F5C94] flex items-center gap-1.5 font-black text-xs uppercase tracking-wider transform -rotate-2">
                  <PawIcon className="w-3.5 h-3.5 fill-white" />
                  <span>People's Favourite</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
