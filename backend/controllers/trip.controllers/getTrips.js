const Trip = require("../../models/Trip.model");

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(trips);
  } catch (err) {
    console.error("Error fetching trips:", err);
    return res.status(500).json({ message: "Failed to fetch trips" });
  }
};

module.exports = getTrips;
