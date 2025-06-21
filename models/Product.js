const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
    frameColor: { type: String, required: true, trim: true },
    inStock: { type: Number, required: true, min: 0, default: 0 },
    images: { type: [String], required: true },  // array of image URLs (Cloudinary links)
    price: { type: Number, required: true, min: 0 },
    size: { type: String }
});


const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    frameStyle: { type: String, required: true },    // e.g., Aviator, Wayfarer, etc.
    description: { type: String, required: true, trim: true },
    lens: { type: String, required: true },    // e.g., Polarized, UV400
    gender: { type: String, required: true },    // e.g., Men, Women, Unisex
    material: { type: String, required: true },    // e.g., Metal, Plastic
    productType: { type: String, required: true }, // e.g., Eyeglasses, Sunglasses
    frameType: { type: String, required: true }, // e.g., Full Rim, Half Rim, Rimless
    variants: {
        type: [VariantSchema],
        validate: [v => v.length > 0, "At least one color variant is required"]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
