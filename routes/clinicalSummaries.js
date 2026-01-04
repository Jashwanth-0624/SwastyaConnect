import express from 'express';
import ClinicalSummary from '../models/ClinicalSummary.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sort = req.query.sort || '-createdAt';
    const summaries = await ClinicalSummary.find().sort(sort);
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const summary = await ClinicalSummary.findById(req.params.id);
    if (!summary) return res.status(404).json({ error: 'Summary not found' });
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const summary = new ClinicalSummary(req.body);
    await summary.save();
    res.status(201).json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const summary = await ClinicalSummary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!summary) return res.status(404).json({ error: 'Summary not found' });
    res.json(summary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await ClinicalSummary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Summary deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

