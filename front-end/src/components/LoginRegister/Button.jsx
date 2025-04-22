import React from "react";

export const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full h-10 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer max-md:h-[38px] max-sm:h-9"
    >
      {children}
    </button>
  );
};
