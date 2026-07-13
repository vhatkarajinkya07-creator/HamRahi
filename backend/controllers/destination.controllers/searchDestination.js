const { searchDestination } = require("../../services/destination.service");

const searchDestinations = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== "string" || !q.trim()) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        if (q.trim().length < 2) {
            return res.status(400).json({
                message: "Search query must be at least 2 characters long"
            });
        }

        const destinations = await searchDestination(q.trim());

        return res.status(200).json(destinations);

    } catch (err) {
        if (err.statusCode === 429) {
            return res.status(429).json({
                message: err.message
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = searchDestinations;
