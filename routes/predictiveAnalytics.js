import express from 'express';
import PredictiveAnalytic from '../models/PredictiveAnalytic.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sort = req.query.sort || '-createdAt';
    const analytics = await PredictiveAnalytic.find().sort(sort);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const analytic = await PredictiveAnalytic.findById(req.params.id);
    if (!analytic) return res.status(404).json({ error: 'Analytic not found' });
    res.json(analytic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const analytic = new PredictiveAnalytic(req.body);
    await analytic.save();
    res.status(201).json(analytic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const analytic = await PredictiveAnalytic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!analytic) return res.status(404).json({ error: 'Analytic not found' });
    res.json(analytic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await PredictiveAnalytic.findByIdAndDelete(req.params.id);
    res.json({ message: 'Analytic deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

