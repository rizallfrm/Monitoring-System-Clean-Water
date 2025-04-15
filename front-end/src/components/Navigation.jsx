"use client";
import React, { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-800 z-50 relative">
      <nav className="max-w-[1440px] mx-auto px-6 sm:px-10 md:px-20">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden sm:flex gap-6 items-center">
            {["Home", "Features", "About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
              >
                {item}
              </a>
            ))}
            <Button className="ml-4">Login</Button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={toggleMobileMenu}
            className="sm:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-2 flex flex-col gap-4 px-2 py-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 rounded-b-lg shadow-md animate-fade-in-down">
            {["Home", "Features", "About", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium px-4 py-2"
              >
                {item}
              </a>
            ))}
            <Button className="mx-4 mt-2">Login</Button>
          </div>
        )}
      </nav>
    </header>
  );
};
