// const express = require("express");
// const dotenv = require("dotenv");
// const User = require("../Models/User");
// const bcrypt = require("bcrypt");
// const multer = require("multer");
// const cloudinary = require("cloudinary");

// dotenv.config();

// const router = express.Router();

// const storage = multer.memoryStorage();
// var upload = multer({
//     storage: storage
// });

// // //Signup Route


//   const signup = async (req, res) => {
//     try {
//         const { firstName, lastName, userBio, userEmail, userMobile, userName, userPassword } = req.body;

//         // Check if the user already exists
//         const existingUser = await User.findOne({ userEmail });
//         if (existingUser) {
//             // Return if the user already exists
//             if (!res.headersSent) {
//                 return res.status(401).json({ error: "User Already Exists with this email" });
//             }
//         }

//         // Check if a file is provided
//         if (!req.file) {
//             if (!res.headersSent) {
//                 return res.status(400).json({ error: "No Profile Image Provided" });
//             }
//         }

//         // Upload file to Cloudinary
//         const result = await cloudinary.uploader.upload(req.file.buffer, {
//             folder: 'profile_images', // Optional: Organize images in a specific folder
//         });
//         console.log(result);

//         // Hash the user password
//         const saltRounds = 10;
//         const salt = await bcrypt.genSalt(saltRounds);
//         const encryptedPassword = await bcrypt.hash(userPassword, salt);

//         const newUser = new User({
//             firstName,
//             lastName,
//             userBio,
//             userEmail,
//             userMobile,
//             userName,
//             userPassword: encryptedPassword,
//             profileImage: result.secure_url
//         });

//         await newUser.save();

//         // Send the response only once
//         if (!res.headersSent) {
//             return res.status(201).json({
//                 status: "Ok",
//                 user: newUser
//             });
//         }

//     } catch (error) {
//         // Handle errors and send a response only once
//         if (!res.headersSent) {
//             return res.status(400).json({ error: error.message });
//         }
//         console.error(error);
//     }
// };



// const login = async (req, res) => {
//     try {
//         const { userEmail, userPassword } = req.body;
//         // console.log(userEmail);

//         const user = await User.findOne({ userEmail });

//         if (user) {
//             const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
//             if (passwordMatch) {
//                 return res.json(user);
//             } else {
//                 return res.json({ status: "Error", getUser: false })
//             }
//         } else {
//             return res.json({ status: "Error", getUser: false });
//         }

//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };


// module.exports = { signup, login };









// const express = require("express");
// const dotenv = require("dotenv");
// const User = require("../Models/User");
// const bcrypt = require("bcrypt");
// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;

// dotenv.config();

// const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // Configure Cloudinary
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Signup Route
// const signup = async (req, res) => {
//     try {
//         const { firstName, lastName, userBio, userEmail, userMobile, userName, userPassword } = req.body;

//         // Check if the user already exists
//         const existingUser = await User.findOne({ userEmail });
//         if (existingUser) {
//             return res.status(409).json({ error: "User already exists with this email" });
//         }

//         // Check if a file is provided
//         if (!req.file) {
//             return res.status(400).json({ error: "No profile image provided" });
//         }

//         // Upload file to Cloudinary
//         cloudinary.uploader.upload_stream({
//             folder: 'profile_images',
//         }, async (error, result) => {
//             if (error) {
//                 return res.status(500).json({ error: "Image upload failed" });
//             }

//             // Hash the user password
//             try {
//                 const salt = await bcrypt.genSalt(10);
//                 const hash = await bcrypt.hash(userPassword, salt);
//                 // Create a new user
//                 const newUser = new User({
//                     firstName,
//                     lastName,
//                     userBio,
//                     userEmail,
//                     userMobile,
//                     userName,
//                     userPassword: hash,
//                     profileImage: result.secure_url
//                 });

//                 await newUser.save();
//                 return res.status(201).json({
//                     status: "Ok",
//                     user: newUser
//                 });

//             } catch (err) {
//                 return res.status(500).json({ error: "User registration failed" });
//             }
//         }).end(req.file.buffer); // Pipe the file buffer to Cloudinary

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Server error" });
//     }
// };


// const login = async (req, res) => {
//         try {
//             const { userEmail, userPassword } = req.body;
//             // console.log(userEmail);
    
//             const user = await User.findOne({ userEmail });
    
//             if (user) {
//                 const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
//                 if (passwordMatch) {
//                     return res.json(user);
//                 } else {
//                     return res.json({ status: "Error", getUser: false })
//                 }
//             } else {
//                 return res.json({ status: "Error", getUser: false });
//             }
    
//         } catch (error) {
//             res.status(400).json({ error: error.message });
//         }
//     };

// module.exports = { signup, login };












const express = require("express");
const dotenv = require("dotenv");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Signup Route
const signup = async (req, res) => {
    try {
        const { firstName, lastName, userBio, userEmail, userMobile, userName, userPassword } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email" });
        }

        // Check if a file is provided
        if (!req.file) {
            return res.status(400).json({ error: "No profile image provided" });
        }

        // Upload file to Cloudinary
        cloudinary.uploader.upload_stream({
            folder: 'profile_images',
        }, async (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Image upload failed" });
            }

            // Hash the user password
            try {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(userPassword, salt);

                // Create a new user
                const newUser = new User({
                    firstName,
                    lastName,
                    userBio,
                    userEmail,
                    userMobile,
                    userName,
                    userPassword: hash,
                    profileImage: result.secure_url
                });

                await newUser.save();
                return res.status(201).json({
                    status: "Ok",
                    user: newUser
                });

            } catch (err) {
                return res.status(500).json({ error: "User registration failed" });
            }
        }).end(req.file.buffer); // Pipe the file buffer to Cloudinary

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        const user = await User.findOne({ userEmail });

        if (user) {
            const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
            if (passwordMatch) {
                return res.json(user);
            } else {
                return res.json({ status: "Error", getUser: false });
            }
        } else {
            return res.json({ status: "Error", getUser: false });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { signup, login };
