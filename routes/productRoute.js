const express = require("express");
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'tmp/' }); // using disk storage (tmp) for example
const { createProduct, getAllProducts, deleteProduct, getProductsWithFilterAndPagination, getProductById } = require('../controllers/productController');
const { authenticate, adminOnly } = require('../middlewares/authMiddleware');

// POST /api/products - Admins only, with images upload
router.post('/', authenticate, adminOnly, upload.any(), createProduct);

//Get all products information
router.get('/', getProductsWithFilterAndPagination);

//Get product by ID
router.get('/:id', getProductById);

//Get all products with full details
router.get('/all', getAllProducts);

//Delete a product
router.delete('/:id', adminOnly, deleteProduct);


module.exports = router;
