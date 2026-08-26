import React, { useState, useEffect } from 'react';
import {
  Heart,
  FileText,
  Compass,
  Sparkles,
  Search,
  Flame
} from 'lucide-react';
import { Pet } from '../types';
import { PawIcon } from './PawDecorations';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  likedCount: number;
  applicationCount: number;
  onOpenMatches: () => void;
  onFindYourMatch: () => void;
  pets?: Pet[];
  onSelectPet?: (pet: Pet) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  likedCount,
  applicationCount,
  onOpenMatches,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab: string) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Main Navigation Bar */}
      <div
        className={`bg-[#0F5C94] text-white transition-all duration-200 border-b-4 border-[#FB4504] ${
          isScrolled ? 'shadow-2xl py-2 bg-[#0F5C94]/95 backdrop-blur-md' : 'shadow-xl py-2.5 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-4">
            
            {/* Top row on small screens: Logo & Actions */}
            <div className="flex items-center justify-between gap-3 shrink-0">
              {/* Logo */}
              <div
                id="brand-logo-btn"
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
              >
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-[#F6D97B] flex items-center justify-center text-[#0F5C94] shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-transform duration-200 border-2 border-white/20">
                    <PawIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-[#0F5C94]" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#FB4504] border-2 border-[#0F5C94]"></div>
                </div>

                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl tracking-tight text-white leading-none font-titan group-hover:text-[#F6D97B] transition-colors">
                    FUREVER
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#F6D97B] leading-tight">
                    Adoption Hub
                  </span>
                </div>
              </div>

              {/* Action buttons (Search & Liked) for compact header layout */}
              <div className="flex md:hidden items-center gap-1.5 shrink-0">
                {/* Search Icon */}
                <button
                  id="header-mobile-search-btn"
                  onClick={() => handleNavClick('browse')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 flex items-center justify-center"
                  title="Search pets"
                  aria-label="Search pets"
                >
                  <Search className="w-4 h-4 text-[#F6D97B]" />
                </button>

                {/* Liked */}
                <button
                  id="header-mobile-liked-btn"
                  onClick={onOpenMatches}
                  className="relative p-2 rounded-xl bg-white/10 hover:bg-[#F6D97B] hover:text-[#0F5C94] text-white transition-all active:scale-95 flex items-center gap-1"
                  title="Liked Pets"
                  aria-label="Liked Pets"
                >
                  <Heart className={`w-4 h-4 ${likedCount > 0 ? 'fill-[#FB4504] text-[#FB4504]' : 'currentColor'}`} />
                  {likedCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#FB4504] text-white text-[10px] font-black rounded-full">
                      {likedCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Navigation Links on the header */}
            <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-0.5 md:pb-0">
              <nav className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 font-black text-xs uppercase tracking-wider whitespace-nowrap">
                
                {/* 1. Home */}
                <button
                  id="nav-btn-home"
                  onClick={() => handleNavClick('home')}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all font-bold text-[11px] sm:text-xs shrink-0 ${
                    currentTab === 'home'
                      ? 'bg-white/20 text-[#F6D97B] shadow-inner ring-1 ring-white/30'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Home
                </button>

                {/* 2. Pets */}
                <button
                  id="nav-btn-find-pet"
                  onClick={() => handleNavClick('browse')}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs shrink-0 ${
                    currentTab === 'browse'
                      ? 'bg-[#F6D97B] text-[#0F5C94] shadow-md font-black'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Pets</span>
                </button>

                {/* 3. Swipe to Match */}
                <button
                  id="nav-btn-swipe-match"
                  onClick={() => handleNavClick('swipe')}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs shrink-0 cursor-pointer ${
                    currentTab === 'swipe'
                      ? 'bg-[#FB4504] text-white shadow-md'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-[#F6D97B]" />
                  <span>Swipe to Match</span>
                </button>

                {/* 4. Matchfinder */}
                <button
                  id="nav-btn-match-finder"
                  onClick={() => handleNavClick('quiz')}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs shrink-0 cursor-pointer ${
                    currentTab === 'quiz'
                      ? 'bg-[#0F942D] text-white shadow-md'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F6D97B]" />
                  <span>Matchfinder</span>
                </button>

                {/* 5. Status */}
                <button
                  id="nav-btn-status"
                  onClick={() => handleNavClick('applications')}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs shrink-0 cursor-pointer ${
                    currentTab === 'applications'
                      ? 'bg-[#F6D97B] text-[#0F5C94] shadow-md font-black'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Status</span>
                  {applicationCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#FB4504] text-white text-[10px] font-black rounded-full shadow">
                      {applicationCount}
                    </span>
                  )}
                </button>

              </nav>

              {/* Right Action Items for Desktop: Search Icon & Liked */}
              <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0 ml-2">
                {/* 6. Liked */}
                <button
                  id="header-liked-matches-btn"
                  onClick={onOpenMatches}
                  className="relative px-3 py-2 rounded-xl bg-white/10 hover:bg-[#F6D97B] hover:text-[#0F5C94] text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase tracking-wider"
                  title="Liked Pets"
                  aria-label="Liked Pets"
                >
                  <Heart className={`w-3.5 h-3.5 ${likedCount > 0 ? 'fill-[#FB4504] text-[#FB4504]' : 'currentColor'}`} />
                  <span>Liked</span>
                  {likedCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#FB4504] text-white text-[10px] font-black rounded-full ring-2 ring-[#0F5C94]">
                      {likedCount}
                    </span>
                  )}
                </button>

                {/* 7. Search Icon */}
                <button
                  id="header-quick-search-btn"
                  onClick={() => handleNavClick('browse')}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                  title="Search pets"
                  aria-label="Search pets"
                >
                  <Search className="w-4 h-4 text-[#F6D97B]" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
