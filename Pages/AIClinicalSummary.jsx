import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, TrendingUp, AlertCircle, FileText, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function AIClinicalSummary() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const { data: summaries = [] } = useQuery({
    queryKey: ['clinical-summaries'],
    queryFn: () => base44.entities.ClinicalSummary.list('-created_date')
  });

  const generateSummary = async () => {
    if (!selectedPatient) return;
    
    setIsGenerating(true);
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      
      const prompt = `Generate a comprehensive clinical summary for this patient:
      
Name: ${patient.full_name}
Age: ${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}
Allergies: ${patient.allergies?.join(', ') || 'None'}
Chronic Conditions: ${patient.chronic_conditions?.join(', ') || 'None'}
Current Medications: ${patient.current_medications?.map(m => m.name).join(', ') || 'None'}
Past Surgeries: ${patient.past_surgeries?.join(', ') || 'None'}

Provide:
1. Brief clinical overview
2. Current diagnoses
3. Medication summary
4. Risk assessment score (0-100)
5. Key risk factors`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary_text: { type: "string" },
            diagnoses: { type: "array", items: { type: "string" } },
            lab_results_summary: { type: "string" },
            medications_summary: { type: "string" },
            risk_score: { type: "number" },
            risk_factors: { type: "array", items: { type: "string" } }
          }
        }
      });

      await base44.entities.ClinicalSummary.create({
        patient_id: selectedPatient,
        ...result,
        generated_date: new Date().toISOString(),
        last_visit_date: new Date().toISOString()
      });

      queryClient.invalidateQueries(['clinical-summaries']);
      alert('Clinical summary generated successfully!');
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Error generating summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskColor = (score) => {
    if (score >= 75) return "bg-red-100 text-red-800 border-red-300";
    if (score >= 50) return "bg-orange-100 text-orange-800 border-orange-300";
    if (score >= 25) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Clinical Summary Generator</h1>
              <p className="text-gray-600">AI-powered patient history analysis and risk assessment</p>
            </div>
          </div>
        </div>

        {/* Generation Section */}
        <Card className="mb-8 border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Generate New Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className="border-purple-300 focus:border-purple-500">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name} - {patient.patient_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={generateSummary}
                disabled={!selectedPatient || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summaries List */}
        <div className="grid grid-cols-1 gap-6">
          {summaries.map((summary, index) => {
            const patient = patients.find(p => p.id === summary.patient_id);
            return (
              <motion.div
                key={summary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:border-purple-300 transition-all hover:shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{patient?.full_name || 'Unknown Patient'}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Generated: {new Date(summary.generated_date || summary.created_date).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={`${getRiskColor(summary.risk_score)} border px-4 py-2 text-lg font-bold`}>
                        Risk: {summary.risk_score}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Clinical Overview */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        Clinical Summary
                      </h3>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {summary.summary_text}
                      </p>
                    </div>

                    {/* Diagnoses */}
                    {summary.diagnoses && summary.diagnoses.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          Current Diagnoses
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {summary.diagnoses.map((diagnosis, i) => (
                            <Badge key={i} variant="outline" className="border-red-300 text-red-700">
                              {diagnosis}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Medications */}
                    {summary.medications_summary && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Medications Summary</h3>
                        <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{summary.medications_summary}</p>
                      </div>
                    )}

                    {/* Risk Factors */}
                    {summary.risk_factors && summary.risk_factors.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-600" />
                          Risk Factors
                        </h3>
                        <ul className="space-y-2">
                          {summary.risk_factors.map((factor, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700">
                              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {summaries.length === 0 && (
            <Card className="p-12 text-center">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Summaries Yet</h3>
              <p className="text-gray-500">Select a patient and generate your first AI clinical summary</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}