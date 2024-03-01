const Rickshawpuller = require('../models/rickshawpuller.model');

const updateRickshawpullerLocation = async (req, res) => {
  try {
    const { userNid, lat, lon } = req.body;
    console.log(req.body);

    // Find the rickshawpuller by nid
    const foundRickshawpuller = await Rickshawpuller.findOne({ nid: userNid });

    if (foundRickshawpuller) {
      // Update the location in the database
      await Rickshawpuller.findByIdAndUpdate(foundRickshawpuller._id, {
        $set: {
          "location.coordinates": [lon, lat],
        }
        // $push: {
        //   route: { type: "Point", coordinates: [lat, lon] } // Push an object with type and coordinates
        // }
      });

      console.log("Rickshawpuller location updated");
      res.status(200).json({ message: "Rickshawpuller location updated" });
    } else {
      console.log(`Rickshawpuller with nid ${userNid} not found`);
      res.status(404).json({ message: `Rickshawpuller with nid ${userNid} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = updateRickshawpullerLocation;
