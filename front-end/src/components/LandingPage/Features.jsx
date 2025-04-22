"use client";
import React from "react";

const FeatureCard = ({ icon, title, description }) => (
  <article className="p-6 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] w-[389px] max-md:w-full">
    <div className="flex justify-center items-center mb-4 w-12 h-12 bg-blue-100 rounded-full">
      {icon}
    </div>
    <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-base text-gray-600">{description}</p>
  </article>
);

export const Features = () => {
  const features = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 2.5C2.5 1.80859 1.94141 1.25 1.25 1.25C0.558594 1.25 0 1.80859 0 2.5V15.625C0 17.3516 1.39844 18.75 3.125 18.75H18.75C19.4414 18.75 20 18.1914 20 17.5C20 16.8086 19.4414 16.25 18.75 16.25H3.125C2.78125 16.25 2.5 15.9688 2.5 15.625V2.5ZM18.3828 5.88281C18.8711 5.39453 18.8711 4.60156 18.3828 4.11328C17.8945 3.625 17.1016 3.625 16.6133 4.11328L12.5 8.23047L10.2578 5.98828C9.76953 5.5 8.97656 5.5 8.48828 5.98828L4.11328 10.3633C3.625 10.8516 3.625 11.6445 4.11328 12.1328C4.60156 12.6211 5.39453 12.6211 5.88281 12.1328L9.375 8.64453L11.6172 10.8867C12.1055 11.375 12.8984 11.375 13.3867 10.8867L18.3867 5.88672L18.3828 5.88281Z"
            fill="#2563EB"
          />
        </svg>
      ),
      title: "Real-time Monitoring",
      description:
        "Track water usage, pressure, and quality parameters in real-time with our advanced sensors.",
    },
    {
      icon: (
        <svg
          width="19"
          height="20"
          viewBox="0 0 19 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.32811 0C8.6367 0 8.07811 0.558594 8.07811 1.25V2C5.22655 2.57813 3.07811 5.10156 3.07811 8.125V8.85938C3.07811 10.6953 2.40233 12.4687 1.18358 13.8437L0.894516 14.168C0.566391 14.5352 0.488266 15.0625 0.687485 15.5117C0.886703 15.9609 1.33592 16.25 1.82811 16.25H16.8281C17.3203 16.25 17.7656 15.9609 17.9687 15.5117C18.1719 15.0625 18.0898 14.5352 17.7617 14.168L17.4726 13.8437C16.2539 12.4687 15.5781 10.6992 15.5781 8.85938V8.125C15.5781 5.10156 13.4297 2.57813 10.5781 2V1.25C10.5781 0.558594 10.0195 0 9.32811 0ZM11.0976 19.2695C11.5664 18.8008 11.8281 18.1641 11.8281 17.5H9.32811H6.82811C6.82811 18.1641 7.08983 18.8008 7.55858 19.2695C8.02733 19.7383 8.66405 20 9.32811 20C9.99217 20 10.6289 19.7383 11.0976 19.2695Z"
            fill="#2563EB"
          />
        </svg>
      ),
      title: "Smart Alerts",
      description:
        "Receive instant notifications for leaks, unusual consumption patterns, or quality issues.",
    },
    {
      icon: (
        <svg
          width="23"
          height="20"
          viewBox="0 0 23 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.2812 9.375V0.648438C12.2812 0.296875 12.5547 0 12.9062 0C17.7383 0 21.6562 3.91797 21.6562 8.75C21.6562 9.10156 21.3594 9.375 21.0078 9.375H12.2812ZM1.65625 10.625C1.65625 5.88672 5.17578 1.96484 9.74219 1.33984C10.1016 1.28906 10.4062 1.57813 10.4062 1.94141V11.25L16.5195 17.3633C16.7812 17.625 16.7617 18.0547 16.4609 18.2656C14.9297 19.3594 13.0547 20 11.0312 20C5.85547 20 1.65625 15.8047 1.65625 10.625ZM22.2188 11.25C22.582 11.25 22.8672 11.5547 22.8203 11.9141C22.5195 14.0977 21.4687 16.0391 19.9336 17.4727C19.6992 17.6914 19.332 17.6758 19.1055 17.4453L12.9062 11.25H22.2188Z"
            fill="#2563EB"
          />
        </svg>
      ),
      title: "Analytics Dashboard",
      description:
        "Comprehensive analytics and reporting tools for better decision-making.",
    },
  ];

  return (
    <section className="p-20 bg-white max-md:p-10 max-sm:p-6">
      <div className="px-6 mx-auto max-w-screen-xl">
        <header className="mb-16 text-center">
          <h2 className="mb-3.5 text-3xl font-bold text-gray-900">
            Key Features
          </h2>
          <p className="text-base text-gray-600">
            Advanced monitoring solutions for efficient water management
          </p>
        </header>
        <div className="flex gap-8 justify-center max-md:flex-col max-md:items-center">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
