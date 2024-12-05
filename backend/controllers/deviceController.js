// controllers/deviceController.js
const Device = require('../models/Device');
const User = require('../models/User');

exports.registerDevice = async (req, res) => {
  try {
    const { deviceId, name, wifiSSID, wifiPassword, thresholds } = req.body;
    
    // Cek apakah device sudah ada
    const deviceExists = await Device.findOne({ deviceId });
    if (deviceExists) {
      return res.status(400).json({
        success: false,
        message: 'Device ID sudah terdaftar'
      });
    }

    // Buat device baru
    const device = await Device.create({
      deviceId,
      name,                    // menggunakan name bukan nama
      userId: req.user._id,
      wifiSSID,
      wifiPassword,
      relayState: false,      // menggunakan relayState bukan statusRelay
      status: 'disconnected',
      thresholds: {           // menggunakan thresholds bukan batasPeringatan
        warning: thresholds?.warning || 800,
        critical: thresholds?.critical || 1000
      }
    });

    // Tambahkan device ke user dengan referensi device._id
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { devices: device._id } }
    );

    res.status(201).json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getDevices = async (req, res) => {
  try {
    // Ambil device berdasarkan userId
    const devices = await Device.find({ userId: req.user._id });

    res.json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { nama, lokasi, wifiSSID, wifiPassword, batasPeringatan } = req.body;
    
    const device = await Device.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        nama,
        lokasi,
        wifiSSID,
        wifiPassword,
        batasPeringatan,
        status: 'configuring'
      },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device tidak ditemukan'
      });
    }

    // Hapus referensi device dari user
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { devices: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Device berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateDeviceStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { status, lastConnection } = req.body;

    const device = await Device.findOneAndUpdate(
      { deviceId },
      {
        status,
        lastConnection: lastConnection || new Date()
      },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};