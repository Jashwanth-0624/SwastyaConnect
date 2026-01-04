import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Fingerprint,
  Bell,
  Calendar,
  TrendingUp,
  FileText,
  QrCode,
  Pill,
  Video,
  Globe
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";

import HeroSection from "@/components/showcase/HeroSection";
import FeatureCard from "@/components/showcase/FeatureCard";
import TechBadge from "@/components/showcase/TechBadge";
import DemoRequestModal from "@/components/showcase/DemoRequestModal";
import DocumentationModal from "@/components/showcase/DocumentationModal";

const features = [
  {
    icon: Brain,
    title: "AI Clinical Summary Generator",
    description: "Automatically produces a concise, AI-driven summary of patient history, diagnoses, labs, medications, allergies, and risk scoring using advanced NLP.",
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
    category: "ai"
  },
  {
    icon: Fingerprint,
    title: "Smart Patient Identity Matching (UPI++)",
    description: "AI + fuzzy matching merge duplicate patient records across hospitals into a single unified identity for seamless care continuity.",
    gradient: "bg-gradient-to-br from-teal-500 to-emerald-600",
    category: "ai"
  },
  {
    icon: Bell,
    title: "Real-Time Medical Event Alerts",
    description: "Instant notifications for abnormal vitals, new lab results, medication conflicts, and emergency admissions using Socket.io technology.",
    gradient: "bg-gradient-to-br from-orange-500 to-red-500",
    category: "monitoring"
  },
  {
    icon: Calendar,
    title: "Advanced Consent Calendar",
    description: "Time-based and condition-based patient consent control for secure, privacy-compliant data access with granular permissions.",
    gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
    category: "security"
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics Dashboard",
    description: "AI-powered predictions for readmission risk, disease progression, ICU transfer likelihood, and sepsis early warnings.",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    category: "ai"
  },
  {
    icon: FileText,
    title: "Medical Document OCR + Data Extraction",
    description: "Extracts structured data from scanned prescriptions, lab reports, and handwritten clinical notes using OCR + NLP technology.",
    gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    category: "ai"
  },
  {
    icon: QrCode,
    title: "Emergency Health Data Access (QR Code)",
    description: "Generates an Emergency Health QR Code for instant access to allergies, blood group, medications, and past surgeries when patient is unconscious.",
    gradient: "bg-gradient-to-br from-red-500 to-pink-600",
    category: "emergency"
  },
  {
    icon: Pill,
    title: "Drug Interaction Checker",
    description: "Cross-checks medication history with safety databases to warn doctors of drug-drug interactions, allergy triggers, and dangerous combinations.",
    gradient: "bg-gradient-to-br from-green-500 to-teal-600",
    category: "safety"
  },
  {
    icon: Video,
    title: "Telemedicine Integration (HIE + Remote Care)",
    description: "Allows doctors to access unified patient records during video consultations, ensuring continuity of care across remote settings.",
    gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
    category: "integration"
  },
  {
    icon: Globe,
    title: "National Health Ecosystem (ABDM Ready)",
    description: "Fully compatible with India's ABDM ecosystem for digital health IDs, consent-based exchange, and nationwide interoperability.",
    gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
    category: "integration"
  }
];

const technologies = [
  "FHIR", "HL7", "SNOMED CT", "LOINC", "ABDM", "HIE",
  "Electronic Health Records", "Telemedicine", "Consent-Based Access",
  "NLP", "Predictive Analytics", "Unified Health Data", "Interoperability Layer"
];

export default function AdvancedFeatures() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [stats, setStats] = useState({ demoRequests: 0, interests: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [demoRequests, interests] = await Promise.all([
        base44.entities.DemoRequest.list(),
        base44.entities.FeatureInterest.list()
      ]);
      setStats({
        demoRequests: demoRequests.length,
        interests: interests.length
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const filteredFeatures = activeCategory === "all" 
    ? features 
    : features.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Modals */}
      <DemoRequestModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <DocumentationModal isOpen={docsModalOpen} onClose={() => setDocsModalOpen(false)} />
      
      {/* Features Section */}
      <section className="relative py-16 md:py-24 px-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230d9488' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
              ADVANCED CAPABILITIES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Powered by Cutting-Edge Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              10 powerful features designed to transform healthcare delivery through AI, interoperability, and intelligent automation.
            </p>
            
            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-7 bg-gray-100">
                <TabsTrigger value="all">All Features</TabsTrigger>
                <TabsTrigger value="ai">AI Powered</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
                <TabsTrigger value="safety">Safety</TabsTrigger>
                <TabsTrigger value="integration">Integration</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {filteredFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                index={index}
              />
            ))}
          </div>
          
          {filteredFeatures.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No features found in this category.
            </div>
          )}
        </div>
      </section>
      
      {/* Technologies Section */}
      <section className="relative py-16 md:py-24 px-6 bg-gradient-to-b from-white via-teal-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-sm font-semibold rounded-full mb-4">
              TECHNOLOGY STACK
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built on Industry Standards
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Leveraging globally recognized healthcare interoperability standards and cutting-edge AI technologies.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {technologies.map((tech, index) => (
              <TechBadge key={tech} label={tech} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-80 h-80 border border-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 border border-white/5 rounded-full"
        />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              The Future of Healthcare is Here
            </h2>
            <p className="text-lg md:text-xl text-teal-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join the nationwide movement towards unified, intelligent, and patient-centric healthcare delivery.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDemoModalOpen(true)}
                className="px-8 py-4 bg-white text-teal-700 font-semibold rounded-xl shadow-xl shadow-black/20 hover:shadow-2xl transition-all duration-300"
              >
                Request Demo
                {stats.demoRequests > 0 && (
                  <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                    {stats.demoRequests} requests
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDocsModalOpen(true)}
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                View Documentation
              </motion.button>
            </div>
          </motion.div>
          
          {/* Bottom Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <p className="text-teal-200 text-sm">
              © 2024 SwasthyaConnect • Ayushman Health Interoperability Platform
            </p>
            <p className="text-teal-300/50 text-xs mt-2">
              ABDM Certified • HIPAA Compliant • ISO 27001
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}