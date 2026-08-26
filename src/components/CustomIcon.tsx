/// <reference types="vite/client" />
import React from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';

export interface CustomIconProps {
  name: string;
  className?: string;
  size?: number | string;
  onClick?: () => void;
  white?: boolean;
}

const nameAliases: Record<string, string> = {
  ball: 'ball.png',
  bone: 'bone.png',
  calendar: 'calender.png',
  calender: 'calender.png',
  'circle-tick': 'circle-with-tick.png',
  'circle-with-tick': 'circle-with-tick.png',
  'circle with tick': 'circle-with-tick.png',
  cross: 'cross.png',
  discover: 'discover.png',
  exclamation: 'exclamation.png',
  female: 'female.png',
  file: 'file.png',
  flame: 'flame.png',
  'health-verified': 'health-verified.png',
  'health verified': 'health-verified.png',
  'heart-filled': 'heart-filled.png',
  'heart filled': 'heart-filled.png',
  'heart-illustration': 'heart-illustration.png',
  'heart illustration': 'heart-illustration.png',
  'heart-unfilled': 'heart-unfilled.png',
  'heart unfilled': 'heart-unfilled.png',
  home: 'home.png',
  'left-arrow': 'left-arrow.png',
  'left arrow': 'left-arrow.png',
  'location-pin': 'location-pin.png',
  'location pin': 'location-pin.png',
  location: 'location-pin.png',
  mail: 'mail.png',
  male: 'male.png',
  'message-box': 'message-box.png',
  'message box': 'message-box.png',
  message: 'message-box.png',
  paw: 'paw.png',
  'paw-illustration': 'paw-illustration.png',
  'paw illustration': 'paw-illustration.png',
  phone: 'phone.png',
  'right-arrow': 'right-arrow.png',
  'right arrow': 'right-arrow.png',
  search: 'search.png',
  share: 'share.png',
  smiley: 'smiley.png',
  sparkle: 'sparkle.png',
  sparkles: 'sparkle.png',
  star: 'star-filled.png',
  'star-filled': 'star-filled.png',
  'star filled': 'star-filled.png',
  'star-unfilled': 'star-unfilled.png',
  'star unfilled': 'star-unfilled.png',
  menu: 'three-lines.png',
  'three-lines': 'three-lines.png',
  'three lines': 'three-lines.png',
  tick: 'tick.png',
  user: 'user.png',
  dog: 'dog.svg',
  dogs: 'dog.svg',
  cat: 'cat.svg',
  cats: 'cat.svg',
  rabbit: 'rabbit.svg',
  rabbits: 'rabbits.svg',
  bird: 'bird.svg',
  birds: 'birds.svg',
  other: 'other.svg',
  'small-animals': 'small-animals.svg',
  'small animals': 'small-animals.svg',
  'any-pet': 'any-pet.svg',
  'any pet': 'any-pet.svg',
  'all-pets': 'all-pets.svg',
  'all friends': 'all-pets.svg',
};

// Vite serves files placed directly inside /public from the site root.
// The icons in this repository are in /public, NOT /public/icons.
// Therefore /paw.png is the correct production URL.
const ASSET_BASE = '/';

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
  const style = size
    ? {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }
    : {};

  if (['retry', 'reset', 'refresh', 'rotate'].includes(normalizedKey)) {
    return (
      <RotateCcw
        className={`inline-block select-none shrink-0 ${scaleClass} ${className} ${
          white ? 'text-white' : ''
        }`}
        style={style}
        onClick={onClick}
        strokeWidth={2.8}
      />
    );
  }

  if (normalizedKey === 'undo') {
    return (
      <Undo2
        className={`inline-block select-none shrink-0 ${scaleClass} ${className} ${
          white ? 'text-white' : ''
        }`}
        style={style}
        onClick={onClick}
        strokeWidth={2.8}
      />
    );
  }

  const mappedFileName = nameAliases[normalizedKey] || `${normalizedKey}.png`;
  const finalSrc = `${ASSET_BASE}${mappedFileName}`;

  return (
    <img
      src={finalSrc}
      alt={name}
      className={`inline-block object-contain select-none shrink-0 ${scaleClass} ${className} ${
        white ? 'brightness-0 invert' : ''
      }`}
      style={style}
      onClick={onClick}
    />
  );
};
