/// <reference types="vite/client" />
import React from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';

export interface CustomIconProps {
  name: string;
  className?: string;
  size?: number | string;
  onClick?: () => void;
  white?: boolean;
  blue?: boolean;
}

// Eagerly load all icon assets from public/icons, public/, root, and src/assets/ via Vite glob
const assetModules = import.meta.glob<{ default: string }>(
  [
    '../../public/icons/*.{png,svg}',
    '../../public/*.{png,svg}',
    '../../*.svg',
    '../assets/**/*.{png,svg,jpg,jpeg}',
  ],
  { eager: true }
);

// Build a dictionary mapping filename (without extension or with extension) to bundled asset URL
const bundledIcons: Record<string, string> = {};
for (const path in assetModules) {
  const fileWithExt = path.split('/').pop() || '';
  const fileName = fileWithExt.toLowerCase();
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  const mod = assetModules[path];
  let url = typeof mod === 'string' ? mod : mod?.default || '';
  // Clean up leading /public in dev URLs so Vite serves from root
  if (url.startsWith('/public/')) {
    url = url.replace(/^\/public\//, '/');
  }
  if (url) {
    bundledIcons[fileName] = url;
    bundledIcons[baseName] = url;
  }
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
  filter: 'discover.png',
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
  cat: 'animal icons-02.svg',
  cats: 'animal icons-02.svg',
  'animal icons-02': 'animal icons-02.svg',
  rabbit: 'rabbit.svg',
  rabbits: 'rabbit.svg',
  bird: 'birds.svg',
  birds: 'birds.svg',
  other: 'other.svg',
  'small-animals': 'other.svg',
  'small animals': 'other.svg',
  'any-pet': 'any-pet.svg',
  'any pet': 'any-pet.svg',
  'all-pets': 'any-pet.svg',
  'all friends': 'any-pet.svg',
};

export const CustomIcon: React.FC<CustomIconProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  onClick,
  white = false,
  blue = false,
}) => {
  const normalizedKey = name.toLowerCase().trim();
  const isFloating = size !== undefined;
  const scaleClass = isFloating ? '' : 'scale-140 transition-transform';

  const isBlue = blue || className.includes('text-[#0F5C94]') || className.includes('text-blue');

  const filterStyle: React.CSSProperties = blue
    ? { filter: 'brightness(0) saturate(100%) invert(26%) sepia(90%) saturate(1500%) hue-rotate(182deg) brightness(96%) contrast(95%)' }
    : white
    ? { filter: 'brightness(0) invert(1)' }
    : isBlue
    ? { filter: 'brightness(0) saturate(100%) invert(26%) sepia(90%) saturate(1500%) hue-rotate(182deg) brightness(96%) contrast(95%)' }
    : {};

  const style: React.CSSProperties = {
    ...(size ? { width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size } : {}),
    ...filterStyle,
  };

  if (['retry', 'reset', 'refresh', 'rotate'].includes(normalizedKey)) {
    return (
      <RotateCcw
        className={`inline-block select-none shrink-0 ${scaleClass} ${className} ${white ? 'text-white' : 'text-[#0F5C94]'}`}
        style={size ? { width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size } : {}}
        onClick={onClick}
        strokeWidth={2.8}
      />
    );
  }

  if (normalizedKey === 'undo') {
    return (
      <Undo2
        className={`inline-block select-none shrink-0 ${scaleClass} ${className} ${white ? 'text-white' : 'text-[#0F5C94]'}`}
        style={size ? { width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size } : {}}
        onClick={onClick}
        strokeWidth={2.8}
      />
    );
  }

  const mappedFileName = nameAliases[normalizedKey] || (normalizedKey.endsWith('.png') || normalizedKey.endsWith('.svg') ? normalizedKey : `${normalizedKey}.png`);
  const baseName = mappedFileName.replace(/\.[^/.]+$/, '');
  
  const finalSrc = 
    bundledIcons[mappedFileName.toLowerCase()] || 
    bundledIcons[normalizedKey] || 
    bundledIcons[baseName.toLowerCase()] || 
    `/icons/${mappedFileName}` ||
    `/${mappedFileName}`;

  return (
    <img
      src={finalSrc}
      alt={name}
      className={`inline-block object-contain select-none shrink-0 ${scaleClass} ${className}`}
      style={style}
      onClick={onClick}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        const currentSrc = target.src || '';
        // Sequentially try fallbacks if first URL 404s
        if (!currentSrc.includes('/icons/') && mappedFileName) {
          target.src = `/icons/${mappedFileName}`;
        } else if (!currentSrc.includes(`/${mappedFileName}`) && mappedFileName) {
          target.src = `/${mappedFileName}`;
        } else if (currentSrc.includes('/icons/')) {
          target.src = `/${mappedFileName}`;
        } else if (!currentSrc.includes('paw.png')) {
          target.src = '/icons/paw.png';
        }
      }}
    />
  );
};
