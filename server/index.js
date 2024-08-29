// server.js 
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const multer = require('multer');
const bodyParser = require("body-parser");

const authRoutes = require("./Routes/auth");
const noteRoutes = require("./Routes/notes");

const app = express();
const PORT = 6969;

// Load environment variables
dotenv.config();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file names
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|pdf/; 
        const extname = fileTypes.test(file.mimetype);
        const mimetype = fileTypes.test(file.originalname.split('.').pop().toLowerCase());

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb({ error: 'Invalid file type.' });
        }
    },
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connection Successful"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Basic route
app.get("/", (req, res) => {
    res.send("Server Is Running");
});

// Route handlers
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/files", express.static("uploads")); 

// Start server
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
