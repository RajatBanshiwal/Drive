const express = require('express');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file.models');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
}); 

// Multer storage configuration
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const uploads = multer({ storage: storage });



// Route to render files on the homepage
router.get('/home', authMiddleware, async (req, res) => {
  try {
    // Fetching files from the database for the authenticated user
    const userFiles = await File.find({
       user: req.user.userId,
       });

    // Only one response is sent here after fetching the files
    res.render('home', { files: userFiles });
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// Route for uploading files
router.post("/upload", authMiddleware, uploads.single("file"), async (req, res) => {
  try {
    // Uploading the file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "drive",
    });

    // Saving the file metadata to MongoDB
    const savedFile = new File({
      filename: req.file.originalname,
      public_id: cloudinaryResponse.public_id,
      originalname: req.file.originalname,
      imgUrl: cloudinaryResponse.secure_url,
      user: req.user.userId,
    });

    // Save to DB 
    await savedFile.save();

    // After saving to DB, render the page with the uploaded file's URL
    res.render("home", { files: [savedFile] });
    
    console.log("Cloudinary Response:", cloudinaryResponse);
    console.log("File saved to DB:", savedFile);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
  }
});

module.exports = router;
