// routes/deviceRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  updateDeviceStatus
} = require('../controllers/deviceController');

// Device routes
router.post('/register', protect, registerDevice);
router.get('/', protect, getDevices);
router.get('/:id', protect, getDeviceById);
router.put('/:id', protect, updateDevice);
router.delete('/:id', protect, deleteDevice);
router.put('/:deviceId/status', updateDeviceStatus);

module.exports = router;