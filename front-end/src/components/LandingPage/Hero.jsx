"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
   Droplets,
   ChevronRight,
  Play
} from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState(0);
  const texts = [
    "Informasi Kualitas Air Bersih PDAM",
    "Mudah dan Cepat Diakses",
    "Transparan dan Real-Time"
  ];
  
  const handleStartNow = () => {
    navigate('/login');
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 overflow-hidden animate-gradient-x">
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          background: linear-gradient(-45deg, #38bdf8, #3b82f6, #2563eb, #1d4ed8);
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          />
        ))}
      </div>

      {/* Water Wave Animation */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-400/30 to-transparent">
        <div className="absolute bottom-0 left-0 w-full h-16 bg-blue-400/20 rounded-t-full animate-pulse" style={{animationDuration: '4s'}} />
        <div className="absolute bottom-0 left-1/4 w-3/4 h-12 bg-blue-300/15 rounded-t-full animate-pulse" style={{animationDuration: '6s', animationDelay: '1s'}} />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated Water Drop Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Droplets className="w-20 h-20 text-blue-200 animate-bounce" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-300 rounded-full animate-ping" />
            </div>
          </div>

          {/* Animated Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="block transform transition-all duration-500 ease-in-out">
              {texts[currentText]}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Pantau kondisi dan kualitas air bersih di wilayah Anda secara transparan dan real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleStartNow}
              className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Mulai Sekarang
            </button>
            <button className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
              Pelajari Lebih Lanjut
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Floating Water Droplets */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
              <div className="w-6 h-6 bg-cyan-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
              <div className="w-5 h-5 bg-teal-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
              <div className="w-4 h-4 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0.6s'}} />
              <div className="w-3 h-3 bg-cyan-300 rounded-full animate-bounce" style={{animationDelay: '0.8s'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;