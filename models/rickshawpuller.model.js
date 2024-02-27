const mongoose = require("mongoose");

// Define the schema for the data model
const rickshawpullerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  nidImage: { type: String, required: true },
  name: { type: String, required: true },
  nid: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  password: { type: String, required: true, unique: true },
  route: {
    type: [
      {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number],
          default: [], // Provide a default value
        },
      },
    ],
    default: [],
  },
});

// Indexing for GeoSpatial Queries
rickshawpullerSchema.index({ location: "2dsphere" });

// Create the model from the schema
const Rickshawpuller = mongoose.model("Rickshawpuller", rickshawpullerSchema);

// Export the model for use in other parts of your application
module.exports = Rickshawpuller;
