import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Fingerprint, Users, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PatientMatching() {
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const findDuplicates = () => {
    const groups = [];
    const processed = new Set();

    patients.forEach((patient, i) => {
      if (processed.has(patient.id)) return;
      
      const duplicates = [patient];
      
      patients.forEach((other, j) => {
        if (i !== j && !processed.has(other.id)) {
          const nameMatch = patient.full_name?.toLowerCase() === other.full_name?.toLowerCase();
          const dobMatch = patient.date_of_birth === other.date_of_birth;
          const phoneMatch = patient.phone === other.phone;
          
          if ((nameMatch && dobMatch) || (nameMatch && phoneMatch) || (dobMatch && phoneMatch && phoneMatch)) {
            duplicates.push(other);
            processed.add(other.id);
          }
        }
      });

      if (duplicates.length > 1) {
        groups.push(duplicates);
        duplicates.forEach(d => processed.add(d.id));
      }
    });

    return groups;
  };

  const duplicateGroups = findDuplicates();

  const togglePatient = (patientId) => {
    setSelectedPatients(prev =>
      prev.includes(patientId)
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const mergePatients = async () => {
    if (selectedPatients.length < 2) {
      alert('Please select at least 2 patients to merge');
      return;
    }

    setIsMerging(true);
    try {
      const patientsToMerge = patients.filter(p => selectedPatients.includes(p.id));
      
      // Create unified patient ID
      const unifiedId = `UPI-${Date.now()}`;
      
      // Merge data intelligently
      const mergedData = {
        unified_patient_id: unifiedId,
        full_name: patientsToMerge[0].full_name,
        date_of_birth: patientsToMerge[0].date_of_birth,
        blood_group: patientsToMerge.find(p => p.blood_group)?.blood_group || null,
        phone: patientsToMerge.find(p => p.phone)?.phone || null,
        email: patientsToMerge.find(p => p.email)?.email || null,
        address: patientsToMerge.find(p => p.address)?.address || null,
        emergency_contact: patientsToMerge.find(p => p.emergency_contact)?.emergency_contact || null,
        allergies: [...new Set(patientsToMerge.flatMap(p => p.allergies || []))],
        chronic_conditions: [...new Set(patientsToMerge.flatMap(p => p.chronic_conditions || []))],
        current_medications: patientsToMerge.flatMap(p => p.current_medications || []),
        past_surgeries: [...new Set(patientsToMerge.flatMap(p => p.past_surgeries || []))]
      };

      // Update all selected patients with unified ID
      for (const patientId of selectedPatients) {
        await base44.entities.Patient.update(patientId, mergedData);
      }

      queryClient.invalidateQueries(['patients']);
      setSelectedPatients([]);
      alert(`Successfully merged ${selectedPatients.length} patient records under unified ID: ${unifiedId}`);
    } catch (error) {
      console.error('Error merging patients:', error);
      alert('Error merging patients. Please try again.');
    } finally {
      setIsMerging(false);
    }
  };

  const getSimilarityScore = (group) => {
    if (group.length < 2) return 0;
    
    const first = group[0];
    let matches = 0;
    let total = 0;

    group.forEach(patient => {
      if (patient.full_name === first.full_name) matches++;
      if (patient.date_of_birth === first.date_of_birth) matches++;
      if (patient.phone && patient.phone === first.phone) matches++;
      total += 3;
    });

    return Math.round((matches / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Fingerprint className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Patient Identity Matching</h1>
              <p className="text-gray-600">AI-powered duplicate detection and record merging (UPI++)</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
                </div>
                <Users className="w-10 h-10 text-teal-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Duplicate Groups</p>
                  <p className="text-3xl font-bold text-orange-600">{duplicateGroups.length}</p>
                </div>
                <Sparkles className="w-10 h-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected for Merge</p>
                  <p className="text-3xl font-bold text-blue-600">{selectedPatients.length}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Merge Action */}
        {selectedPatients.length >= 2 && (
          <Card className="mb-8 border-2 border-teal-300 bg-gradient-to-r from-teal-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Ready to Merge</h3>
                  <p className="text-sm text-gray-600">{selectedPatients.length} patients selected</p>
                </div>
                <Button
                  onClick={mergePatients}
                  disabled={isMerging}
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                >
                  {isMerging ? 'Merging...' : 'Merge Selected Records'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Duplicate Groups */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Potential Duplicates</h2>
          
          {duplicateGroups.map((group, groupIndex) => (
            <motion.div
              key={groupIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <Card className="border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                  <CardTitle className="flex items-center justify-between">
                    <span>Duplicate Group #{groupIndex + 1}</span>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                      {getSimilarityScore(group)}% Match
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {group.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedPatients.includes(patient.id)
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedPatients.includes(patient.id)}
                            onCheckedChange={() => togglePatient(patient.id)}
                            className="mt-1"
                          />
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Name</p>
                              <p className="font-semibold text-gray-900">{patient.full_name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">DOB</p>
                              <p className="font-semibold text-gray-900">{patient.date_of_birth}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-semibold text-gray-900">{patient.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Blood Group</p>
                              <p className="font-semibold text-gray-900">{patient.blood_group || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Patient ID</p>
                              <p className="font-mono text-sm text-gray-900">{patient.patient_id || 'N/A'}</p>
                            </div>
                            {patient.unified_patient_id && (
                              <div>
                                <p className="text-sm text-gray-600">Unified ID</p>
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                  {patient.unified_patient_id}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {duplicateGroups.length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Duplicates Found</h3>
              <p className="text-gray-500">All patient records appear to be unique</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}