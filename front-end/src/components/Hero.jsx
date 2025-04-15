"use client";
import React from "react";
import { Button } from "./Button";

export const Hero = () => {
  return (
    <section className="px-20 py-24 max-md:p-10 max-sm:p-6">
      <div className="flex gap-12 justify-center items-start px-6 py-14 mx-auto max-w-screen-xl max-md:flex-col max-md:items-center">
        <div className="w-[592px] max-md:w-full">
          <h1 className="mb-16 text-5xl font-bold leading-10 text-gray-900 max-sm:text-3xl max-sm:leading-9">
            Smart Water Monitoring System
          </h1>
          <p className="mb-20 text-lg leading-5 text-gray-600 max-sm:text-base">
            Real-time monitoring and analytics for your water supply system. Get
            instant alerts, usage patterns, and quality metrics at your
            fingertips.
          </p>
          <div className="flex gap-4 max-sm:flex-col max-sm:gap-3">
            <Button className="px-8 py-3.5 max-sm:w-full max-sm:text-center">
              Get Started
            </Button>
            <Button
              variant="outline"
              className="px-8 py-3.5 max-sm:w-full max-sm:text-center"
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="w-[592px] max-md:w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/42c4de1cd425e0d1c68078bb12a70fc01cd81c71"
            alt="Dashboard"
            className="w-full h-auto rounded-lg shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
          />
        </div>
      </div>
    </section>
  );
};
