import express from 'express';
import EmergencyHealthData from '../models/EmergencyHealthData.js';
import QRCode from 'qrcode';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await EmergencyHealthData.find().sort('-createdAt');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await EmergencyHealthData.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Data not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const healthData = new EmergencyHealthData(req.body);
    
    // Generate QR code data
    const qrData = JSON.stringify({
      patient_id: healthData.patient_id,
      blood_group: healthData.blood_group,
      allergies: healthData.allergies,
      emergency_contact: healthData.emergency_contact
    });
    
    healthData.qr_code_data = qrData;
    
    // Generate QR code image
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    healthData.qr_code_url = qrCodeUrl;
    
    await healthData.save();
    res.status(201).json(healthData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await EmergencyHealthData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!data) return res.status(404).json({ error: 'Data not found' });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await EmergencyHealthData.findByIdAndDelete(req.params.id);
    res.json({ message: 'Data deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

