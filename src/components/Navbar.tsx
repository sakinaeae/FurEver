import React, { useState, useEffect } from 'react';
import { Pet } from '../types';
import { CustomIcon } from './CustomIcon';
import { UserProfile } from './UserSignInModal';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  likedCount: number;
  onOpenMatches: () => void;
  onFindYourMatch: () => void;
  pets?: Pet[];
  onSelectPet?: (pet: Pet) => void;
  currentProfile?: UserProfile | null;
  onOpenSignIn?: () => void;
  onOpenListPetModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  likedCount,
  onOpenMatches,
  currentProfile,
  onOpenSignIn,
  onOpenListPetModal,
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
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Main Navigation Bar */}
      <div
        className={`bg-[#0F5C94] text-white transition-all duration-200 border-b-4 border-[#FB4504] h-18 sm:h-20 md:h-22 flex items-center ${
          isScrolled ? 'shadow-2xl bg-[#0F5C94]/95 backdrop-blur-md' : 'shadow-xl'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            
            {/* Logo */}
            <div
              id="brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
            >
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#F6D97B] flex items-center justify-center text-[#0F5C94] shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform duration-200 border-2 border-white/20">
                  <CustomIcon name="paw" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-xl sm:text-3xl tracking-tight text-white leading-none font-titan group-hover:text-[#F6D97B] transition-colors">
                  FUREVER
                </span>
                <span className="hidden sm:block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.14em] text-[#F6D97B] leading-tight mt-0.5">
                  Find your match. Make it furever.
                </span>
              </div>
            </div>

            {/* MIDDLE SECTION: Navigation Links & Actions (Centered) */}
            <div className="flex-1 flex items-center justify-center gap-2 lg:gap-3 mx-2">
              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 font-black uppercase tracking-wider whitespace-nowrap bg-white/10 p-1 rounded-2xl border border-white/15 shadow-inner">
                {/* 1. Home */}
                <button
                  id="nav-btn-home"
                  onClick={() => handleNavClick('home')}
                  className={`px-3 xl:px-4 py-2 rounded-xl transition-all font-black text-xs xl:text-sm shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'home'
                      ? 'bg-white/20 text-[#F6D97B] shadow-inner ring-1 ring-white/30'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CustomIcon name="home" className="w-4.5 h-4.5 xl:w-5 xl:h-5" white />
                  <span>Home</span>
                </button>

                {/* 2. Pets */}
                <button
                  id="nav-btn-find-pet"
                  onClick={() => handleNavClick('browse')}
                  className={`px-3 xl:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs xl:text-sm font-black shrink-0 cursor-pointer ${
                    currentTab === 'browse'
                      ? 'bg-[#F6D97B] text-[#0F5C94] shadow-md font-black'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CustomIcon name="discover" className="w-4.5 h-4.5 xl:w-5 xl:h-5" white />
                  <span>Browse Pets</span>
                </button>

                {/* 3. Swipe to Match */}
                <button
                  id="nav-btn-swipe-match"
                  onClick={() => handleNavClick('swipe')}
                  className={`px-3 xl:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs xl:text-sm font-black shrink-0 cursor-pointer ${
                    currentTab === 'swipe'
                      ? 'bg-[#FB4504] text-white shadow-md'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CustomIcon name="flame" className="w-4.5 h-4.5 xl:w-5 xl:h-5" white />
                  <span>Swipe Match</span>
                </button>

                {/* 4. Matchfinder */}
                <button
                  id="nav-btn-match-finder"
                  onClick={() => handleNavClick('quiz')}
                  className={`px-3 xl:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs xl:text-sm font-black shrink-0 cursor-pointer ${
                    currentTab === 'quiz'
                      ? 'bg-[#0F942D] text-white shadow-md'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CustomIcon name="sparkle" className="w-4.5 h-4.5 xl:w-5 xl:h-5" white />
                  <span>Quiz</span>
                </button>
              </nav>

              {/* Action Buttons in Middle (Liked & List Pet) */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Liked Button */}
                <button
                  id="header-liked-matches-btn"
                  onClick={onOpenMatches}
                  className="relative px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-[#F6D97B] hover:text-[#0F5C94] text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase tracking-wider border border-white/20"
                  title="Liked Pets"
                  aria-label="Liked Pets"
                >
                  <CustomIcon
                    name={likedCount > 0 ? 'heart-filled' : 'heart-unfilled'}
                    className="w-4.5 h-4.5 sm:w-5 sm:h-5"
                    white
                  />
                  <span className="hidden md:inline">Liked</span>
                  {likedCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-[#FB4504] text-white text-[10px] sm:text-xs font-black rounded-full ring-2 ring-[#0F5C94]">
                      {likedCount}
                    </span>
                  )}
                </button>

                {/* List a Pet Button (Foster / Owner Portal) */}
                {onOpenListPetModal && (
                  <button
                    id="header-list-pet-btn"
                    onClick={onOpenListPetModal}
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-[#F6D97B] hover:text-[#0F5C94] text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase tracking-wider border border-white/20"
                    title="Put a pet up for adoption"
                  >
                    <CustomIcon name="paw" className="w-4.5 h-4.5 sm:w-5 sm:h-5" white />
                    <span>List Pet</span>
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT END: Sign In / Profile Button & Mobile Toggle */}
            <div className="shrink-0 flex items-center gap-2">

              {/* Sign In / Profile Button */}
              {onOpenSignIn && (
                <button
                  id="header-signin-profile-btn"
                  onClick={onOpenSignIn}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#F6D97B] text-[#0F5C94] hover:bg-white border-2 border-[#0F5C94] shadow-[2px_2px_0px_#FB4504] transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer text-xs font-black uppercase tracking-wider"
                  title={currentProfile ? `Profile: ${currentProfile.name}` : 'Sign In'}
                >
                  <CustomIcon name="user" className="w-4.5 h-4.5" blue />
                  <span className="max-w-[70px] sm:max-w-[100px] truncate">
                    {currentProfile ? currentProfile.name.split(' ')[0] : 'Sign In'}
                  </span>
                </button>
              )}

              {/* Mobile Menu Toggle Button (Visible on screens smaller than LG: <1024px) */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex lg:hidden p-2 rounded-xl bg-[#F6D97B] text-[#0F5C94] border-2 border-[#0F5C94] shadow-[2px_2px_0px_#FB4504] active:scale-95 transition-all items-center justify-center cursor-pointer ml-1"
                title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <CustomIcon name="cross" className="w-5.5 h-5.5" blue />
                ) : (
                  <CustomIcon name="menu" className="w-5.5 h-5.5" blue />
                )}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[72px] sm:top-[80px] z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
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
                        <CustomIcon name={item.icon} className="w-5 h-5" white />
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
                      <CustomIcon name="right-arrow" className="w-5 h-5 opacity-70" white />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Secondary actions in mobile menu */}
            <div className="pt-4 border-t border-white/15 space-y-3">
              {/* List a Pet Button in Mobile Menu */}
              {onOpenListPetModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenListPetModal();
                  }}
                  className="w-full p-3 rounded-xl bg-[#0F942D] text-white border-2 border-[#0F5C94] font-black flex items-center justify-between text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#0F5C94]"
                >
                  <span className="flex items-center gap-2.5">
                    <CustomIcon name="paw" className="w-5 h-5 text-white" white />
                    <span>List Pet</span>
                  </span>
                  <CustomIcon name="right-arrow" className="w-4 h-4 text-white" white />
                </button>
              )}
              {/* Sign In / Profile action in Mobile Menu */}
              {onOpenSignIn && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSignIn();
                  }}
                  className="w-full p-3 rounded-xl bg-[#F6D97B] text-[#0F5C94] border-2 border-[#0F5C94] font-black flex items-center justify-between text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_#FB4504]"
                >
                  <span className="flex items-center gap-2.5">
                    <CustomIcon name="user" className="w-5 h-5" blue />
                    <span>{currentProfile ? `My Profile (${currentProfile.name})` : 'Sign In / Get Started'}</span>
                  </span>
                  <CustomIcon name="right-arrow" className="w-4 h-4" blue />
                </button>
              )}

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
                    white
                  />
                  <span>View Saved Matches ({likedCount})</span>
                </span>
                <CustomIcon name="right-arrow" className="w-4 h-4 opacity-70" white />
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
