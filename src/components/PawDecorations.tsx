import React from 'react';

export const PawIcon: React.FC<{ className?: string; color?: string }> = ({
  className = "w-6 h-6",
  color = "currentColor"
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main pad */}
      <path d="M12 11.5C9.5 11.5 7.5 13.5 7.5 16.5C7.5 19 9.5 21 12 21C14.5 21 16.5 19 16.5 16.5C16.5 13.5 14.5 11.5 12 11.5Z" />
      {/* Toe pads */}
      <circle cx="6.5" cy="10" r="2.2" />
      <circle cx="10" cy="5.8" r="2.2" />
      <circle cx="14" cy="5.8" r="2.2" />
      <circle cx="17.5" cy="10" r="2.2" />
    </svg>
  );
};

export const BoneIcon: React.FC<{ className?: string; color?: string }> = ({
  className = "w-6 h-6",
  color = "currentColor"
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 7C17.9 7 17 7.9 17 9C17 9.4 17.1 9.8 17.3 10.1L6.7 13.9C6.4 13.7 6.2 13.6 6 13.6C4.9 13.6 4 14.5 4 15.6C4 16.7 4.9 17.6 6 17.6C6.8 17.6 7.5 17.1 7.8 16.4L18.4 12.6C18.6 12.8 18.8 12.9 19.1 12.9C20.2 12.9 21.1 12 21.1 10.9C21.1 9.8 20.1 8.9 19 8.9C18.9 8.9 18.8 8.9 18.7 9L18.7 7H19Z" opacity="0.3"/>
      <path d="M19.5 7.5C18.7 7.5 18 8.2 18 9C18 9.3 18.1 9.6 18.3 9.8L7.8 14.2C7.6 14.1 7.3 14 7 14C6.2 14 5.5 14.7 5.5 15.5C5.5 16.3 6.2 17 7 17C7.6 17 8.2 16.6 8.4 16.1L18.9 11.7C19.1 11.8 19.3 11.9 19.5 11.9C20.3 11.9 21 11.2 21 10.4C21 9.6 20.3 8.9 19.5 8.9V7.5Z"/>
    </svg>
  );
};
