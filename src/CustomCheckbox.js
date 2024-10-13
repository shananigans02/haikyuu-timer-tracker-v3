import React from 'react';

const CustomCheckbox = ({ checked, onChange, theme }) => {
  return (
    <div className="relative inline-block w-5 h-5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="absolute opacity-0 w-0 h-0"
      />
      <span className={`bg-transparent absolute inset-0 border-[1.5px] rounded cursor-pointer ${theme === 'dark' ? `border-customOrange` : `border-customBlue`} 
      }`}>
        {checked && (
          <svg
            className={`w-full h-full ${theme === 'dark' ? 'text-customOrange' : 'text-customBlue'}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </span>
    </div>
  );
};

export default CustomCheckbox;