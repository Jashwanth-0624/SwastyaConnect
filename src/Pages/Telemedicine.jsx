import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Calendar, FileText, CheckCircle, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Telemedicine() {
  const [showNewSession, setShowNewSession] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_name: "",
    doctor_email: "",
    scheduled_time: "",
    duration_minutes: 30,
    chief_complaint: ""
  });
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['telemed-sessions'],
    queryFn: () => base44.entities.TelemedSession.list('-scheduled_time')
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.TelemedSession.create({
        ...data,
        doctor_email: user.email,
        session_status: 'scheduled',
        meeting_link: `https://meet.swasthyaconnect.in/${Date.now()}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['telemed-sessions']);
      setShowNewSession(false);
      setFormData({
        patient_id: "",
        doctor_name: "",
        doctor_email: "",
        scheduled_time: "",
        duration_minutes: 30,
        chief_complaint: ""
      });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.TelemedSession.update(id, { session_status: status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['telemed-sessions']);
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Telemedicine Integration</h1>
                <p className="text-gray-600">Remote care with unified health records</p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewSession(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {['scheduled', 'in_progress', 'completed', 'cancelled'].map((status) => {
            const count = sessions.filter(s => s.session_status === status).length;
            return (
              <Card key={status}>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600 capitalize mb-1">{status.replace('_', ' ')}</p>
                  <p className="text-3xl font-bold text-gray-900">{count}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* New Session Form */}
        {showNewSession && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-8 border-2 border-blue-300 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle>Schedule New Telemedicine Session</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Patient</Label>
                      <Select value={formData.patient_id} onValueChange={(v) => setFormData({...formData, patient_id: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Doctor Name</Label>
                      <Input
                        value={formData.doctor_name}
                        onChange={(e) => setFormData({...formData, doctor_name: e.target.value})}
                        placeholder="Dr. John Doe"
                      />
                    </div>

                    <div>
                      <Label>Scheduled Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={formData.scheduled_time}
                        onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Chief Complaint</Label>
                    <Textarea
                      value={formData.chief_complaint}
                      onChange={(e) => setFormData({...formData, chief_complaint: e.target.value})}
                      placeholder="Patient's main complaint or reason for consultation"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowNewSession(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => createSessionMutation.mutate(formData)}
                      disabled={!formData.patient_id || !formData.doctor_name || !formData.scheduled_time}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      Schedule Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.map((session, index) => {
            const patient = patients.find(p => p.id === session.patient_id);
            const isUpcoming = new Date(session.scheduled_time) > new Date();

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-2 hover:shadow-lg transition-all">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{patient?.full_name || 'Unknown Patient'}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Dr. {session.doctor_name} • {new Date(session.scheduled_time).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(session.session_status)} border`}>
                        {session.session_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Patient Info Card */}
                    {patient && (
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-600" />
                          Patient Information
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Age</p>
                            <p className="font-semibold">{new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Blood Group</p>
                            <p className="font-semibold">{patient.blood_group || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Allergies</p>
                            <p className="font-semibold">{patient.allergies?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Medications</p>
                            <p className="font-semibold">{patient.current_medications?.length || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Chief Complaint */}
                    {session.chief_complaint && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Chief Complaint</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{session.chief_complaint}</p>
                      </div>
                    )}

                    {/* Session Details */}
                    {session.diagnosis && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
                        <p className="text-gray-700">{session.diagnosis}</p>
                      </div>
                    )}

                    {session.notes && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Clinical Notes</h4>
                        <p className="text-gray-700 text-sm">{session.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {session.session_status === 'scheduled' && isUpcoming && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'in_progress' })}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Start Session
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(session.meeting_link, '_blank')}
                          >
                            Open Meeting Link
                          </Button>
                        </>
                      )}

                      {session.session_status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'completed' })}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete Session
                        </Button>
                      )}

                      {session.session_status === 'scheduled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatusMutation.mutate({ id: session.id, status: 'cancelled' })}
                          className="border-red-500 text-red-700 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Duration: {session.duration_minutes} minutes
                      {session.meeting_link && <span>• Meeting ID: {session.meeting_link.split('/').pop()}</span>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {sessions.length === 0 && (
            <Card className="p-12 text-center">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Sessions Scheduled</h3>
              <p className="text-gray-500">Schedule your first telemedicine consultation</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}