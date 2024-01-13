const Rickshawpuller = require('../models/rickshawpuller.model');



const rickshawpullerData=async (req, res) => {
    try {
      const { nid } = req.query;
  
      // Find the rickshaw puller based on NID
      const rickshawpuller = await Rickshawpuller.findOne({ nid });
  
      if (!rickshawpuller) {
        return res.status(404).json({ message: 'Rickshaw puller not found' });
      }
  
      // Return the rickshaw puller data
      return res.status(200).json(rickshawpuller);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  module.exports=rickshawpullerData;