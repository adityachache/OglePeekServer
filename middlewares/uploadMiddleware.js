const multer = require('multer');
const path = require('path');

// Configure storage (here we use disk storage; files will be saved to 'uploads/' folder)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // ensure this folder exists in your project
    },
    filename: (req, file, cb) => {
        // Use current timestamp + original name to create a unique filename
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimeMatch = allowedTypes.test(file.mimetype);
    const extMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeMatch && extMatch) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, png, gif) are allowed.'));
    }
};

// Initialize multer with storage, file limit, and file filter
const upload = multer({
    storage: storage,
    limits: { files: 3, fileSize: 5 * 1024 * 1024 }, // limit to 3 files, 5MB each (for example)
    fileFilter: fileFilter
});

// Middleware to handle an array of images (max 3)
const uploadImages = upload.array('images', 3);

module.exports = { uploadImages };
