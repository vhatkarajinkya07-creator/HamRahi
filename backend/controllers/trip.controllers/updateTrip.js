const Trip = require("../../models/Trip.model");

const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const trip = await Trip.findOne({ _id: id, user: req.user.id });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update fields allowed
    const allowedUpdates = [
      "name",
      "status",
      "startDate",
      "endDate",
      "budget",
      "travelStyle",
      "itinerarySummary",
      "diary"
    ];

    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        trip[field] = updateData[field];
      }
    });

    await trip.save();
    return res.status(200).json(trip);
  } catch (err) {
    console.error("Error updating trip:", err);
    return res.status(500).json({ message: "Failed to update trip" });
  }
};

module.exports = updateTrip;
