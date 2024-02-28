const Rickshawpuller = require('../models/rickshawpuller.model');

const deleteRoute = async (req, res) => {
    const { nid } = req.params;

    try {
        // Find the rickshaw puller by ID
    const rickshawPuller = await Rickshawpuller.findOne({nid});

        if (!rickshawPuller) {
            return res.status(404).json({ message: "Rickshaw puller not found" });
        }

        // Clear the route data
        rickshawPuller.route = [];

        // Save the updated rickshaw puller
        await rickshawPuller.save();

        res.status(200).json({ message: "Route deleted successfully" });
    } catch (error) {
        console.error("Error deleting route:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = deleteRoute;
