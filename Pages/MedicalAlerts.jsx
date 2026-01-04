import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bell, AlertTriangle, Activity, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MedicalAlerts() {
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery({
    queryKey: ['medical-alerts', filter],
    queryFn: async () => {
      if (filter === "all") {
        return base44.entities.MedicalAlert.list('-created_date');
      }
      return base44.entities.MedicalAlert.filter({ status: filter }, '-created_date');
    }
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list()
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (alertId) => {
      const user = await base44.auth.me();
      return base44.entities.MedicalAlert.update(alertId, {
        status: 'acknowledged',
        acknowledged_by: user.email,
        acknowledged_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['medical-alerts']);
    }
  });

  const resolveMutation = useMutation({
    mutationFn: (alertId) => base44.entities.MedicalAlert.update(alertId, { status: 'resolved' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['medical-alerts']);
    }
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'emergency_admission': return AlertTriangle;
      case 'abnormal_vitals': return Activity;
      default: return Bell;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real-Time Medical Event Alerts</h1>
              <p className="text-gray-600">Instant notifications for critical patient events</p>
            </div>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {['all', 'active', 'acknowledged', 'resolved'].map((status) => {
            const count = status === 'all' 
              ? alerts.length 
              : alerts.filter(a => a.status === status).length;
            
            return (
              <Card
                key={status}
                className={`cursor-pointer transition-all ${
                  filter === status ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setFilter(status)}
              >
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 capitalize mb-1">{status}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          <AnimatePresence>
            {alerts.map((alert, index) => {
              const patient = patients.find(p => p.id === alert.patient_id);
              const AlertIcon = getAlertIcon(alert.alert_type);

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-2 ${
                    alert.severity === 'critical' ? 'border-red-400 bg-red-50' :
                    alert.status === 'active' ? 'border-orange-300' : 'border-gray-200'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'high' ? 'bg-orange-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>
                          <AlertIcon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{alert.title}</h3>
                              <p className="text-sm text-gray-600">
                                Patient: {patient?.full_name || 'Unknown'} • {new Date(alert.created_date).toLocaleString()}
                              </p>
                            </div>
                            <Badge className={`${getSeverityColor(alert.severity)} border px-3 py-1`}>
                              {alert.severity?.toUpperCase()}
                            </Badge>
                          </div>

                          <p className="text-gray-700 mb-4">{alert.message}</p>

                          {alert.vital_type && (
                            <div className="bg-white p-3 rounded-lg border mb-4">
                              <p className="text-sm">
                                <span className="font-semibold">{alert.vital_type}:</span> {alert.value}
                                {alert.normal_range && (
                                  <span className="text-gray-500 ml-2">(Normal: {alert.normal_range})</span>
                                )}
                              </p>
                            </div>
                          )}

                          {alert.status === 'acknowledged' && (
                            <div className="text-sm text-gray-600 mb-4">
                              Acknowledged by {alert.acknowledged_by} at {new Date(alert.acknowledged_at).toLocaleString()}
                            </div>
                          )}

                          <div className="flex gap-2">
                            {alert.status === 'active' && (
                              <Button
                                size="sm"
                                onClick={() => acknowledgeMutation.mutate(alert.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Acknowledge
                              </Button>
                            )}
                            {(alert.status === 'active' || alert.status === 'acknowledged') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => resolveMutation.mutate(alert.id)}
                                className="border-green-500 text-green-700 hover:bg-green-50"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {alerts.length === 0 && (
            <Card className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Alerts</h3>
              <p className="text-gray-500">No medical alerts for the selected filter</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}