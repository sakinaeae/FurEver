import React from 'react';
import { RotateCcw, RefreshCw, Undo2 } from 'lucide-react';

export interface CustomIconProps {
  name: string;
  className?: string;
  size?: number | string;
  onClick?: () => void;
  white?: boolean;
}

const iconMap: Record<string, string> = {
  ball: '/icons/ball.png',
  bone: '/icons/bone.png',
  calendar: '/icons/calender.png',
  calender: '/icons/calender.png',
  'circle-tick': '/icons/circle-with-tick.png',
  'circle-with-tick': '/icons/circle-with-tick.png',
  'circle with tick': '/icons/circle-with-tick.png',
  cross: '/icons/cross.png',
  discover: '/icons/discover.png',
  exclamation: '/icons/exclamation.png',
  female: '/icons/female.png',
  file: '/icons/file.png',
  flame: '/icons/flame.png',
  'health-verified': '/icons/health-verified.png',
  'health verified': '/icons/health-verified.png',
  'heart-filled': '/icons/heart-filled.png',
  'heart filled': '/icons/heart-filled.png',
  'heart-illustration': '/icons/heart-illustration.png',
  'heart illustration': '/icons/heart-illustration.png',
  'heart-unfilled': '/icons/heart-unfilled.png',
  'heart unfilled': '/icons/heart-unfilled.png',
  home: '/icons/home.png',
  'left-arrow': '/icons/left-arrow.png',
  'left arrow': '/icons/left-arrow.png',
  'ledt arrow': '/icons/left-arrow.png',
  'location-pin': '/icons/location-pin.png',
  'location pin': '/icons/location-pin.png',
  location: '/icons/location-pin.png',
  mail: '/icons/mail.png',
  male: '/icons/male.png',
  'message-box': '/icons/message-box.png',
  'message box': '/icons/message-box.png',
  message: '/icons/message-box.png',
  paw: '/icons/paw.png',
  'paw-illustration': '/icons/paw-illustration.png',
  'paw illustration': '/icons/paw-illustration.png',
  phone: '/icons/phone.png',
  'right-arrow': '/icons/right-arrow.png',
  'right arrow': '/icons/right-arrow.png',
  search: '/icons/search.png',
  share: '/icons/share.png',
  smiley: '/icons/smiley.png',
  sparkle: '/icons/sparkle.png',
  sparkles: '/icons/sparkle.png',
  star: '/icons/star-filled.png',
  'star-filled': '/icons/star-filled.png',
  'star filled': '/icons/star-filled.png',
  'star-unfilled': '/icons/star-unfilled.png',
  'star unfilled': '/icons/star-unfilled.png',
  menu: '/icons/three-lines.png',
  'three-lines': '/icons/three-lines.png',
  'three lines': '/icons/three-lines.png',
  tick: '/icons/tick.png',
  user: '/icons/user.png',
  dog: '/icons/dog.svg',
  dogs: '/icons/dog.svg',
  cat: '/icons/cat.svg',
  cats: '/icons/cat.svg',
  rabbit: '/icons/rabbit.svg',
  rabbits: '/icons/rabbits.svg',
  bird: '/icons/bird.svg',
  birds: '/icons/birds.svg',
  other: '/icons/other.svg',
  'small-animals': '/icons/small-animals.svg',
  'small animals': '/icons/small-animals.svg',
  'any-pet': '/icons/any-pet.svg',
  'any pet': '/icons/any-pet.svg',
  'all-pets': '/icons/all-pets.svg',
  'all friends': '/icons/all-pets.svg',
};

export const CustomIcon: React.FC<CustomIconProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  onClick,
  white = false,
}) => {
  const normalizedKey = name.toLowerCase().trim();
  const isFloating = size !== undefined;
  const scaleClass = isFloating ? '' : 'scale-140 transition-transform';

  const style = {
    ...(size ? { width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size } : {}),
  };

  if (['retry', 'reset', 'refresh', 'rotate'].includes(normalizedKey)) {
    return (
      <RotateCcw
        className={`inline-block select-none shrink-0 ${scaleClass} ${className} ${white ? 'text-white' : ''}`}
        style={style}
        onClick={onClick}
        strokeWidth={2.8}
      />
    );
  }

  if (normalizedKey === 'undo') {
    return (
      <Undo2
        className={`inline-block select-none shrink-0 ${scaleClass} ${className} ${white ? 'text-white' : ''}`}
        style={style}
        onClick={onClick}
        strokeWidth={2.8}
      />
    );
  }

  const iconSrc = iconMap[normalizedKey] || iconMap['paw'];

  return (
    <img
      src={encodeURI(iconSrc)}
      alt={name}
      className={`inline-block object-contain select-none shrink-0 ${scaleClass} ${className} ${white ? 'brightness-0 invert' : ''}`}
      style={style}
      onClick={onClick}
      referrerPolicy="no-referrer"
    />
  );
};
