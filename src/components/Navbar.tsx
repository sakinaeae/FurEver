import React, { useState, useEffect } from 'react';
import { Pet } from '../types';
import { CustomIcon } from './CustomIcon';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (tab: string) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      color: '#0F5C94',
    },
    {
      id: 'browse',
      label: 'Find a Pet (Browse)',
      shortLabel: 'Pets',
      icon: 'discover',
      color: '#0F5C94',
    },
    {
      id: 'swipe',
      label: 'Swipe to Match',
      shortLabel: 'Swipe',
      icon: 'flame',
      color: '#FB4504',
      badge: 'Interactive',
    },
    {
      id: 'quiz',
      label: 'Match Finder Quiz',
      shortLabel: 'Matchfinder',
      icon: 'sparkle',
      color: '#0F942D',
      badge: 'Smart Match',
    },
    {
      id: 'applications',
      label: 'Application Status',
      shortLabel: 'Status',
      icon: 'file',
      color: '#9A5D16',
      count: applicationCount,
    },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Main Navigation Bar */}
      <div
        className={`bg-[#0F5C94] text-white transition-all duration-200 border-b-4 border-[#FB4504] h-20 sm:h-24 flex items-center ${
          isScrolled ? 'shadow-2xl bg-[#0F5C94]/95 backdrop-blur-md' : 'shadow-xl'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 w-full">
          <div className="flex items-center justify-between gap-2.5 md:gap-4">
            
            {/* Logo */}
            <div
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
            >
              <div>
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#F6D97B] flex items-center justify-center text-[#0F5C94] shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-transform duration-200 border-2 border-white/20">
                  <CustomIcon name="paw" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-4xl tracking-tight text-white leading-none font-titan group-hover:text-[#F6D97B] transition-colors">
                  FUREVER
                </span>
                <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.14em] text-[#F6D97B] leading-tight mt-0.5">
                  Find your match. Make it furever.
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 font-black uppercase tracking-wider whitespace-nowrap">
              
              {/* 1. Home */}
              <button
                id="nav-btn-home"
                onClick={() => handleNavClick('home')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all font-black text-xs sm:text-sm shrink-0 cursor-pointer flex items-center gap-2 ${
                  currentTab === 'home'
                    ? 'bg-white/20 text-[#F6D97B] shadow-inner ring-1 ring-white/30'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <CustomIcon name="home" className="w-5.5 h-5.5 sm:w-6 sm:h-6" white />
                <span>Home</span>
              </button>

              {/* 2. Pets */}
              <button
                id="nav-btn-find-pet"
                onClick={() => handleNavClick('browse')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs sm:text-sm font-black shrink-0 cursor-pointer ${
                  currentTab === 'browse'
                    ? 'bg-[#F6D97B] text-[#0F5C94] shadow-md font-black'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <CustomIcon name="discover" className="w-5.5 h-5.5 sm:w-6 sm:h-6" white />
                <span>Pets</span>
              </button>

              {/* 3. Swipe to Match */}
              <button
                id="nav-btn-swipe-match"
                onClick={() => handleNavClick('swipe')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs sm:text-sm font-black shrink-0 cursor-pointer ${
                  currentTab === 'swipe'
                    ? 'bg-[#FB4504] text-white shadow-md'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <CustomIcon name="flame" className="w-5.5 h-5.5 sm:w-6 sm:h-6" white />
                <span>Swipe to Match</span>
              </button>

              {/* 4. Matchfinder */}
              <button
                id="nav-btn-match-finder"
                onClick={() => handleNavClick('quiz')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs sm:text-sm font-black shrink-0 cursor-pointer ${
                  currentTab === 'quiz'
                    ? 'bg-[#0F942D] text-white shadow-md'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <CustomIcon name="sparkle" className="w-5.5 h-5.5 sm:w-6 sm:h-6" white />
                <span>Matchfinder</span>
              </button>

              {/* 5. Status */}
              <button
                id="nav-btn-status"
                onClick={() => handleNavClick('applications')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all flex items-center gap-2 text-xs sm:text-sm font-black shrink-0 cursor-pointer ${
                  currentTab === 'applications'
                    ? 'bg-[#F6D97B] text-[#0F5C94] shadow-md font-black'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <CustomIcon name="file" className="w-5.5 h-5.5 sm:w-6 sm:h-6" white />
                <span>Status</span>
                {applicationCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#FB4504] text-white text-xs font-black rounded-full shadow">
                    {applicationCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Right Action Items: Desktop & Mobile */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              
              {/* Liked Button (Visible on all screens) */}
              <button
                id="header-liked-matches-btn"
                onClick={onOpenMatches}
                className="relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-[#F6D97B] hover:text-[#0F5C94] text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-black uppercase tracking-wider"
                title="Liked Pets"
                aria-label="Liked Pets"
              >
                <CustomIcon
                  name={likedCount > 0 ? 'heart-filled' : 'heart-unfilled'}
                  className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5"
                  white
                />
                <span className="hidden sm:inline">Liked</span>
                {likedCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#FB4504] text-white text-xs font-black rounded-full ring-2 ring-[#0F5C94]">
                    {likedCount}
                  </span>
                )}
              </button>

              {/* Desktop Quick Search */}
              <button
                id="header-quick-search-btn"
                onClick={() => handleNavClick('browse')}
                className="hidden md:flex p-2.5 sm:p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 items-center justify-center cursor-pointer"
                title="Search pets"
                aria-label="Search pets"
              >
                <CustomIcon name="search" className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5" white />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden p-2.5 rounded-xl bg-[#F6D97B] text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#FB4504] active:scale-95 transition-all items-center justify-center cursor-pointer"
                title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <CustomIcon name="cross" className="w-6.5 h-6.5" />
                ) : (
                  <CustomIcon name="menu" className="w-6.5 h-6.5" />
                )}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[60px] z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-[#0F5C94] border-b-4 border-[#FB4504] shadow-2xl p-5 max-h-[calc(100vh-70px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Header inside Mobile Menu */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/15">
              <span className="text-xs font-black uppercase tracking-wider text-[#F6D97B]">
                Navigation Menu
              </span>
              <span className="text-[10px] text-white/60 font-medium">
                Tap to explore
              </span>
            </div>

            {/* Navigation links list */}
            <div className="space-y-2 mb-6">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#F6D97B] text-[#0F5C94] border-white shadow-[3px_3px_0px_#FB4504] font-black'
                        : 'bg-white/10 text-white border-white/10 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                          isActive
                            ? 'bg-[#0F5C94] text-[#F6D97B] border-[#0F5C94]'
                            : 'bg-white/10 text-[#F6D97B] border-white/20'
                        }`}
                      >
                        <CustomIcon name={item.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold tracking-tight">
                          {item.label}
                        </div>
                        {item.badge && (
                          <div className="text-[10px] font-black uppercase tracking-wider text-[#FB4504]">
                            {item.badge}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.count !== undefined && item.count > 0 && (
                        <span className="px-2 py-0.5 bg-[#FB4504] text-white text-xs font-black rounded-full shadow">
                          {item.count}
                        </span>
                      )}
                      <CustomIcon name="right-arrow" className="w-5 h-5 opacity-70" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Secondary actions & helpline in mobile menu */}
            <div className="pt-4 border-t border-white/15 space-y-3">
              {/* Liked matches row button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMatches();
                }}
                className="w-full p-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 flex items-center justify-between text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <CustomIcon
                    name={likedCount > 0 ? 'heart-filled' : 'heart-unfilled'}
                    className="w-5 h-5"
                  />
                  <span>View Saved Matches ({likedCount})</span>
                </span>
                <CustomIcon name="right-arrow" className="w-4 h-4 opacity-70" />
              </button>

              {/* Support helpline info */}
              <div className="p-3 rounded-xl bg-[#FAF5EB] text-[#0F5C94] border-2 border-[#0F5C94] flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] font-black uppercase text-[#9A5D16] tracking-wider">
                    Adoption Helpline
                  </div>
                  <a href="tel:18002347890" className="font-titan text-sm hover:text-[#FB4504]">
                    1800 234 7890
                  </a>
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#0F5C94] text-[#F6D97B] flex items-center justify-center">
                  <CustomIcon name="phone" className="w-5 h-5" />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
