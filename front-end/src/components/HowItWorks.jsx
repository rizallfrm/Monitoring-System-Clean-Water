"use client";
import React from "react";

const Step = ({ icon, title, description }) => (
  <div className="text-center w-[379px] max-md:w-full">
    <div className="flex justify-center items-center mx-auto mt-0 mb-6 w-16 h-16 bg-blue-100 rounded-full">
      {icon}
    </div>
    <h3 className="mb-5 text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-base text-gray-600">{description}</p>
  </div>
);

export const HowItWorks = () => {
  const steps = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.66406 20.9859L7.07344 22.3688C6.19687 21.9234 5.39063 21.375 4.65938 20.7328L5.72344 19.6688C6.30937 20.1797 6.96094 20.625 7.66406 20.9859ZM2.23125 12.75H0.726562C0.792187 13.7438 0.979688 14.7047 1.275 15.6141L2.67188 15.0563C2.44219 14.3203 2.2875 13.5469 2.23125 12.75ZM2.23125 11.25C2.29687 10.3688 2.475 9.51562 2.75156 8.71406L1.36875 8.12344C1.01719 9.10781 0.796875 10.1578 0.726562 11.25H2.23125Z"
            fill="#2563EB"
          />
        </svg>
      ),
      title: "Install Sensors",
      description:
        "Smart sensors are installed at key points in your water supply system",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 31 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.52496 9.51094C6.75933 6.40781 11.1468 4.5 15.9843 4.5C20.8218 4.5 25.2093 6.40781 28.4437 9.51094C29.0437 10.0828 29.9906 10.0641 30.5625 9.46875C31.1343 8.87344 31.1156 7.92188 30.5203 7.35C26.7515 3.72656 21.6281 1.5 15.9843 1.5C10.3406 1.5 5.21714 3.72656 1.44371 7.34531C0.848394 7.92187 0.829644 8.86875 1.40152 9.46875C1.97339 10.0688 2.92496 10.0875 3.52027 9.51094H3.52496Z"
            fill="#2563EB"
          />
        </svg>
      ),
      title: "Connect & Monitor",
      description:
        "Sensors connect to our cloud platform for real-time monitoring",
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 19 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.40625 3C1.40625 1.34531 2.75156 0 4.40625 0H14.9062C16.5609 0 17.9062 1.34531 17.9062 3V21C17.9062 22.6547 16.5609 24 14.9062 24H4.40625C2.75156 24 1.40625 22.6547 1.40625 21V3Z"
            fill="#2563EB"
          />
        </svg>
      ),
      title: "Access Anywhere",
      description: "Monitor and manage your water system from any device",
    },
  ];

  return (
    <section className="p-20 bg-white max-md:p-10 max-sm:p-6">
      <div className="px-6 mx-auto max-w-screen-xl text-center">
        <h2 className="mb-3.5 text-3xl font-bold text-gray-900">
          How It Works
        </h2>
        <div className="flex gap-12 justify-center mt-16 max-md:flex-col max-md:items-center">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};
