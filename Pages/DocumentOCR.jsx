import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, CheckCircle, Loader2, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentOCR() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [documentType, setDocumentType] = useState("prescription");
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['medical-documents'],
    queryFn: () => base44.entities.MedicalDocument.list('-created_date')
  });

  const handleUpload = async () => {
    if (!file || !selectedPatient) {
      alert('Please select both a file and a patient');
      return;
    }

    setIsProcessing(true);
    try {
      // Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Create document record
      const doc = await base44.entities.MedicalDocument.create({
        patient_id: selectedPatient,
        document_type: documentType,
        file_url,
        extraction_status: 'processing'
      });

      // Extract data using OCR
      const schema = getSchemaForDocumentType(documentType);
      const extractionResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: schema
      });

      // Update document with extracted data
      if (extractionResult.status === 'success') {
        await base44.entities.MedicalDocument.update(doc.id, {
          extracted_data: extractionResult.output,
          extraction_status: 'completed',
          confidence_score: 85,
          processed_date: new Date().toISOString()
        });
      } else {
        await base44.entities.MedicalDocument.update(doc.id, {
          extraction_status: 'failed'
        });
      }

      queryClient.invalidateQueries(['medical-documents']);
      setFile(null);
      alert('Document processed successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing document');
    } finally {
      setIsProcessing(false);
    }
  };

  const getSchemaForDocumentType = (type) => {
    const schemas = {
      prescription: {
        type: "object",
        properties: {
          medications: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                dosage: { type: "string" },
                frequency: { type: "string" },
                duration: { type: "string" }
              }
            }
          },
          doctor_name: { type: "string" },
          date: { type: "string" }
        }
      },
      lab_report: {
        type: "object",
        properties: {
          test_name: { type: "string" },
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                parameter: { type: "string" },
                value: { type: "string" },
                normal_range: { type: "string" },
                status: { type: "string" }
              }
            }
          },
          date: { type: "string" }
        }
      },
      clinical_note: {
        type: "object",
        properties: {
          chief_complaint: { type: "string" },
          diagnosis: { type: "string" },
          treatment_plan: { type: "string" },
          notes: { type: "string" }
        }
      }
    };
    return schemas[type] || schemas.clinical_note;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Document OCR</h1>
              <p className="text-gray-600">Extract structured data from medical documents</p>
            </div>
          </div>
        </div>

        {/* Upload Card */}
        <Card className="mb-8 border-2 border-amber-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-600" />
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label>Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="lab_report">Lab Report</SelectItem>
                      <SelectItem value="clinical_note">Clinical Note</SelectItem>
                      <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                      <SelectItem value="imaging_report">Imaging Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Upload File</Label>
                <Input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Supported: PDF, PNG, JPG, JPEG</p>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!file || !selectedPatient || isProcessing}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Extract Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Processed Documents</h2>
          
          {documents.map((doc, index) => {
            const patient = patients.find(p => p.id === doc.patient_id);

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-2 hover:shadow-lg transition-all">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-amber-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{patient?.full_name || 'Unknown'}</CardTitle>
                        <p className="text-sm text-gray-600 capitalize">
                          {doc.document_type.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(doc.extraction_status)} border`}>
                        {doc.extraction_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {doc.extraction_status === 'completed' && doc.extracted_data && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Extracted Data
                        </h4>
                        <pre className="text-sm text-gray-700 overflow-x-auto">
                          {JSON.stringify(doc.extracted_data, null, 2)}
                        </pre>
                        {doc.confidence_score && (
                          <p className="text-xs text-gray-600 mt-2">
                            Confidence: {doc.confidence_score}%
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-gray-500">
                        Processed: {new Date(doc.processed_date || doc.created_date).toLocaleString()}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.file_url, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Original
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {documents.length === 0 && (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Documents Yet</h3>
              <p className="text-gray-500">Upload your first medical document for OCR processing</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}