const Trip = require("../../models/Trip.model");

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Trip.deleteOne({ _id: id, user: req.user.id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    return res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    return res.status(500).json({ message: "Failed to delete trip" });
  }
};

module.exports = deleteTrip;
