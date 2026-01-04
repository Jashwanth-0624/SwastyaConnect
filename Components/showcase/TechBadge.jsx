import React from "react";
import { motion } from "framer-motion";

export default function TechBadge({ label, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm border border-teal-200/50 rounded-full text-sm font-medium text-teal-700 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 cursor-default"
    >
      <span className="w-1.5 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mr-2" />
      {label}
    </motion.span>
  );
}