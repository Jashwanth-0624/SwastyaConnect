import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, HeartOff, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const featurePageMap = {
  "AI Clinical Summary Generator": "AIClinicalSummary",
  "Smart Patient Identity Matching (UPI++)": "PatientMatching",
  "Real-Time Medical Event Alerts": "MedicalAlerts",
  "Advanced Consent Calendar": "ConsentCalendar",
  "Predictive Analytics Dashboard": "PredictiveAnalytics",
  "Medical Document OCR + Data Extraction": "DocumentOCR",
  "Emergency Health Data Access (QR Code)": "EmergencyQR",
  "Drug Interaction Checker": "DrugChecker",
  "Telemedicine Integration (HIE + Remote Care)": "Telemedicine",
  "National Health Ecosystem (ABDM Ready)": "ABDMIntegration"
};

export default function FeatureCard({ icon: Icon, title, description, index, gradient }) {
  const pageName = featurePageMap[title];
  const [isInterested, setIsInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestToggle = async () => {
    setIsLoading(true);
    try {
      const user = await base44.auth.me();
      
      if (!isInterested) {
        await base44.entities.FeatureInterest.create({
          feature_name: title,
          user_email: user.email,
          interest_level: "interested"
        });
        setIsInterested(true);
      } else {
        setIsInterested(false);
      }
    } catch (error) {
      // If not authenticated, just toggle locally
      setIsInterested(!isInterested);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Link to={pageName ? createPageUrl(pageName) : "#"}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative cursor-pointer"
      >
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative h-full bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6 hover:border-teal-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1">
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
          <div className={`absolute -top-10 -right-10 w-20 h-20 ${gradient} rotate-45 opacity-20`} />
        </div>
        
        {/* Feature Number */}
        <div className="absolute top-4 right-4 text-xs font-bold text-gray-300">
          {String(index + 1).padStart(2, '0')}
        </div>
        
        {/* Icon Container */}
        <div className={`w-14 h-14 rounded-xl ${gradient} p-3 mb-4 shadow-lg`}>
          <Icon className="w-full h-full text-white" strokeWidth={1.5} />
        </div>
        
        {/* Content */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
        
        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleInterestToggle();
            }}
            disabled={isLoading}
            className="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:border-teal-300 hover:shadow-md transition-all duration-300 disabled:opacity-50"
            title={isInterested ? "Remove from interested" : "Mark as interested"}
          >
            {isInterested ? (
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            ) : (
              <HeartOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {pageName && (
            <div className="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg group-hover:border-teal-500 group-hover:bg-teal-50 transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </div>
          )}
        </div>
        
        {/* Bottom Accent Line */}
        <div className={`absolute bottom-0 left-6 right-6 h-0.5 ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`} />
      </div>
    </motion.div>
    </Link>
  );
}