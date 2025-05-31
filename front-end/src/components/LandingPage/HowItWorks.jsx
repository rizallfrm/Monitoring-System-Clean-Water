"use client";
import React from "react";
import { Link } from "react-router-dom";
import { 

  FileText, 
  Bell, 
 
  Users, 
  CheckCircle, 
 
  ChevronRight,
  Play,

  Globe
} from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Update Status",
      description: "Pengelola PDAM atau petugas mengupdate status sistem air secara real-time",
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02", 
      title: "Akses Informasi",
      description: "Pengguna mengakses website untuk melihat status dan kualitas air terbaru",
      icon: <Globe className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "03",
      title: "Laporan Masalah", 
      description: "Pengguna bisa melaporkan masalah kualitas air dengan mudah dan cepat",
      icon: <FileText className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Play className="w-4 h-4" />
            Cara Kerja
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Mudah dalam 3 Langkah
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem yang dirancang untuk kemudahan dan efisiensi maksimal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform -translate-y-1/2 z-10"></div>
              )}
              
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  {/* Step Number */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.color} text-white rounded-2xl text-2xl font-bold mb-6`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${step.color} bg-opacity-10 rounded-xl text-gray-600`}>
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <div className="mt-16 bg-gray-800 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold text-center mb-8">Alur Sistem Real-Time</h3>
          <div className="flex items-center justify-center space-x-4 overflow-x-auto">
            <div className="flex items-center gap-4 min-w-max">
              <div className="bg-blue-600 p-4 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <div className="bg-green-600 p-4 rounded-full">
                <Globe className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <div className="bg-purple-600 p-4 rounded-full">
                <Bell className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <div className="bg-pink-600 p-4 rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;