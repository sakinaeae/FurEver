import React from 'react';
import { CustomIcon } from './CustomIcon';
import { PawIcon } from './PawDecorations';
import { UserProfile } from './UserSignInModal';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onFindYourMatch?: () => void;
  onListPetClick?: () => void;
  userProfile?: UserProfile | null;
  onOpenSignIn?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onListPetClick, userProfile, onOpenSignIn }) => {
  const isLister = userProfile?.role === 'Pet Lister' || userProfile?.role?.toLowerCase() === 'pet lister';
  const isAdopter = userProfile?.role?.toLowerCase() === 'adopter';
  return (
    <footer className="bg-[#0F5C94] text-white pt-16 pb-12 border-t-8 border-[#FB4504] relative z-10 overflow-hidden">
      {/* Decorative background paw */}
      <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
        <PawIcon className="w-80 h-80 fill-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* 3 Balanced Sections without dividing line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 pb-10">
          
          {/* Section 1: Brand Information */}
          <div className="space-y-4">
            <div 
              id="footer-brand-logo-btn"
              onClick={() => {
                onSelectTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
            >
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#F6D97B] flex items-center justify-center text-[#0F5C94] shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform duration-200 border-2 border-white/20">
                  <CustomIcon name="paw" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl tracking-tight text-white leading-none font-titan group-hover:text-[#F6D97B] transition-colors">
                  FUREVER
                </span>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.14em] text-[#F6D97B] leading-tight mt-1">
                  Find your match. Make it furever.
                </span>
              </div>
            </div>

            <p className="text-white/85 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Making pet adoption easier to discover and apply for. Connecting shelter animals with loving, lifelong families through modern discovery tools.
            </p>
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
                  Home
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
                    if (!userProfile) {
                      if (onOpenSignIn) onOpenSignIn();
                    }
                    onSelectTab('status');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#F6D97B] transition-colors cursor-pointer"
                >
                  {isLister ? 'My Listed Pets' : 'Status'}
                </button>
              </li>
              {onListPetClick && !isAdopter && (
                <li>
                  <button
                    onClick={() => {
                      onListPetClick();
                    }}
                    className="hover:text-[#F6D97B] transition-colors cursor-pointer"
                  >
                    List Your Pet
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Section 3: Adoption Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#F6D97B]">
              Adoption Support
            </h4>
            <div className="space-y-3 text-xs text-white/85 font-medium">
              <p className="flex items-center gap-2.5">
                <CustomIcon name="mail" white className="w-5 h-5 shrink-0" />
                <a href="mailto:support@furever.com" className="hover:text-[#F6D97B] transition-colors">support@furever.com</a>
              </p>
              <p className="flex items-center gap-2.5">
                <CustomIcon name="phone" white className="w-5 h-5 shrink-0" />
                <a href="tel:18002347890" className="hover:text-[#F6D97B] transition-colors">1800 234 7890</a>
              </p>
              <p className="flex items-center gap-2.5">
                <CustomIcon name="location" white className="w-5 h-5 shrink-0" />
                <span>Bengaluru, Karnataka</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center text-center text-xs text-white/80 gap-3 font-medium">
          <div className="flex items-center gap-2">
            <span>© 2026 FUREVER. By Sakina Ali, Phalak Bhandari, Tanmaya A & Devashi Pande</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
