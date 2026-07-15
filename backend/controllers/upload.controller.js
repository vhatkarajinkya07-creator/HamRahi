const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // multer-storage-cloudinary puts the secure URL on req.file.path
    return res.status(200).json({
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
};

module.exports = uploadPhoto;
