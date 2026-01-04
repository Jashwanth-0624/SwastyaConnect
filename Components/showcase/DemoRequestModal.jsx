import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Building2, User, Mail, Phone, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { base44 } from "@/api/base44Client";

const allFeatures = [
  "AI Clinical Summary Generator",
  "Smart Patient Identity Matching",
  "Real-Time Medical Event Alerts",
  "Advanced Consent Calendar",
  "Predictive Analytics Dashboard",
  "Medical Document OCR",
  "Emergency Health QR Code",
  "Drug Interaction Checker",
  "Telemedicine Integration",
  "ABDM Compatibility"
];

export default function DemoRequestModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    interested_features: [],
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await base44.entities.DemoRequest.create(formData);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          organization: "",
          role: "",
          interested_features: [],
          message: ""
        });
      }, 2000);
    } catch (error) {
      console.error("Error submitting demo request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      interested_features: prev.interested_features.includes(feature)
        ? prev.interested_features.filter(f => f !== feature)
        : [...prev.interested_features, feature]
    }));
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {submitted ? (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Send className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-600">Our team will contact you within 24 hours.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="relative p-6 border-b bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-2xl">
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Request a Demo</h2>
                    <p className="text-gray-600">Fill in your details and we'll reach out to schedule a personalized demonstration</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="flex items-center gap-2">
                          <User className="w-4 h-4 text-teal-600" />
                          Full Name *
                        </Label>
                        <Input
                          id="full_name"
                          required
                          value={formData.full_name}
                          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          placeholder="Dr. John Doe"
                          className="border-gray-300 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-teal-600" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="john@hospital.com"
                          className="border-gray-300 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-teal-600" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+91 98765 43210"
                          className="border-gray-300 focus:border-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organization" className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-teal-600" />
                          Organization *
                        </Label>
                        <Input
                          id="organization"
                          required
                          value={formData.organization}
                          onChange={(e) => setFormData({...formData, organization: e.target.value})}
                          placeholder="City General Hospital"
                          className="border-gray-300 focus:border-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-teal-600" />
                        Your Role
                      </Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                        <SelectTrigger className="border-gray-300 focus:border-teal-500">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="doctor">Doctor / Physician</SelectItem>
                          <SelectItem value="admin">Hospital Administrator</SelectItem>
                          <SelectItem value="it_manager">IT Manager</SelectItem>
                          <SelectItem value="cio">CIO / CTO</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Interested Features</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg">
                        {allFeatures.map((feature) => (
                          <div key={feature} className="flex items-start space-x-2">
                            <Checkbox
                              id={feature}
                              checked={formData.interested_features.includes(feature)}
                              onCheckedChange={() => toggleFeature(feature)}
                              className="mt-1"
                            />
                            <label
                              htmlFor={feature}
                              className="text-sm text-gray-700 cursor-pointer leading-tight"
                            >
                              {feature}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us about your specific requirements..."
                        rows={4}
                        className="border-gray-300 focus:border-teal-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}