// controllers/paymentController.js
const axios = require('axios');
const Order = require('../models/Order');

const ESEWA_MERCHANT_ID = process.env.MERCHANT_ID;      // eSewa merchant code (e.g., "EPAYTEST" for testing)
const ESEWA_PAYMENT_URL = process.env.ESEWAPAYMENT_URL; // eSewa payment endpoint (for redirect/form)
const ESEWA_VERIFY_URL = process.env.ESEWA_STATUS_URL;  // eSewa transaction verification endpoint

// 1. Initiate payment - redirect user to eSewa gateway
exports.initiateEsewaPayment = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const amount = order.totalAmount || order.totalPrice;  // assume order has a total amount field

        // Build eSewa payment URL with required query params
        const successUrl = `${process.env.BASE_URL}/api/pay/esewa/success?oid=${orderId}`;
        const failureUrl = `${process.env.BASE_URL}/api/pay/esewa/failure?oid=${orderId}`;
        // eSewa expects fields: amt, pid, scd, su, fu (and possibly others like tax, psc, pdc if applicable)
        const esewaUrl = `${ESEWA_PAYMENT_URL}?amt=${amount}&pid=${orderId}&scd=${ESEWA_MERCHANT_ID}&su=${encodeURIComponent(successUrl)}&fu=${encodeURIComponent(failureUrl)}`;

        return res.redirect(esewaUrl);  // redirect the user to eSewa payment page
    } catch (err) {
        console.error('Error initiating eSewa payment:', err);
        res.status(500).json({ message: 'Could not initiate payment' });
    }
};

// 2. Success callback - verify transaction
exports.esewaSuccess = async (req, res) => {
    try {
        // eSewa will send query params on success redirect
        const { oid, amt, refId } = req.query;  // oid = orderId, amt = amount, refId = eSewa transaction ID
        if (!oid || !refId) {
            return res.status(400).send("Invalid response from payment gateway");
        }

        // Verify the transaction with eSewa's verification API
        const verifyURL = `${ESEWA_VERIFY_URL}?amt=${amt}&oid=${oid}&rid=${refId}&scd=${ESEWA_MERCHANT_ID}`;
        const verifyRes = await axios.get(verifyURL);
        const verificationResponse = verifyRes.data;  // eSewa might return a string or XML

        // Check verification response for success indicator
        if (verificationResponse.includes("Success")) {
            // Payment is verified by eSewa
            await Order.findByIdAndUpdate(oid, {
                status: 'Paid',
                paymentRef: refId,             // store eSewa transaction reference
                paidAt: new Date()
            });
            // Redirect or respond with success message
            return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
        } else {
            // Verification failed
            await Order.findByIdAndUpdate(oid, { status: 'Payment Failed' });
            return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
        }
    } catch (err) {
        console.error('Error verifying eSewa payment:', err);
        res.status(500).send("Payment verification error");
    }
};

// 3. Failure callback (for completeness)
exports.esewaFailure = async (req, res) => {
    const { oid } = req.query;
    if (oid) {
        // Mark order payment as failed or canceled
        await Order.findByIdAndUpdate(oid, { status: 'Payment Failed' });
    }
    // Inform the user payment was not successful
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failure`);
};


// controllers/paymentController.js (add this function)
exports.verifyEsewaPayment = async (req, res) => {
    try {
        const { orderId, amount, referenceId } = req.body;
        // 'referenceId' is the transaction ID from eSewa (a.k.a. rid in classic API)
        // 'amount' is the amount that was supposed to be paid
        // 'orderId' identifies the order on our side

        // Call eSewa verification API with provided data
        const verifyURL = `${ESEWA_VERIFY_URL}?amt=${amount}&oid=${orderId}&rid=${referenceId}&scd=${ESEWA_MERCHANT_ID}`;
        const verifyRes = await axios.get(verifyURL);
        const verificationResponse = verifyRes.data;

        if (verificationResponse.includes("Success")) {
            // Transaction is valid
            await Order.findByIdAndUpdate(orderId, { status: 'Paid', paymentRef: referenceId, paidAt: new Date() });
            return res.json({ success: true, message: "Payment verified, order is paid." });
        } else {
            // Transaction not verified
            return res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (err) {
        console.error('Error in eSewa payment verification:', err);
        res.status(500).json({ success: false, message: 'Server error during payment verification.' });
    }
};
