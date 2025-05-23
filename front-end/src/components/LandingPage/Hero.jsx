"use client";
import React from "react";
import { Button } from "./Button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-[#dbeafe] to-[#eff6ff] flex items-center">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 gap-10">
        
        {/* Kiri: Teks */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Smart Water Monitoring System
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Real-time monitoring and analytics for your water supply system.
            Get instant alerts, usage patterns, and quality metrics at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            {/* Tombol ke halaman login */}
            <Link to="/login">
              <Button className="px-8 py-3 text-base">Get Started</Button>
            </Link>
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
            className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};
