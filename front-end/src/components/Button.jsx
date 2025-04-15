"use client";
import React from "react";

export const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
}) => {
  const baseStyles =
    "px-6 py-2 text-base rounded-full cursor-pointer transition-colors duration-200";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    white: "bg-white text-blue-600 hover:bg-gray-50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
