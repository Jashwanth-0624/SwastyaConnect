import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, AlertTriangle, Brain, Activity, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function PredictiveAnalytics() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [predictionType, setPredictionType] = useState("readmission_risk");
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const { data: predictions = [] } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => base44.entities.PredictiveAnalytic.list('-created_date')
  });

  const generatePrediction = async () => {
    if (!selectedPatient) return;
    
    setIsGenerating(true);
    try {
      const patient = patients.find(p => p.id === selectedPatient);
      
      const prompt = `As a medical AI, predict the ${predictionType} for this patient:
      
Name: ${patient.full_name}
Age: ${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}
Chronic Conditions: ${patient.chronic_conditions?.join(', ') || 'None'}
Current Medications: ${patient.current_medications?.map(m => m.name).join(', ') || 'None'}
Allergies: ${patient.allergies?.join(', ') || 'None'}

Provide a risk score (0-100), risk level, contributing factors, and recommendations.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            risk_score: { type: "number" },
            risk_level: { type: "string", enum: ["low", "moderate", "high", "critical"] },
            contributing_factors: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            confidence_score: { type: "number" }
          }
        }
      });

      await base44.entities.PredictiveAnalytic.create({
        patient_id: selectedPatient,
        prediction_type: predictionType,
        ...result,
        prediction_date: new Date().toISOString(),
        model_version: "v2.3.1"
      });

      queryClient.invalidateQueries(['predictions']);
      alert('Prediction generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating prediction');
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'moderate': return 'bg-yellow-600';
      default: return 'bg-green-600';
    }
  };

  const getPredictionIcon = (type) => {
    switch (type) {
      case 'sepsis_warning': return AlertTriangle;
      case 'icu_transfer': return Activity;
      case 'mortality_risk': return HeartPulse;
      default: return TrendingUp;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Predictive Analytics Dashboard</h1>
              <p className="text-gray-600">AI-powered risk predictions and early warnings</p>
            </div>
          </div>
        </div>

        {/* Generation Card */}
        <Card className="mb-8 border-2 border-pink-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-600" />
              Generate New Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={predictionType} onValueChange={setPredictionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="readmission_risk">Readmission Risk</SelectItem>
                  <SelectItem value="disease_progression">Disease Progression</SelectItem>
                  <SelectItem value="icu_transfer">ICU Transfer</SelectItem>
                  <SelectItem value="sepsis_warning">Sepsis Warning</SelectItem>
                  <SelectItem value="mortality_risk">Mortality Risk</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={generatePrediction}
                disabled={!selectedPatient || isGenerating}
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
              >
                {isGenerating ? 'Analyzing...' : 'Generate Prediction'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Predictions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {predictions.map((prediction, index) => {
            const patient = patients.find(p => p.id === prediction.patient_id);
            const Icon = getPredictionIcon(prediction.prediction_type);

            return (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-xl transition-all">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-pink-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-1">{patient?.full_name || 'Unknown'}</CardTitle>
                        <p className="text-sm text-gray-600 capitalize">
                          {prediction.prediction_type.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <Icon className={`w-8 h-8 ${
                        prediction.risk_level === 'critical' ? 'text-red-600' :
                        prediction.risk_level === 'high' ? 'text-orange-600' :
                        prediction.risk_level === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Risk Score */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">Risk Score</span>
                        <Badge className={`${getRiskColor(prediction.risk_level)} text-white`}>
                          {prediction.risk_level?.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={prediction.risk_score} className="flex-1" />
                        <span className="text-2xl font-bold text-gray-900">{prediction.risk_score}%</span>
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <div>
                      <span className="text-sm text-gray-600">Model Confidence: {prediction.confidence_score}%</span>
                    </div>

                    {/* Contributing Factors */}
                    {prediction.contributing_factors && prediction.contributing_factors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Contributing Factors</h4>
                        <ul className="space-y-1">
                          {prediction.contributing_factors.map((factor, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5"></span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {prediction.recommendations && prediction.recommendations.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {prediction.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-2 border-t">
                      Generated: {new Date(prediction.prediction_date || prediction.created_date).toLocaleString()}
                      {' • '}Model: {prediction.model_version}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {predictions.length === 0 && (
          <Card className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Predictions Yet</h3>
            <p className="text-gray-500">Generate your first predictive analysis</p>
          </Card>
        )}
      </div>
    </div>
  );
}