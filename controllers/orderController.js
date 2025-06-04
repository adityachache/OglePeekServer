// controllers/orderController.js
const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.placeOrder = async (req, res) => {
    try {
        const { name, email, phone, address, items } = req.body;
        // Optional: Check for existing customer by email or phone
        let customerId = undefined;
        if (email || phone) {
            const existingCustomer = await Customer.findOne({
                $or: [{ email: email }, { phone: phone }]
            });
            if (existingCustomer) {
                customerId = existingCustomer._id;
            }
            // (Optionally, create a new Customer if not found, or handle as guest)
        }

        // Create order document
        const order = new Order({
            customer: customerId || null,            // reference to Customer model if available
            name, email, phone, address,            // store shipping info on the order as well
            items,                                  // expecting an array of { product, quantity }
            status: 'Pending Payment',              // initial status
            placedAt: new Date()
        });
        await order.save();

        res.status(201).json({ success: true, order });
    } catch (err) {
        console.error('Order placement failed:', err);
        res.status(500).json({ success: false, message: 'Server error while placing order' });
    }
};
