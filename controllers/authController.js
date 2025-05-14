const crypto = require('crypto')
const secretKey = process.env.secretKey;
const Customer = require('../models/Customer')
const jwt = require('jsonwebtoken');
const axios = require('axios');

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Registering a customer needs an OTP confirmation via email or via Phone

module.exports.registerHandler = async (req, res) => {
    const { name, email, phone, password, captchaValue } = req.body
    if (!captchaValue) {
        return res.status(400).json({ error: "CAPTCHA is required!" });
    }

    try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaValue}`;

        const { data } = await axios.post(verifyUrl);
        console.log(data);
        if (!data.success) {
            return res.status(400).json({ error: "CAPTCHA verification failed!" });
        }

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
    const { email, password, captchaValue } = req.body;
    if (!captchaValue) {
        return res.status(400).json({ error: "CAPTCHA is required!" });
    }
    try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaValue}`;

        const { data } = await axios.post(verifyUrl);
        console.log(data);
        if (!data.success) {
            return res.status(400).json({ error: "CAPTCHA verification failed!" });
        }
        // Find the customer by email
        const foundCutomer = await Customer.findOne({ email });
        if (!foundCutomer) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await foundCutomer.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const data2 = {
            customer: { id: foundCutomer._id }
        };
        const authToken = jwt.sign(data2, secretKey, { expiresIn: '1h' });

        res.status(200).json({ success: true, authToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};



module.exports.loginHandlerViaPhone = async (req, res) => {
    const { phone, password, captchaValue } = req.body;
    if (!captchaValue) {
        return res.status(400).json({ error: "CAPTCHA is required!" });
    }
    try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaValue}`;

        const { data } = await axios.post(verifyUrl);
        console.log(data);
        if (!data.success) {
            return res.status(400).json({ error: "CAPTCHA verification failed!" });
        }
        // Find the customer by email
        const foundCutomer = await Customer.findOne({ phone });
        if (!foundCutomer) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password in the database
        const isMatch = await foundCutomer.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const data2 = {
            customer: { id: foundCutomer._id }
        };
        const authToken = jwt.sign(data2, secretKey, { expiresIn: '1h' });

        res.status(200).json({ success: true, authToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


