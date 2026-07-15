const Trip = require("../../models/Trip.model");
const Destination = require("../../models/Destination.model");

const createTrip = async (req, res) => {
  try {
    const {
      placeId,
      name,
      startDate,
      endDate,
      daysCount,
      budget,
      travelStyle,
      itinerarySummary,
      packingEssentials,
      localTips,
      days,
      status
    } = req.body;

    if (!placeId || !name || !startDate || !endDate) {
      return res.status(400).json({ message: "placeId, name, startDate, and endDate are required" });
    }

    // Try to fetch destination info from DB to populate image & country if not provided
    let heroImage = "";
    let country = "";
    let destination = "";
    try {
      const dest = await Destination.findOne({ placeId });
      if (dest) {
        heroImage = dest.heroImage?.imageUrl || "";
        country = dest.location?.country || "";
        destination = dest.title || "";
      }
    } catch (err) {
      console.warn("Could not find destination details to pre-populate trip details:", err);
    }

    const trip = new Trip({
      user: req.user.id,
      placeId,
      name,
      destination: destination || name,
      country,
      heroImage: heroImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      status: status || "upcoming",
      startDate,
      endDate,
      daysCount: daysCount || 1,
      budget: budget || "Medium",
      travelStyle: travelStyle || "Friends",
      itinerarySummary: itinerarySummary || "",
      packingEssentials: packingEssentials || [],
      localTips: localTips || [],
      days: days || [],
      diary: []
    });

    await trip.save();
    return res.status(201).json(trip);
  } catch (err) {
    console.error("Error creating trip:", err);
    return res.status(500).json({ message: "Failed to create trip" });
  }
};

module.exports = createTrip;
