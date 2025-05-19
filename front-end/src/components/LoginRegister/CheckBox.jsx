import React from "react";

const  Checkbox = ({ label, children }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input type="checkbox" className="hidden" />
      <div className="mr-2 w-4 h-4 bg-white rounded-sm border-black border-solid border-[0.5px]" />
      <span className="text-sm text-gray-500">{label || children}</span>
    </label>
  );
};

export default Checkbox