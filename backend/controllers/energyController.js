const EnergyData = require('../models/EnergyData');
const Device = require('../models/Device');

exports.recordEnergyData = async (req, res) => {
  try {
    const { deviceId, tegangan, arus, daya, energi } = req.body;

    // Verify device exists
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device tidak ditemukan'
      });
    }

    // Create energy data
    const energyData = await EnergyData.create({
      deviceId,
      tegangan,
      arus,
      daya,
      energi
    });

    // Check power threshold and update relay status
    if (daya > device.batasPeringatan.kritis) {
      await Device.findOneAndUpdate(
        { deviceId },
        { 
          statusRelay: false,
          lastUpdate: new Date()
        }
      );
    }

    res.status(201).json({
      success: true,
      data: energyData,
      relayStatus: daya > device.batasPeringatan.kritis ? false : device.statusRelay
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error saat menyimpan data energi'
    });
  }
};

exports.getEnergyData = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { start, end, limit = 100 } = req.query;

    // Verify device exists
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device tidak ditemukan'
      });
    }

    // Build query
    const query = { deviceId };
    if (start && end) {
      query.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end)
      };
    }

    const energyData = await EnergyData.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      count: energyData.length,
      data: energyData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error saat mengambil data energi'
    });
  }
};