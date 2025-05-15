const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    style: { type: String, required: true },    // e.g., Aviator, Wayfarer, etc.
    lens: { type: String, required: true },    // e.g., Polarized, UV400
    gender: { type: String, required: true },    // e.g., Men, Women, Unisex
    material: { type: String, required: true },    // e.g., Metal, Plastic
    price: { type: Number, required: true },
    inStock: { type: Number, default: 0 },        // quantity in stock
    description: { type: String },                     // optional description of the product
    size: { type: String },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length > 0;
            },
            message: 'Product must have at least one image.'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
