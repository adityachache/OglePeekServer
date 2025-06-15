const Order = require('../models/Order');
const User = require('../models/User');

const sendEmail = require("../utils/sendEmail");

exports.createOrGetCustomer = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        let customerId = undefined;
        if (email || phone) {
            const existingUser = await User.findOne({
                $or: [{ email: email }, { phone: phone }]
            });
            if (existingUser) {
                customerId = existingUser._id;
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpires = Date.now() + 10 * 60 * 1000;

                existingUser.otp = otp;
                existingUser.otpExpires = otpExpires;
                await existingUser.save();
            } else {
                const newUser = new User({
                    name: name || 'Guest',
                    email: email || '',
                    phone: phone || '',
                    isVerified: false, // Assuming new users are not verified by default
                });

                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpires = Date.now() + 10 * 60 * 1000;
                newUser.otp = otp;
                newUser.otpExpires = otpExpires;

                await newUser.save();
                customerId = newUser._id;
            }

            // Send OTP via email
            if (email) {
                await sendEmail(email, 'OglePeek Order Verification', `Your OTP is: ${existingUser ? existingUser.otp : newUser.otp}`);
            }
        }

        res.status(201).json({ success: true, message: 'Customer created or retrieved successfully', customerId: customerId });
    } catch (err) {
        console.error('Order placement failed:', err);
        res.status(500).json({ success: false, message: 'Server error while placing order' });
    }
};


exports.verifyAndPlaceOrder = async (req, res) => {
    try {
        const { customerId, otp, address, items, name, email, phone } = req.body;
        // console.log(customerId)
        const userArray = await User.find({ email });
        if (userArray.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const user = userArray[0];

        if (user.otpExpires < Date.now()) {
            console.log("OTP expired")
        }

        console.log(otp);
        console.log(user.otp);
        console.log(user.email);

        if (user.otp !== otp) {
            console.log("OTP not matched")
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const order = new Order({
            customer: customerId,
            name,
            email,
            phone,
            address,
            items,
            status: 'Pending Payment',
            placedAt: new Date()
        });

        console.log(order);

        await order.save();
        return res.status(201).json({ success: true, message: 'Order placed successfully', orderId: order._id });
    } catch (err) {
        console.error('OTP Verification Error:', err);
        return res.status(500).json({ success: false, message: 'Server error during OTP verification.' });
    }
};

