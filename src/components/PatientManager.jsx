import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientManager({ onPatientAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    phone: '',
    email: '',
    address: '',
    emergency_contact: '',
    allergies: '',
    chronic_conditions: '',
    past_surgeries: ''
  });
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '' }]);
  const queryClient = useQueryClient();

  const createPatientMutation = useMutation({
    mutationFn: async (data) => {
      // Process medications
      const processedMedications = medications
        .filter(m => m.name.trim() !== '')
        .map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency
        }));

      // Process arrays
      const patientData = {
        ...data,
        date_of_birth: new Date(data.date_of_birth),
        allergies: data.allergies ? data.allergies.split(',').map(a => a.trim()).filter(a => a) : [],
        chronic_conditions: data.chronic_conditions ? data.chronic_conditions.split(',').map(c => c.trim()).filter(c => c) : [],
        past_surgeries: data.past_surgeries ? data.past_surgeries.split(',').map(s => s.trim()).filter(s => s) : [],
        current_medications: processedMedications
      };

      return base44.entities.Patient.create(patientData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsOpen(false);
      resetForm();
      if (onPatientAdded) onPatientAdded();
      // Show success message
      alert('Patient added successfully!');
    },
    onError: (error) => {
      console.error('Error adding patient:', error);
      alert('Error adding patient. Please try again.');
    }
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      date_of_birth: '',
      gender: '',
      blood_group: '',
      phone: '',
      email: '',
      address: '',
      emergency_contact: '',
      allergies: '',
      chronic_conditions: '',
      past_surgeries: ''
    });
    setMedications([{ name: '', dosage: '', frequency: '' }]);
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPatientMutation.mutate(formData);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Add Patient
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-teal-50 to-cyan-50 p-6 border-b rounded-t-2xl z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
                      <p className="text-gray-600 text-sm mt-1">Enter patient information</p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name" className="text-gray-900">Full Name *</Label>
                      <Input
                        id="full_name"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="John Doe"
                        className="text-gray-900"
                      />
                    </div>

                    <div>
                      <Label htmlFor="date_of_birth" className="text-gray-900">Date of Birth *</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        required
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="text-gray-900"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender" className="text-gray-900">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                        <SelectTrigger className="text-gray-900">
                          {formData.gender || 'Select gender'}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="blood_group" className="text-gray-900">Blood Group</Label>
                      <Select value={formData.blood_group} onValueChange={(value) => setFormData({ ...formData, blood_group: value })}>
                        <SelectTrigger className="text-gray-900">
                          {formData.blood_group || 'Select blood group'}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-900">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="text-gray-900"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-900">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="patient@email.com"
                        className="text-gray-900"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-gray-900">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Street, City, State"
                        className="text-gray-900"
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergency_contact" className="text-gray-900">Emergency Contact</Label>
                      <Input
                        id="emergency_contact"
                        type="tel"
                        value={formData.emergency_contact}
                        onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                        placeholder="+91 98765 43211"
                        className="text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="allergies" className="text-gray-900">Allergies (comma-separated)</Label>
                      <Input
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        placeholder="Penicillin, Dust, Latex"
                        className="text-gray-900"
                      />
                    </div>

                    <div>
                      <Label htmlFor="chronic_conditions" className="text-gray-900">Chronic Conditions (comma-separated)</Label>
                      <Input
                        id="chronic_conditions"
                        value={formData.chronic_conditions}
                        onChange={(e) => setFormData({ ...formData, chronic_conditions: e.target.value })}
                        placeholder="Hypertension, Diabetes"
                        className="text-gray-900"
                      />
                    </div>

                    <div>
                      <Label htmlFor="past_surgeries" className="text-gray-900">Past Surgeries (comma-separated)</Label>
                      <Input
                        id="past_surgeries"
                        value={formData.past_surgeries}
                        onChange={(e) => setFormData({ ...formData, past_surgeries: e.target.value })}
                        placeholder="Appendectomy (2010), Knee Surgery (2021)"
                        className="text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-gray-900">Current Medications</Label>
                      <Button type="button" size="sm" variant="outline" onClick={addMedication}>
                        + Add Medication
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {medications.map((med, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-4">
                            <Input
                              placeholder="Medication name"
                              value={med.name}
                              onChange={(e) => updateMedication(index, 'name', e.target.value)}
                              className="text-gray-900"
                            />
                          </div>
                          <div className="col-span-3">
                            <Input
                              placeholder="Dosage"
                              value={med.dosage}
                              onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                              className="text-gray-900"
                            />
                          </div>
                          <div className="col-span-4">
                            <Input
                              placeholder="Frequency"
                              value={med.frequency}
                              onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                              className="text-gray-900"
                            />
                          </div>
                          <div className="col-span-1">
                            {medications.length > 1 && (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => removeMedication(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                      disabled={createPatientMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createPatientMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                    >
                      {createPatientMutation.isPending ? 'Adding...' : 'Add Patient'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

