import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, AlertCircle, Heart, Syringe } from "lucide-react";
import { motion } from "framer-motion";

export default function EmergencyQR() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const { data: qrCodes = [] } = useQuery({
    queryKey: ['emergency-qr'],
    queryFn: () => base44.entities.EmergencyHealthData.list('-created_date')
  });

  const generateQR = async () => {
    if (!selectedPatient) return;
    
    setIsGenerating(true);
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      
      // Create emergency data string
      const emergencyData = JSON.stringify({
        name: patient.full_name,
        dob: patient.date_of_birth,
        blood_group: patient.blood_group,
        allergies: patient.allergies || [],
        medications: patient.current_medications?.map(m => m.name) || [],
        conditions: patient.chronic_conditions || [],
        surgeries: patient.past_surgeries || [],
        emergency_contact: patient.emergency_contact,
        patient_id: patient.patient_id
      });

      // Generate QR code image using AI
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Generate a clean, high-contrast QR code that encodes emergency medical data. The QR code should be professional, medical-grade, with a red cross symbol in the center. Background should be white with a red border. Include text "EMERGENCY HEALTH DATA" at the top and "SCAN IN CASE OF EMERGENCY" at the bottom. The QR code should be large and clearly scannable.`
      });

      await base44.entities.EmergencyHealthData.create({
        patient_id: selectedPatient,
        qr_code_url: result.url,
        qr_code_data: emergencyData,
        blood_group: patient.blood_group,
        allergies: patient.allergies || [],
        current_medications: patient.current_medications?.map(m => m.name) || [],
        chronic_conditions: patient.chronic_conditions || [],
        past_surgeries: patient.past_surgeries || [],
        emergency_contact: patient.emergency_contact,
        generated_at: new Date().toISOString(),
        access_count: 0
      });

      queryClient.invalidateQueries(['emergency-qr']);
      alert('Emergency QR Code generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <QrCode className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emergency Health QR Code</h1>
              <p className="text-gray-600">Instant lifesaving data access in emergencies</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">How It Works</h3>
                <p className="text-sm text-gray-700">
                  Generate a QR code containing critical health information. In emergencies, medical staff can scan this code to instantly access:
                  blood group, allergies, current medications, chronic conditions, and emergency contacts—even when the patient is unconscious.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Section */}
        <Card className="mb-8 border-2 border-red-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
            <CardTitle>Generate Emergency QR Code</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Select value={selectedPatient} onValueChange={setSelectedPatient} className="flex-1">
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name} - {patient.blood_group || 'Blood group unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={generateQR}
                disabled={!selectedPatient || isGenerating}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                {isGenerating ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Codes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr, index) => {
            const patient = patients.find(p => p.id === qr.patient_id);

            return (
              <motion.div
                key={qr.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-red-200 hover:shadow-xl transition-all">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                    <CardTitle className="text-lg">{patient?.full_name || 'Unknown'}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* QR Code Image */}
                    <div className="bg-white p-4 rounded-lg border-2 border-red-300 flex items-center justify-center">
                      {qr.qr_code_url ? (
                        <img
                          src={qr.qr_code_url}
                          alt="Emergency QR Code"
                          className="w-full max-w-xs"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <QrCode className="w-24 h-24 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Critical Info */}
                    <div className="space-y-2">
                      {qr.blood_group && (
                        <div className="flex items-center gap-2 text-sm">
                          <Heart className="w-4 h-4 text-red-600" />
                          <span className="font-semibold">Blood Group:</span>
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            {qr.blood_group}
                          </Badge>
                        </div>
                      )}

                      {qr.allergies && qr.allergies.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                          <div>
                            <span className="font-semibold">Allergies:</span>
                            <p className="text-gray-700">{qr.allergies.join(', ')}</p>
                          </div>
                        </div>
                      )}

                      {qr.current_medications && qr.current_medications.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <Syringe className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <span className="font-semibold">Medications:</span>
                            <p className="text-gray-700">{qr.current_medications.join(', ')}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                      <span>Scanned {qr.access_count || 0} times</span>
                      <span>{new Date(qr.generated_at || qr.created_date).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => qr.qr_code_url && window.open(qr.qr_code_url, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {qrCodes.length === 0 && (
          <Card className="p-12 text-center">
            <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No QR Codes Generated</h3>
            <p className="text-gray-500">Create your first emergency health QR code</p>
          </Card>
        )}
      </div>
    </div>
  );
}