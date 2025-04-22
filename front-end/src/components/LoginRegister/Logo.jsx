import React from "react";

export const Logo = () => {
  return (
    <div className="flex justify-center items-center mb-6">
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<svg width="28" height="37" viewBox="0 0 28 37" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon" style="width: 27px; height: 36px; margin-right: 8px"> <g clip-path="url(#clip0_1_336)"> <path d="M13.8281 36.5C6.375 36.5 0.328125 30.4531 0.328125 23C0.328125 16.5875 9.48281 4.55703 12.0422 1.32266C12.4641 0.795312 13.0898 0.5 13.7648 0.5H13.8914C14.5664 0.5 15.1922 0.795312 15.6141 1.32266C18.1734 4.55703 27.3281 16.5875 27.3281 23C27.3281 30.4531 21.2812 36.5 13.8281 36.5ZM7.07812 24.125C7.07812 23.5063 6.57188 23 5.95312 23C5.33437 23 4.82812 23.5063 4.82812 24.125C4.82812 28.4773 8.35078 32 12.7031 32C13.3219 32 13.8281 31.4937 13.8281 30.875C13.8281 30.2563 13.3219 29.75 12.7031 29.75C9.59531 29.75 7.07812 27.2328 7.07812 24.125Z" fill="#2563EB"></path> </g> <defs> <clipPath id="clip0_1_336"> <path d="M0.328125 0.5H27.3281V36.5H0.328125V0.5Z" fill="white"></path> </clipPath> </defs> </svg>',
          }}
        />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">WaterWatch</h1>
    </div>
  );
};
