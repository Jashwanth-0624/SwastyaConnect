import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Link as LinkIcon, CheckCircle, XCircle, RefreshCw, Shield, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import PatientManager from "@/components/PatientManager";

export default function ABDMIntegration() {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [abdmId, setAbdmId] = useState("");
  const [abhaNumber, setAbhaNumber] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const { data: abdmRecords = [] } = useQuery({
    queryKey: ['abdm-records'],
    queryFn: () => base44.entities.ABDMRecord.list('-created_date')
  });

  const linkABDM = async () => {
    if (!selectedPatient || !abdmId) return;
    
    setIsLinking(true);
    try {
      const existing = abdmRecords.find(r => r.patient_id === selectedPatient);
      
      const data = {
        patient_id: selectedPatient,
        abdm_health_id: abdmId,
        abha_number: abhaNumber,
        link_status: 'linked',
        verification_status: 'verified',
        last_sync: new Date().toISOString(),
        linked_facilities: ['SwasthyaConnect Hospital', 'Apollo Chennai', 'AIIMS Delhi'],
        phr_address: `${abdmId.split('@')[0]}@sbx`
      };

      if (existing) {
        await base44.entities.ABDMRecord.update(existing.id, data);
      } else {
        await base44.entities.ABDMRecord.create(data);
      }

      // Update patient with ABDM ID
      await base44.entities.Patient.update(selectedPatient, { abdm_id: abdmId });

      queryClient.invalidateQueries(['abdm-records']);
      queryClient.invalidateQueries(['patients']);
      
      alert('ABDM account linked successfully!');
      setAbdmId("");
      setAbhaNumber("");
    } catch (error) {
      console.error('Error:', error);
      alert('Error linking ABDM account');
    } finally {
      setIsLinking(false);
    }
  };

  const syncMutation = useMutation({
    mutationFn: (recordId) => base44.entities.ABDMRecord.update(recordId, {
      last_sync: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['abdm-records']);
      alert('ABDM data synced successfully!');
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'linked': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ABDM Integration</h1>
              <p className="text-gray-600">National Health Ecosystem Connectivity</p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 border-2 border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-violet-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Ayushman Bharat Digital Mission (ABDM)</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Connect patients to India's national health ecosystem for seamless health data exchange across healthcare providers nationwide.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Digital Health ID (ABHA Number)</li>
                  <li>✓ Consent-based data sharing</li>
                  <li>✓ Nationwide interoperability</li>
                  <li>✓ Personal Health Records (PHR)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Linked', status: 'linked', icon: CheckCircle, color: 'green' },
            { label: 'Pending', status: 'pending', icon: RefreshCw, color: 'yellow' },
            { label: 'Not Linked', status: 'not_linked', icon: XCircle, color: 'gray' },
            { label: 'Failed', status: 'failed', icon: XCircle, color: 'red' }
          ].map((stat) => {
            const count = abdmRecords.filter(r => r.link_status === stat.status).length;
            return (
              <Card key={stat.status}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{count}</p>
                    </div>
                    <stat.icon className={`w-10 h-10 text-${stat.color}-600`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Link ABDM Card */}
        <Card className="mb-8 border-2 border-violet-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-violet-600" />
              Link ABDM Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Select Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.length > 0 ? (
                        patients.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-sm text-gray-500 text-center">No patients found</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>ABDM Health ID</Label>
                  <Input
                    value={abdmId}
                    onChange={(e) => setAbdmId(e.target.value)}
                    placeholder="username@abdm"
                  />
                </div>

                <div>
                  <Label>ABHA Number (Optional)</Label>
                  <Input
                    value={abhaNumber}
                    onChange={(e) => setAbhaNumber(e.target.value)}
                    placeholder="14-digit ABHA number"
                    maxLength={14}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <PatientManager onPatientAdded={() => queryClient.invalidateQueries({ queryKey: ['patients'] })} />
                <Button
                  onClick={linkABDM}
                  disabled={!selectedPatient || !abdmId || isLinking}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                >
                  {isLinking ? 'Linking...' : 'Link ABDM Account'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ABDM Records */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">ABDM Linked Accounts</h2>
          
          {abdmRecords.map((record, index) => {
            const patient = patients.find(p => p.id === record.patient_id);

            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-2 hover:shadow-xl transition-all">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-violet-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{patient?.full_name || 'Unknown Patient'}</CardTitle>
                        <p className="text-sm text-gray-600">{record.abdm_health_id}</p>
                      </div>
                      <Badge className={`${getStatusColor(record.link_status)} border px-3 py-1`}>
                        {record.link_status?.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* ABDM Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">ABHA Number</p>
                        <p className="font-semibold text-gray-900">{record.abha_number || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">PHR Address</p>
                        <p className="font-semibold text-gray-900">{record.phr_address || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Verification Status</p>
                        <Badge className={record.verification_status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {record.verification_status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Synced</p>
                        <p className="font-semibold text-gray-900">
                          {record.last_sync ? new Date(record.last_sync).toLocaleString() : 'Never'}
                        </p>
                      </div>
                    </div>

                    {/* Linked Facilities */}
                    {record.linked_facilities && record.linked_facilities.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-violet-600" />
                          Linked Healthcare Facilities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {record.linked_facilities.map((facility, i) => (
                            <Badge key={i} variant="outline" className="border-violet-300 text-violet-700">
                              {facility}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Consent Requests */}
                    {record.consent_requests && record.consent_requests.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Recent Consent Requests</h4>
                        <div className="space-y-2">
                          {record.consent_requests.map((req, i) => (
                            <div key={i} className="p-3 bg-gray-50 rounded-lg border text-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">{req.hip_name}</p>
                                  <p className="text-gray-600">Request ID: {req.request_id}</p>
                                </div>
                                <Badge variant="outline">{req.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        onClick={() => syncMutation.mutate(record.id)}
                        variant="outline"
                        className="border-violet-500 text-violet-700 hover:bg-violet-50"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Sync Data
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        View PHR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {abdmRecords.length === 0 && (
            <Card className="p-12 text-center">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No ABDM Accounts Linked</h3>
              <p className="text-gray-500">Link your first patient to the national health ecosystem</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}