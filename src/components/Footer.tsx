import React from 'react';
import { Heart, Compass, Sparkles, SlidersHorizontal, FileText, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { PawIcon } from './PawDecorations';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onFindYourMatch?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#0F5C94] text-white pt-16 pb-12 border-t-8 border-[#FB4504] relative overflow-hidden">
      {/* Decorative background paw */}
      <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
        <PawIcon className="w-80 h-80 fill-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* 3 Balanced Sections without dividing line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 pb-10">
          
          {/* Section 1: Brand Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6D97B] border-2 border-white flex items-center justify-center text-[#0F5C94] shadow-[3px_3px_0px_#FB4504]">
                <PawIcon className="w-5 h-5 fill-[#0F5C94]" />
              </div>
              <span className="text-3xl sm:text-4xl font-titan tracking-normal text-white">
                FUREVER
              </span>
            </div>

            <p className="text-white/85 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Making pet adoption easier to discover, apply for and track. Connecting shelter animals with loving, lifelong families through modern discovery tools.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#0F942D] text-white text-[10px] font-black uppercase tracking-wider border border-white/30">
                100% Ethical Rescues
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#FB4504] text-white text-[10px] font-black uppercase tracking-wider border border-white/30">
                Direct Applications
              </span>
            </div>
          </div>

          {/* Section 2: Explore Furever */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#F6D97B]">
              Explore Furever
            </h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-white/80">
              <li>
                <button
                  onClick={() => {
                    onSelectTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F6D97B] transition-colors cursor-pointer"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab('browse');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F6D97B] transition-colors cursor-pointer"
                >
                  Find a Pet (Browse)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab('swipe');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F6D97B] transition-colors cursor-pointer"
                >
                  Swipe to Match
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab('quiz');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F6D97B] transition-colors cursor-pointer"
                >
                  Match Finder Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab('how-it-works');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F6D97B] transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectTab('applications');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F6D97B] transition-colors cursor-pointer"
                >
                  Status
                </button>
              </li>
            </ul>
          </div>

          {/* Section 3: Adoption Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#F6D97B]">
              Adoption Support
            </h4>
            <div className="space-y-3 text-xs text-white/85 font-medium">
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F6D97B] shrink-0" />
                <span>support@furever-adopt.org</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F6D97B] shrink-0" />
                <span>1800 234 7890 (Toll Free)</span>
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F6D97B] shrink-0" />
                <span>Bengaluru, Karnataka</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center text-center text-xs text-white/80 gap-3 font-medium">
          <div className="flex items-center gap-2">
            <span>© 2026 FUREVER. By Sakina Ali, Phalak Bhandari, Tanmaya A & Deveshi pande</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
