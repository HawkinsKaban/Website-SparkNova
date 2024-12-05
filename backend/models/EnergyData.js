// models/EnergyData.js
const mongoose = require('mongoose');

const energyDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    ref: 'Device'
  },
  tegangan: {
    type: Number,
    required: true
  },
  arus: {
    type: Number,
    required: true
  },
  daya: {
    type: Number,
    required: true
  },
  energi: {
    type: Number,
    required: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('EnergyData', energyDataSchema);
