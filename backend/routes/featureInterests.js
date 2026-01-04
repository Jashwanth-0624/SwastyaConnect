import express from 'express';
import FeatureInterest from '../models/FeatureInterest.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const interests = await FeatureInterest.find().sort('-createdAt');
    res.json(interests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const interest = await FeatureInterest.findById(req.params.id);
    if (!interest) return res.status(404).json({ error: 'Interest not found' });
    res.json(interest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const interest = new FeatureInterest(req.body);
    await interest.save();
    res.status(201).json(interest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const interest = await FeatureInterest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!interest) return res.status(404).json({ error: 'Interest not found' });
    res.json(interest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await FeatureInterest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Interest deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

