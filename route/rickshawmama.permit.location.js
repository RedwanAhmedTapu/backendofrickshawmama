const Rickshawpuller = require('../models/rickshawpuller.model');

const permissitionOfLocationSharing = async (req, res,permissionType) => {
    const { nid } = req.params;
    console.log(nid)
    
    try {
        // Update the ispermitted field of the rickshaw puller based on permissionType
        let ispermitted;
        if (permissionType === "permit") {
            ispermitted = true;
        } else if (permissionType === "deny") {
            ispermitted = false;
        } else {
            return res.status(400).json({ error: "Invalid permission type" });
        }
        
        // Update the ispermitted field in the database
        const updatedPuller = await Rickshawpuller.findOneAndUpdate(
            { nid }, // Find the rickshaw puller by nid
            { $set: { ispermitted } }, // Update the ispermitted field
            { new: true } // Return the updated document
        );
        
        if (!updatedPuller) {
            return res.status(404).json({ error: "Rickshaw puller not found" });
        }
        
        // Send success response with the updated puller
        res.json({ message: `Rickshaw puller is ${ispermitted ? 'permitted' : 'denied'} now`, updatedPuller });
    } catch (error) {
        console.error("Error updating ispermitted field:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = permissitionOfLocationSharing;
