const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    totalAmount: { type: Number },    // total price of all items at purchase time
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    name: { type: String, required: true },    // customer's name (for shipping)
    email: { type: String, required: true },    // customer's email (for notification)
    phone: { type: String, required: true },    // customer's phone (for loyalty & SMS)
    address: { type: String, required: true },    // shipping address
    status: { type: String, default: 'Pending Payment' },  // e.g., Pending Payment, Confirmed, Shipped, Delivered
    paymentRef: { type: String, default: '' },        // reference from payment gateway (e.g., transaction ID),
    placedAt: { type: Date, default: Date.now },    // when the order was placed
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
