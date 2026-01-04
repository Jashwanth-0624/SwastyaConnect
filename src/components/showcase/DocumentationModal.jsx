import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download, ExternalLink, Book, Code, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const documentSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Book,
    content: [
      { title: "Quick Start Guide", type: "PDF", size: "2.3 MB" },
      { title: "Installation Manual", type: "PDF", size: "1.8 MB" },
      { title: "System Requirements", type: "PDF", size: "890 KB" }
    ]
  },
  {
    id: "api-docs",
    title: "API Documentation",
    icon: Code,
    content: [
      { title: "FHIR API Reference", type: "PDF", size: "4.2 MB" },
      { title: "HL7 Integration Guide", type: "PDF", size: "3.1 MB" },
      { title: "REST API Endpoints", type: "PDF", size: "1.5 MB" }
    ]
  },
  {
    id: "security",
    title: "Security & Compliance",
    icon: Shield,
    content: [
      { title: "ABDM Compliance Guide", type: "PDF", size: "2.7 MB" },
      { title: "Data Privacy Standards", type: "PDF", size: "1.9 MB" },
      { title: "Security Best Practices", type: "PDF", size: "2.1 MB" }
    ]
  }
];

export default function DocumentationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("getting-started");

  const handleDownload = (docTitle) => {
    // Simulate download
    alert(`Downloading: ${docTitle}\n\nIn production, this would download the actual document.`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b bg-gradient-to-r from-cyan-50 to-blue-50">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Documentation</h2>
                    <p className="text-gray-600">Comprehensive guides and technical references</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    {documentSections.map((section) => (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        className="flex items-center gap-2"
                      >
                        <section.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{section.title}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {documentSections.map((section) => (
                    <TabsContent key={section.id} value={section.id} className="space-y-3">
                      {section.content.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FileText className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                              <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(doc.title)}
                              className="hover:bg-teal-50 hover:border-teal-500 hover:text-teal-700"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-cyan-50 hover:border-cyan-500 hover:text-cyan-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                  <p className="text-sm text-gray-700">
                    <strong>Need help?</strong> Contact our support team at{" "}
                    <a href="mailto:support@swasthyaconnect.in" className="text-teal-600 hover:underline">
                      support@swasthyaconnect.in
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

