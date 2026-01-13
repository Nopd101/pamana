import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ className = '', text = 'Back', onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center text-[#5a2d0c] font-bold transition-transform hover:scale-[1.01] cursor-pointer ${className}`}
    >
      <span className="mr-2">◀</span> {text}
    </button>
  );
};

export default BackButton;
