"use client";

import { Router } from "lucide-react";

export default function LoginHero() {
  return (
    <div className="relative hidden w-1/2 bg-blue-600 md:block overflow-hidden">
      {/* Background Overlay Image dari file image_95865d.jpg */}
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: "url('/image_95865d.png')" }} 
      />
      
      {/* Gradient Overlay untuk kesan korporat dan pembacaan teks yang lebih baik */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-700/80 via-blue-800/60 to-blue-900/90" />
      
      {/* Content Section */}
      <div className="relative z-20 flex h-full flex-col justify-center p-16 text-white">
        <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <Router size={32} className="text-blue-100" />
        </div>
        
        <h2 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight">
          Reliable <br /> 
          <span className="text-blue-200">Infrastructure</span>
        </h2>
        
        <div className="w-16 h-1 bg-blue-400 mb-6 rounded-full" />
        
        <p className="text-xl text-blue-50/90 leading-relaxed font-light max-w-md">
          Precision management for the next generation of fiber-optic connectivity. 
          Administer, monitor, and scale with <span className="font-semibold text-white">PT. Smart</span>.
        </p>
      </div>

      {/* Dekorasi Tambahan: Glassmorphism effect di pojok bawah */}
      <div className="absolute bottom-10 left-16 z-20 flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-blue-100/70">
          System Status: Operational
        </span>
      </div>
    </div>
  );
}