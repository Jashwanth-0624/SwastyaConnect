import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Shield, Check, X, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsentCalendar() {
  const queryClient = useQueryClient();

  const { data: consents = [] } = useQuery({
    queryKey: ['consent-records'],
    queryFn: () => base44.entities.ConsentRecord.list('-created_date')
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const approveMutation = useMutation({
    mutationFn: async (consentId) => {
      const user = await base44.auth.me();
      return base44.entities.ConsentRecord.update(consentId, {
        consent_status: 'approved',
        approved_by: user.email,
        approved_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['consent-records']);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (consentId) => base44.entities.ConsentRecord.update(consentId, { consent_status: 'rejected' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['consent-records']);
    }
  });

  const revokeMutation = useMutation({
    mutationFn: (consentId) => base44.entities.ConsentRecord.update(consentId, { consent_status: 'revoked' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['consent-records']);
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'revoked': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'expired': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Consent Calendar</h1>
              <p className="text-gray-600">Time-based patient data access control</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Pending', status: 'pending', color: 'blue' },
            { label: 'Approved', status: 'approved', color: 'green' },
            { label: 'Rejected', status: 'rejected', color: 'red' },
            { label: 'Expired', status: 'expired', color: 'orange' }
          ].map((stat) => {
            const count = consents.filter(c => c.consent_status === stat.status).length;
            return (
              <Card key={stat.status}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{count}</p>
                    </div>
                    <Shield className={`w-10 h-10 text-${stat.color}-600`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Consent Requests */}
        <div className="space-y-6">
          {consents.map((consent, index) => {
            const patient = patients.find(p => p.id === consent.patient_id);
            const isExpired = consent.valid_until && new Date(consent.valid_until) < new Date();

            return (
              <motion.div
                key={consent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-xl transition-all">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-cyan-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {patient?.full_name || 'Unknown Patient'}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Requested by: {consent.requester_name} ({consent.requester_email})
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(consent.consent_status)} border px-3 py-1`}>
                        {isExpired ? 'EXPIRED' : consent.consent_status?.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Purpose</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{consent.purpose}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Data Types Requested</h4>
                      <div className="flex flex-wrap gap-2">
                        {consent.data_types?.map((type, i) => (
                          <Badge key={i} variant="outline" className="border-cyan-300 text-cyan-700">
                            {type.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {consent.valid_from && consent.valid_until && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span>
                          Valid from {new Date(consent.valid_from).toLocaleDateString()} 
                          {' to '} 
                          {new Date(consent.valid_until).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {consent.conditions && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Conditions</h4>
                        <p className="text-gray-700 text-sm">{consent.conditions}</p>
                      </div>
                    )}

                    {consent.consent_status === 'pending' && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => approveMutation.mutate(consent.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => rejectMutation.mutate(consent.id)}
                          variant="outline"
                          className="flex-1 border-red-500 text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {consent.consent_status === 'approved' && !isExpired && (
                      <Button
                        onClick={() => revokeMutation.mutate(consent.id)}
                        variant="outline"
                        className="w-full border-orange-500 text-orange-700 hover:bg-orange-50"
                      >
                        Revoke Access
                      </Button>
                    )}

                    {consent.approved_by && (
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Approved by {consent.approved_by} on {new Date(consent.approved_at).toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {consents.length === 0 && (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Consent Requests</h3>
              <p className="text-gray-500">There are no consent requests at this time</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}