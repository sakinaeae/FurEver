import React from 'react';
import { CustomIcon } from './CustomIcon';

interface AnimalMarqueeTapeProps {
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  className?: string;
}

export const AnimalMarqueeTape: React.FC<AnimalMarqueeTapeProps> = ({
  bgColor = 'bg-[#F6D97B]',
  textColor = 'text-[#0F5C94]',
  borderColor = 'border-[#0F5C94]',
  className = '',
}) => {
  const items = ['dog', 'cat', 'rabbit', 'bird', 'small-animals', 'any-pet'];

  const repeatSet = [...items, ...items, ...items, ...items];

  return (
    <div className={`w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden border-y-3 sm:border-y-4 ${borderColor} ${bgColor} h-20 sm:h-24 flex items-center my-4 sm:my-6 ${className}`}>
      <div className="animate-marquee-tape flex items-center gap-10 sm:gap-14 shrink-0 whitespace-nowrap select-none">
        {/* Set 1 */}
        <div className="flex items-center gap-10 sm:gap-14 shrink-0">
          {repeatSet.map((iconName, index) => (
            <div key={`s1-${index}`} className="flex items-center justify-center">
              <CustomIcon name={iconName} className="w-11 h-11 sm:w-14 sm:h-14 object-contain" />
            </div>
          ))}
        </div>

        {/* Set 2 (Identical duplicate for seamless infinite loop) */}
        <div className="flex items-center gap-10 sm:gap-14 shrink-0">
          {repeatSet.map((iconName, index) => (
            <div key={`s2-${index}`} className="flex items-center justify-center">
              <CustomIcon name={iconName} className="w-11 h-11 sm:w-14 sm:h-14 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
