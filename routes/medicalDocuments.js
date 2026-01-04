import express from 'express';
import multer from 'multer';
import MedicalDocument from '../models/MedicalDocument.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const sort = req.query.sort || '-createdAt';
    const documents = await MedicalDocument.find().sort(sort);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const document = await MedicalDocument.findById(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.file_url;
    
    const document = new MedicalDocument({
      ...req.body,
      file_url: fileUrl,
      extraction_status: 'pending'
    });
    
    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const document = await MedicalDocument.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await MedicalDocument.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

