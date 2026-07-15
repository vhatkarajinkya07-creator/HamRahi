const User = require('../../models/user.model');

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use by another account" });
      }
    }

    user.name = name;
    user.email = email.toLowerCase();
    await user.save();

    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      provider: user.provider
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: responseUser
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateProfile;
