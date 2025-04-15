"use client";
import React from "react";
import { Button } from "./Button";

export const Hero = () => {
  return (
    <section className="h-screen w-full bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] flex items-center justify-center">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-7xl px-6 md:px-20 gap-12">
        
        {/* Kiri: Teks */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Smart Water Monitoring System
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10">
            Real-time monitoring and analytics for your water supply system. Get
            instant alerts, usage patterns, and quality metrics at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Button className="px-8 py-3 text-base">Get Started</Button>
            <Button variant="outline" className="px-8 py-3 text-base">
              Learn More
            </Button>
          </div>
        </div>

        {/* Kanan: Gambar */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/42c4de1cd425e0d1c68078bb12a70fc01cd81c71"
            alt="Dashboard"
            className="w-full max-w-md md:max-w-lg h-auto rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};
