import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-cyan-50" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(13, 148, 136, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Floating Orbs */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-teal-400/20 to-cyan-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-300/20 rounded-full blur-3xl"
      />
      
      {/* DNA Helix Pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5">
        <svg viewBox="0 0 200 800" className="h-full w-full">
          <path d="M100,0 Q150,100 100,200 Q50,300 100,400 Q150,500 100,600 Q50,700 100,800" 
                fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-600" />
          <path d="M100,0 Q50,100 100,200 Q150,300 100,400 Q50,500 100,600 Q150,700 100,800" 
                fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-600" />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto text-center">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-teal-200/50 rounded-full mb-8 shadow-lg shadow-teal-500/5"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="text-sm font-medium text-teal-700">ABDM Certified Platform</span>
        </motion.div>
        
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              SwasthyaConnect
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-teal-600 mb-6">
            Bridging hospitals, empowering health.
          </p>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Empowering unified care through AI, interoperability, and precision health intelligence.
        </motion.p>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { icon: Heart, value: "10+", label: "Advanced Features" },
            { icon: Activity, value: "Real-Time", label: "Health Monitoring" },
            { icon: Shield, value: "100%", label: "ABDM Compliant" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="white" />
        </svg>
      </div>
    </div>
  );
}