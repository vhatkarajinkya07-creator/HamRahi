const { generateItinerary } = require("../../services/itinerary.service");

const generate = async (req, res) => {
    try {

        const {
            placeId,
            days,
            budget,
            travelStyle,
            interests
        } = req.body;

        if (
            !placeId ||
            !Number.isInteger(days) ||
            days < 1 ||
            !budget ||
            !travelStyle ||
            !Array.isArray(interests) ||
            interests.length === 0
        ) {
            return res.status(400).json({
                message: "Invalid request body"
            });
        }

        const itinerary = await generateItinerary({
            placeId,
            days,
            budget,
            travelStyle,
            interests
        });

        return res.status(200).json(itinerary);

    } catch (err) {

        console.log(err.message);

        return res.status(500).json({
            message: "Failed to generate itinerary"
        });

    }
};

module.exports = generate;