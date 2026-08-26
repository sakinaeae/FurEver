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

// Eagerly load all icon assets from src/assets/icons/ and return their actual
// bundled URLs. Using ?url + import: 'default' avoids relying on module shape.
const assetModules = import.meta.glob<string>(
  '../assets/icons/*.{png,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
);

// Build a dictionary mapping filename (with or without extension) to bundled asset URL.
const bundledIcons: Record<string, string> = {};
for (const [path, url] of Object.entries(assetModules)) {
  const fileWithExt = path.split('/').pop() || '';
  const fileName = fileWithExt.toLowerCase();
  const baseName = fileName.replace(/\.[^/.]+$/, '');

  bundledIcons[fileName] = url;
  bundledIcons[baseName] = url;
}

// Logical name mappings
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
    ...(size
      ? {
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
        }
      : {}),
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

  const mappedFileName = nameAliases[normalizedKey] || `${normalizedKey}.png`;
  const baseName = mappedFileName.replace(/\.[^/.]+$/, '').toLowerCase();

  const finalSrc =
    bundledIcons[mappedFileName.toLowerCase()] ||
    bundledIcons[baseName] ||
    bundledIcons['paw.png'] ||
    '';

  return (
    <img
      src={finalSrc}
      alt={name}
      className={`inline-block object-contain select-none shrink-0 ${scaleClass} ${className} ${white ? 'brightness-0 invert' : ''}`}
      style={style}
      onClick={onClick}
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"/>';
      }}
    />
  );
};
