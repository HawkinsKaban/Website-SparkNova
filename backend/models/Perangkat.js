// models/Perangkat.js
const mongoose = require('mongoose');

const perangkatSchema = new mongoose.Schema({
  idPengguna: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pengguna',
    required: true
  },
  idPerangkat: {
    type: String,
    required: true,
    unique: true
  },
  nama: {
    type: String,
    required: [true, 'Nama perangkat wajib diisi']
  },
  lokasi: String,
  statusRelay: {
    type: Boolean,
    default: false
  },
  statusKoneksi: {
    type: String,
    enum: ['terhubung', 'terputus', 'konfigurasi'],
    default: 'terputus'
  },
  waktuAktifTerakhir: Date
}, { 
  timestamps: true,
  indexes: [{ idPengguna: 1, idPerangkat: 1 }]
});

module.exports = mongoose.model('Perangkat', perangkatSchema);