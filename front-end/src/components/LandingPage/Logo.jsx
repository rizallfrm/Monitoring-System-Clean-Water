"use client";
import React from "react";

export const Logo = ({ className = "", color = "#2563EB" }) => {
  return (
    <div className={`flex items-center gap-3 -ml-2 ${className}`}>
      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl shadow-sm">
        <svg
          width="24"
          height="28"
          viewBox="0 0 18 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_1_526)">
            <path
              d="M9 24C4.03125 24 0 19.9688 0 15C0 10.725 6.10313 2.70469 7.80938 0.548437C8.09063 0.196875 8.50781 0 8.95781 0H9.04219C9.49219 0 9.90937 0.196875 10.1906 0.548437C11.8969 2.70469 18 10.725 18 15C18 19.9688 13.9688 24 9 24ZM4.5 15.75C4.5 15.3375 4.1625 15 3.75 15C3.3375 15 3 15.3375 3 15.75C3 18.6516 5.34844 21 8.25 21C8.6625 21 9 20.6625 9 20.25C9 19.8375 8.6625 19.5 8.25 19.5C6.17812 19.5 4.5 17.8219 4.5 15.75Z"
              fill={color}
            />
          </g>
          <defs>
            <clipPath id="clip0_1_526">
              <path d="M0 0H18V24H0V0Z" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <span className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
        WaterWatch
      </span>
    </div>
  );
};
