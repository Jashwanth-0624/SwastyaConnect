import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DrugChecker() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [drugName, setDrugName] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const { data: interactions = [] } = useQuery({
    queryKey: ['drug-interactions'],
    queryFn: () => base44.entities.DrugInteraction.list('-created_date')
  });

  const checkDrug = async () => {
    if (!selectedPatient || !drugName) return;
    
    setIsChecking(true);
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      
      const prompt = `As a clinical pharmacist, check for drug interactions for ${drugName} in this patient:

Allergies: ${patient.allergies?.join(', ') || 'None'}
Current Medications: ${patient.current_medications?.map(m => m.name).join(', ') || 'None'}
Chronic Conditions: ${patient.chronic_conditions?.join(', ') || 'None'}

Identify:
1. Drug-drug interactions with current medications
2. Drug-allergy interactions
3. Drug-condition contraindications
4. Duplicate therapy warnings

Return ONLY interactions found. If no interactions, return empty array.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            interactions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  interaction_type: { type: "string" },
                  severity: { type: "string" },
                  interacting_with: { type: "string" },
                  description: { type: "string" },
                  clinical_effects: { type: "string" },
                  recommendations: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Create interaction records
      if (result.interactions && result.interactions.length > 0) {
        for (const interaction of result.interactions) {
          await base44.entities.DrugInteraction.create({
            patient_id: selectedPatient,
            drug_name: drugName,
            ...interaction,
            status: 'active'
          });
        }
        queryClient.invalidateQueries(['drug-interactions']);
        alert(`Found ${result.interactions.length} potential interaction(s)!`);
      } else {
        alert('✓ No interactions found. Drug is safe to prescribe.');
      }

      setDrugName("");
    } catch (error) {
      console.error('Error:', error);
      alert('Error checking drug interactions');
    } finally {
      setIsChecking(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'contraindicated': return 'bg-red-600 text-white';
      case 'major': return 'bg-orange-600 text-white';
      case 'moderate': return 'bg-yellow-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'drug_allergy': return AlertTriangle;
      case 'drug_condition': return XCircle;
      default: return Pill;
    }
  };

  const resolveMutation = async (interactionId) => {
    try {
      await base44.entities.DrugInteraction.update(interactionId, { status: 'resolved' });
      queryClient.invalidateQueries(['drug-interactions']);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Drug Interaction Checker</h1>
              <p className="text-gray-600">AI-powered medication safety screening</p>
            </div>
          </div>
        </div>

        {/* Check Drug Card */}
        <Card className="mb-8 border-2 border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
            <CardTitle>Check New Medication</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Select Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Drug Name</Label>
                <Input
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  placeholder="Enter medication name"
                  onKeyPress={(e) => e.key === 'Enter' && checkDrug()}
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={checkDrug}
                  disabled={!selectedPatient || !drugName || isChecking}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                  {isChecking ? 'Checking...' : 'Check Interactions'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactions List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Detected Interactions</h2>
          
          <AnimatePresence>
            {interactions.filter(i => i.status === 'active').map((interaction, index) => {
              const patient = patients.find(p => p.id === interaction.patient_id);
              const TypeIcon = getTypeIcon(interaction.interaction_type);

              return (
                <motion.div
                  key={interaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-2 ${
                    interaction.severity?.toLowerCase() === 'contraindicated' || interaction.severity?.toLowerCase() === 'major'
                      ? 'border-red-400 bg-red-50'
                      : 'border-orange-300'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getSeverityColor(interaction.severity)}`}>
                          <TypeIcon className="w-6 h-6" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {interaction.drug_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Patient: {patient?.full_name || 'Unknown'}
                              </p>
                            </div>
                            <Badge className={`${getSeverityColor(interaction.severity)} border-0`}>
                              {interaction.severity?.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg border">
                              <p className="text-sm">
                                <span className="font-semibold">Interacts with:</span> {interaction.interacting_with}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-1">Description</p>
                              <p className="text-sm text-gray-700">{interaction.description}</p>
                            </div>

                            <div className="bg-orange-50 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-gray-900 mb-1">Clinical Effects</p>
                              <p className="text-sm text-gray-700">{interaction.clinical_effects}</p>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm font-semibold text-gray-900 mb-1">Recommendations</p>
                              <p className="text-sm text-gray-700">{interaction.recommendations}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={() => resolveMutation(interaction.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark as Resolved
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {interactions.filter(i => i.status === 'active').length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Interactions</h3>
              <p className="text-gray-500">Check a medication to screen for potential interactions</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}