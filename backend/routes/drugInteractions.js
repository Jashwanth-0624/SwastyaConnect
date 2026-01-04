import express from 'express';
import DrugInteraction from '../models/DrugInteraction.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const interactions = await DrugInteraction.find().sort('-createdAt');
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const interaction = await DrugInteraction.findById(req.params.id);
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    res.json(interaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const interaction = new DrugInteraction(req.body);
    await interaction.save();
    res.status(201).json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const interaction = await DrugInteraction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    res.json(interaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await DrugInteraction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Interaction deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

