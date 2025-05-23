const crypto = require('crypto')
const secretKey = process.env.secretKey;
const Customer = require('../models/Customer')
const jwt = require('jsonwebtoken');
const axios = require('axios');
const sendEmail = require('../utils/sendEmail');

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

        const existingUser = await Customer.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Email or phone already registered' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpires = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

        const customer = new Customer({
            name,
            email,
            phone,
            password,
            otp,
            otpExpires
        });

        const resp = await customer.save()

        // Send OTP via email
        await sendEmail(email, 'OglePeek Email Verification', `Your OTP is: ${otp}`);

        // Log the saved user document
        console.log('Customer saved:', resp);

        const data2 = {
            customer: { id: customer._id }
        }
        // console.log(process.env.SECRET);
        res.status(200).json({ success: true, message: 'OTP sent to your email. Please verify.' });
        // res.status(201).json({ success: true, user: resp })
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

module.exports.verifyOtpHandler = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        if (customer.isVerified) {
            return res.status(400).json({ success: false, message: 'User already verified' });
        }

        if (customer.otp !== otp || Date.now() > customer.otpExpires) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        customer.isVerified = true;
        customer.otp = undefined;
        customer.otpExpires = undefined;
        await customer.save();

        res.status(200).json({ success: true, message: 'Account verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
