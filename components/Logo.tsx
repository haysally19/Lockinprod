import React from 'react';

const Logo: React.FC<{ className?: string; showText?: boolean; color?: string }> = ({ className, showText = false }) => {
  return (
    <img
      src="/gemini_generated_image_iqcvyeiqcvyeiqcv.jpg"
      alt="Lockin AI Logo"
      className={`h-full w-auto object-contain ${className || ''}`}
    />
  );
};

export default Logo;