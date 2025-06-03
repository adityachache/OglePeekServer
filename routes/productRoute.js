const express = require("express");
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'tmp/' }); // using disk storage (tmp) for example
const { createProduct } = require('../controllers/productController');
const { authenticate, adminOnly } = require('../middleware/authMiddleware');

// POST /api/products - Admins only, with images upload
router.post('/products', authenticate, adminOnly, upload.array('images'), createProduct);

module.exports = router;
