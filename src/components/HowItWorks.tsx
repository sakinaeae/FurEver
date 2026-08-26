import React from 'react';
import { Search, Sparkles, FileCheck, ArrowRight } from 'lucide-react';
import { PawIcon } from './PawDecorations';

interface HowItWorksProps {
  onDiscoverClick: () => void;
  onMeetClick: () => void;
  onConnectClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onDiscoverClick,
  onMeetClick,
  onConnectClick,
}) => {
  const steps = [
    {
      number: '01',
      title: 'DISCOVER',
      subtitle: 'Explore pets looking for a home.',
      description:
        'Browse vetted shelter animals, filter by lifestyle needs, or swipe through our interactive discovery deck to find pets that catch your heart.',
      color: '#0F5C94', // Blue
      bgSoft: '#E8F3FA',
      accent: '#F6D97B', // Yellow
      icon: Search,
      actionText: 'Browse Gallery',
      onClick: onDiscoverClick,
    },
    {
      number: '02',
      title: 'MEET',
      subtitle: 'Find animals that fit your preferences.',
      description:
        'Compare personality traits, medical verifications, and compatibility with kids or other pets before taking the next meaningful step.',
      color: '#9A5D16', // Brown
      bgSoft: '#FAF3E7',
      accent: '#FB4504', // Orange
      icon: Sparkles,
      actionText: 'Try Match Quiz',
      onClick: onMeetClick,
    },
    {
      number: '03',
      title: 'CONNECT',
      subtitle: 'Apply and follow your adoption journey.',
      description:
        'Complete a friendly, transparent application form, receive your tracking ID, and follow status updates from review to meet-and-greet.',
      color: '#0F942D', // Green
      bgSoft: '#EBF7EE',
      accent: '#F6D97B', // Yellow
      icon: FileCheck,
      actionText: 'Check Status',
      onClick: onConnectClick,
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-[#ffca42] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
        <div className="bg-[#FAF5EB] rounded-3xl border-3 border-[#0F5C94] shadow-[6px_6px_0px_#0F5C94] p-6 sm:p-10">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F6D97B] border-2 border-[#0F5C94] text-[#0F5C94] text-xs font-black uppercase tracking-wider">
              <PawIcon className="w-3.5 h-3.5 fill-[#FB4504]" />
              <span>Simple 3-Step Adoption Process</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-titan text-[#0F5C94] tracking-normal">
              HOW IT WORKS
            </h2>

            <p className="text-sm sm:text-base text-[#0F5C94]/85 font-medium">
              Adopting a pet should be joyful and straightforward. We replaced clunky paperwork with a clear, humane journey.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative bg-white rounded-2xl p-6 border-2 border-[#0F5C94] shadow-[4px_4px_0px_#0F5C94] hover:shadow-[6px_6px_0px_#FB4504] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Step Pill Header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-2xl font-titan tracking-normal px-3 py-1 rounded-xl border-2 border-[#0F5C94]"
                        style={{ backgroundColor: step.bgSoft, color: step.color }}
                      >
                        {step.number}
                      </span>

                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-[#0F5C94] shadow-[2px_2px_0px_#0F5C94] group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: step.color, color: '#ffffff' }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <h3
                      className="text-2xl font-titan tracking-normal mb-1"
                      style={{ color: step.color }}
                    >
                      {step.title}
                    </h3>

                    <h4 className="text-xs font-black text-[#9A5D16] uppercase tracking-wider mb-2.5">
                      {step.subtitle}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#0F5C94]/80 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-6 pt-3.5 border-t-2 border-[#0F5C94]/15">
                    <button
                      onClick={step.onClick}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#0F5C94] flex items-center justify-center gap-1.5 transition-all hover:bg-[#0F5C94] hover:text-white cursor-pointer"
                      style={{ backgroundColor: step.bgSoft, color: step.color }}
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
