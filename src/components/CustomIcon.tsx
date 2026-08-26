import React from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';

export interface CustomIconProps {
  name: string;
  className?: string;
  size?: number | string;
  onClick?: () => void;
  white?: boolean;
}

const iconFiles: Record<string, string> = {
  ball: 'ball.png', bone: 'bone.png', calendar: 'calender.png', calender: 'calender.png',
  'circle-tick': 'circle-with-tick.png', 'circle-with-tick': 'circle-with-tick.png',
  cross: 'cross.png', discover: 'discover.png', exclamation: 'exclamation.png', female: 'female.png',
  file: 'file.png', flame: 'flame.png', 'health-verified': 'health-verified.png',
  'heart-filled': 'heart-filled.png', 'heart-illustration': 'heart-illustration.png', 'heart-unfilled': 'heart-unfilled.png',
  home: 'home.png', 'left-arrow': 'left-arrow.png', 'location-pin': 'location-pin.png', location: 'location-pin.png',
  mail: 'mail.png', male: 'male.png',
  // message-box.png is stored inside public/icons, not at the public root.
  'message-box': 'icons/message-box.png',
  message: 'icons/message-box.png',
  paw: 'paw.png', 'paw-illustration': 'paw-illustration.png', phone: 'phone.png',
  'right-arrow': 'right-arrow.png', search: 'search.png', share: 'share.png', smiley: 'smiley.png',
  sparkle: 'sparkle.png', sparkles: 'sparkle.png', star: 'star-filled.png', 'star-filled': 'star-filled.png',
  'star-unfilled': 'star-unfilled.png', menu: 'three-lines.png', 'three-lines': 'three-lines.png', tick: 'tick.png', user: 'user.png',
  dog: 'icons/dog.svg', dogs: 'icons/dog.svg', cat: 'icons/cat.svg', cats: 'icons/cat.svg', rabbit: 'icons/rabbits.svg', rabbits: 'icons/rabbits.svg',
  bird: 'icons/birds.svg', birds: 'icons/birds.svg', other: 'icons/small-animals.svg', 'small-animals': 'icons/small-animals.svg', 'any-pet': 'icons/any-pet.svg', 'all-pets': 'icons/all-pets.svg',
};

const ASSET_BASE = '/';

export const CustomIcon: React.FC<CustomIconProps> = ({ name, className = 'w-5 h-5', size, onClick, white = false }) => {
  const key = name.toLowerCase().trim();
  const style = size
    ? { width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size }
    : undefined;
  const scaleClass = size === undefined ? 'scale-140 transition-transform' : '';
  const baseClass = `inline-block object-contain select-none shrink-0 ${scaleClass} ${className}`;

  if (['retry', 'reset', 'refresh', 'rotate'].includes(key)) {
    return <RotateCcw className={`${baseClass} ${white ? 'text-white' : ''}`} style={style} onClick={onClick} strokeWidth={2.8} />;
  }

  if (key === 'undo') {
    return <Undo2 className={`${baseClass} ${white ? 'text-white' : ''}`} style={style} onClick={onClick} strokeWidth={2.8} />;
  }

  const fileName = iconFiles[key] ?? `${key}.png`;

  return <img src={`${ASSET_BASE}${fileName}`} alt={name} className={`${baseClass} ${white ? 'brightness-0 invert' : ''}`} style={style} onClick={onClick} />;
};
