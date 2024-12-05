// routes/energyRoutes.js
const express = require('express');
const router = express.Router();
const {
  recordEnergyData,
  getEnergyData
} = require('../controllers/energyController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.post('/record', recordEnergyData);
router.get('/:deviceId', getEnergyData);

module.exports = router;