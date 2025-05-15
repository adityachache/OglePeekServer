const crypto = require('crypto')
const secretKey = process.env.secretKey;
const Customer = require('../models/Customer')
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Registering a customer needs an OTP confirmation via email or via Phone

module.exports.registerHandler = async (req, res) => {
    const { name, email, phone, password } = req.body

    try {
        const customer = new Customer({ name, email, phone, password })
        const resp = await customer.save()

        // Log the saved user document
        console.log('Customer saved:', resp);

        const data2 = {
            customer: { id: customer._id }
        }
        // console.log(process.env.SECRET);
        res.status(201).json({ success: true, user: resp })
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }


}


module.exports.loginHandlerViaEmail = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the customer by email
        const foundCustomer = await Customer.findOne({ email });
        if (!foundCustomer) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await foundCustomer.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const data2 = {
            customer: { id: foundCustomer._id }
        };
        const authToken = jwt.sign(data2, secretKey, { expiresIn: '1h' });

        res.status(200).json({ success: true, authToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



module.exports.loginHandlerViaPhone = async (req, res) => {
    const { phone, password } = req.body;

    try {

        // Find the customer by phone
        const foundCustomer = await Customer.findOne({ phone });
        if (!foundCustomer) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await foundCustomer.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const data2 = {
            customer: { id: foundCustomer._id }
        };
        const authToken = jwt.sign(data2, secretKey, { expiresIn: '1h' });

        res.status(200).json({ success: true, authToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


