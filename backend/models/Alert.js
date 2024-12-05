// models/Alert.js
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    ref: 'Device'
  },
  tipe: {
    type: String,
    enum: ['peringatan', 'kritis'],
    required: true
  },
  pesan: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['aktif', 'terselesaikan'],
    default: 'aktif'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema);