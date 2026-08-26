import React from 'react';

export interface CustomIconProps {
  name: string;
  className?: string;
  size?: number | string;
  onClick?: () => void;
  white?: boolean;
}

const iconMap: Record<string, string> = {
  ball: '/ball.png',
  bone: '/bone.png',
  calendar: '/calender.png',
  calender: '/calender.png',
  'circle-tick': '/circle with tick.png',
  'circle with tick': '/circle with tick.png',
  cross: '/cross.png',
  discover: '/discover.png',
  exclamation: '/exclamation.png',
  female: '/female.png',
  file: '/file.png',
  flame: '/flame.png',
  'health-verified': '/health verified.png',
  'health verified': '/health verified.png',
  'heart-filled': '/heart filled.png',
  'heart filled': '/heart filled.png',
  'heart-illustration': '/heart illustration.png',
  'heart illustration': '/heart illustration.png',
  'heart-unfilled': '/heart unfilled.png',
  'heart unfilled': '/heart unfilled.png',
  home: '/home.png',
  'left-arrow': '/ledt arrow.png',
  'ledt arrow': '/ledt arrow.png',
  'location-pin': '/location pin.png',
  'location pin': '/location pin.png',
  location: '/location pin.png',
  mail: '/mail.png',
  male: '/male.png',
  'message-box': '/message box.png',
  'message box': '/message box.png',
  message: '/message box.png',
  paw: '/paw.png',
  'paw-illustration': '/paw illustration.png',
  'paw illustration': '/paw illustration.png',
  phone: '/phone.png',
  'right-arrow': '/right arrow.png',
  search: '/search.png',
  share: '/share.png',
  smiley: '/smiley.png',
  sparkle: '/sparkle.png',
  sparkles: '/sparkle.png',
  'star-filled': '/star filled.png',
  'star filled': '/star filled.png',
  'star-unfilled': '/star unfilled.png',
  'star unfilled': '/star unfilled.png',
  menu: '/three lines.png',
  'three lines': '/three lines.png',
  tick: '/tick.png',
  user: '/user.png',
};

export const CustomIcon: React.FC<CustomIconProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  onClick,
  white = false,
}) => {
  const normalizedKey = name.toLowerCase().trim();
  const iconSrc = iconMap[normalizedKey] || iconMap['paw'];

  const style = {
    ...(size ? { width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size } : {}),
  };

  return (
    <img
      src={encodeURI(iconSrc)}
      alt={name}
      className={`inline-block object-contain select-none shrink-0 ${className} ${white ? 'brightness-0 invert' : ''}`}
      style={style}
      onClick={onClick}
      referrerPolicy="no-referrer"
    />
  );
};
