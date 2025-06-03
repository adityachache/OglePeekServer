// controllers/productController.js
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');

// (Assume Cloudinary is already configured with cloudinary.config(...) elsewhere)

exports.createProduct = async (req, res) => {
    try {
        // Collect form data fields
        const { name, price, description, category } = req.body;
        const files = req.files;  // array of image files from Multer

        // Upload each file to Cloudinary and collect the secure URLs
        const imageUrls = [];
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, { folder: 'products' });
            imageUrls.push(result.secure_url);
        }
        // Alternatively, use Promise.all for parallel uploads:contentReference[oaicite:0]{index=0}:
        // const uploadPromises = files.map(file => cloudinary.uploader.upload(file.path, { folder: 'products' }));
        // const results = await Promise.all(uploadPromises);
        // const imageUrls = results.map(r => r.secure_url);

        // Create and save the new product
        const product = new Product({
            name,
            price,
            description,
            category,
            images: imageUrls
        });
        await product.save();

        res.status(201).json({ success: true, product });
    } catch (err) {
        console.error('Product creation failed:', err);
        res.status(500).json({ success: false, message: 'Server error while creating product' });
    }
};
