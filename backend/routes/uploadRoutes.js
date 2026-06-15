const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary with your secret keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Multer to hold the file in memory temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 3. The POST route that handles the upload
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // 4. Stream the file directly to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'portfolio_projects' }, // This creates a neat folder in your Cloudinary dashboard
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ message: 'Upload failed', error });
        }
        // 5. Success! Send the permanent URL back to the frontend
        res.status(200).json({ url: result.secure_url });
      }
    );

    // Finalize the stream
    stream.end(req.file.buffer);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;