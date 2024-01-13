const bcrypt = require('bcrypt');
const saltRounds = 10; // You can adjust the number of salt rounds based on your security needs

const Rickshawpuller = require('../models/rickshawpuller.model');

const rickshawpuller = async (req, res) => {
  try {
    // Extract data from the request body
    const { image, nidImage, name, nid, phone, password, location } = req.body;

    // Check if a user with the same nid already exists
    const existingUser = await Rickshawpuller.findOne({ nid });

    if (existingUser) {
      // User already exists, send a response
      return res.status(400).json({ error: 'User with the provided National ID already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [lat,lon]=location.coordinates;

    // Create a new instance of the Rickshawpuller model
    const newRickshawpuller = new Rickshawpuller({
      image,
      nidImage,
      name,
      nid,
      phone,
      password: hashedPassword, // Save the hashed password
      location: {
        type: 'Point',
        coordinates: [lon,lat],
      },
    });

    // Save the data to the database
    const savedRickshawpuller = await newRickshawpuller.save();

    res.status(201).json(savedRickshawpuller);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = rickshawpuller;
