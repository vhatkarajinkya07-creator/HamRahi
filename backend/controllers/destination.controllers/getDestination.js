const { getDestinationDetails } = require("../../services/destination.service");

const getDestination = async (req, res) => {
    try {
        const { placeId } = req.params;

        if (!placeId || typeof placeId !== "string") {
            return res.status(400).json({
                message: "Valid Place ID is required"
            });
        }

        const destination = await getDestinationDetails(placeId);

        return res.status(200).json(destination);

    } catch (err) {
        console.error(err);

        if (err.message === "Invalid Place ID") {
            return res.status(400).json({
                message: err.message
            });
        }

        if (err.message === "Destination not found") {
            return res.status(404).json({
                message: err.message
            });
        }

        return res.status(500).json({
            message: err.message || "Server error"
        });
    }
};

module.exports = getDestination;