const Order = require('../models/Order');
const User = require('../models/User');

exports.placeOrder = async (req, res) => {
    try {
        const { name, email, phone, address, items } = req.body;
        let customerId = undefined;
        if (email || phone) {
            const existingUser = await User.findOne({
                $or: [{ email: email }, { phone: phone }]
            });
            if (existingUser) {
                customerId = existingUser._id;
            }
        }

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
