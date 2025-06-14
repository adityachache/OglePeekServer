const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

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

const upload = multer({
    storage: storage,
    limits: { files: 3, fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

const uploadImages = upload.array('images', 3);

module.exports = { uploadImages };
