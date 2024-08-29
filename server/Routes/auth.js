const express = require("express");
const router = express.Router();
const authController = require("../Controllers/AuthController");
const multer = require("multer");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage configuration
const storage = multer.memoryStorage(); // Use memoryStorage to directly upload to Cloudinary

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(file.mimetype);
        const mimetype = fileTypes.test(file.originalname.split('.').pop().toLowerCase());

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            return cb(new Error('Invalid file type.'));
        }
    }
});

// Signup route
router.post("/signup", upload.single("profileImage"), async (req, res) => {
    try {
        // Check if the file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'Image upload failed: No file provided.' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Image upload failed: ' + error.message });
            }

            // Call your signup controller method with the uploaded image URL
            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.userEmail,
                mobile: req.body.userMobile,
                username: req.body.userName,
                password: req.body.userPassword, // Remember to hash the password in your controller
                bio: req.body.userBio,
                profileImage: result.secure_url, // URL of the uploaded image
            };

            // Use your controller method to save the user to the database
            await authController.signup(user); // Ensure your signup controller can handle this user object

            return res.status(201).json({ message: 'User registered successfully.' });
        }).end(req.file.buffer); // Pass the file buffer to Cloudinary
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ error: 'Failed to register user: ' + error.message });
    }
});

// Login route
router.post("/login", authController.login);

module.exports = router;
