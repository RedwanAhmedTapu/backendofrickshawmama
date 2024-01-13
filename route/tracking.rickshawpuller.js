

const Rickshawpuller=require("../models/rickshawpuller.model");

const rickshawpuller=async (req, res) => {
    try {
      const { lat, lon } = req.body;
  console.log(req.body)
      // Use MongoDB's geospatial query to find pullers within 1km radius
      const nearbyPullers = await Rickshawpuller.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lon, lat],
            },
            $maxDistance: 1000, // 1km in meters
          },
        },
      });
  
      return nearbyPullers;
      console.log(nearbyPullers)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // Socket.io connection for real-time updates
  

  module.exports=rickshawpuller