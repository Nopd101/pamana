import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// 👇 Import SFX
import renameTabSfx from '../assets/sfx/rename_tab.mp3';

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();
  
  // 👇 Audio Setup
  const sfxRef = useRef(null);

  useEffect(() => {
    sfxRef.current = new Audio(renameTabSfx);
    sfxRef.current.volume = 0.5;
    sfxRef.current.preload = 'auto';
  }, []);

  const handleClick = () => {
    // Play Sound
    if (sfxRef.current) {
      sfxRef.current.currentTime = 0;
      sfxRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    
    // Navigate Back
    navigate(-1);
  };

  return (
    <button 
      onClick={handleClick} 
      className={`flex items-center text-[#5a2d0c] font-bold transition-transform hover:scale-[1.01] text-sm md:text-base cursor-pointer ${className}`}
    >
      <span className="mr-2">◀</span> Back
    </button>
  );
};

export default BackButton;