import React from "react";

const FormInput = ({ label, placeholder, type = "text" }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-900">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="px-2.5 py-0 w-full text-sm text-gray-400 bg-gray-50 rounded-lg border border-gray-300 border-solid h-[42px]"
      />
    </div>
  );
};

export default FormInput;