"use client";
import React from "react";
import { Logo } from "./Logo";

const FooterSection = ({ title, children }) => (
  <div className="w-[284px] max-md:w-[calc(50%_-_16px)] max-sm:w-full">
    <h3 className="mb-5 text-lg font-bold text-white">{title}</h3>
    {children}
  </div>
);

export const Footer = () => {
  return (
    <footer className="px-20 py-12 bg-gray-900 max-md:p-10 max-sm:p-6">
      <div className="px-6 mx-auto max-w-screen-xl">
        <div className="flex justify-between mb-12 max-md:flex-wrap max-md:gap-8">
          <FooterSection>
            <Logo className="mb-5" color="#60A5FA" />
            <p className="text-base text-gray-400">
              Smart water monitoring solutions for modern utilities.
            </p>
          </FooterSection>

          <FooterSection title="Quick Links">
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-base text-gray-400 hover:text-gray-300"
              >
                Features
              </a>
              <a
                href="#"
                className="text-base text-gray-400 hover:text-gray-300"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-base text-gray-400 hover:text-gray-300"
              >
                Case Studies
              </a>
              <a
                href="#"
                className="text-base text-gray-400 hover:text-gray-300"
              >
                Documentation
              </a>
            </div>
          </FooterSection>

          <FooterSection title="Contact">
            <div className="flex gap-2 items-center mb-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 2C0.671875 2 0 2.67188 0 3.5C0 3.97188 0.221875 4.41562 0.6 4.7L7.4 9.8C7.75625 10.0656 8.24375 10.0656 8.6 9.8L15.4 4.7C15.7781 4.41562 16 3.97188 16 3.5C16 2.67188 15.3281 2 14.5 2H1.5Z"
                  fill="#9CA3AF"
                />
              </svg>
              <a
                href="mailto:contact@waterwatch.com"
                className="text-base text-gray-400 hover:text-gray-300"
              >
                contact@waterwatch.com
              </a>
            </div>
            <div className="flex gap-2 items-center mb-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.15312 0.768722C4.9125 0.187472 4.27812 -0.121903 3.67188 0.0437222L0.921875 0.793722C0.378125 0.943722 0 1.43747 0 1.99997C0 9.73122 6.26875 16 14 16C14.5625 16 15.0563 15.6218 15.2063 15.0781L15.9563 12.3281C16.1219 11.7218 15.8125 11.0875 15.2312 10.8468L12.2312 9.59685C11.7219 9.38435 11.1313 9.53122 10.7844 9.95935L9.52188 11.5C7.32188 10.4593 5.54062 8.6781 4.5 6.4781L6.04063 5.21872C6.46875 4.86872 6.61562 4.28122 6.40312 3.77185L5.15312 0.771847V0.768722Z"
                  fill="#9CA3AF"
                />
              </svg>
              <a
                href="tel:+15551234567"
                className="text-base text-gray-400 hover:text-gray-300"
              >
                +1 (555) 123-4567
              </a>
            </div>
          </FooterSection>

          <FooterSection title="Follow Us">
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.9441 5.92638C17.9568 6.10403 17.9568 6.28173 17.9568 6.45938C17.9568 11.8781 13.8325 18.1218 6.29441 18.1218C3.97207 18.1218 1.81473 17.4492 0 16.2817"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.25 1.25H1.24609C0.558594 1.25 0 1.81641 0 2.51172V17.4883C0 18.1836 0.558594 18.75 1.24609 18.75H16.25"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.1875 10C20.1875 4.64844 15.8516 0.3125 10.5 0.3125C5.14844 0.3125 0.8125 4.64844 0.8125 10"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </FooterSection>
        </div>

        <div className="pt-8 text-base text-center text-gray-400 border-t border-solid border-t-gray-800">
          © 2025 WaterWatch. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
