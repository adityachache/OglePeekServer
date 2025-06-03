// routes/paymentRoutes.js (for eSewa)
const express = require('express');
const router = express.Router();
const { initiateEsewaPayment, esewaSuccess, esewaFailure } = require('../controllers/paymentController');

// Initiate eSewa payment (redirect user to eSewa)
router.get('/esewa/initiate/:orderId', initiateEsewaPayment);

// Callback routes for eSewa to redirect to after payment
router.get('/esewa/success', esewaSuccess);
router.get('/esewa/failure', esewaFailure);


// routes/paymentRoutes.js (additional route for Option B)
router.post('/esewa/verify-payment', verifyEsewaPayment);


module.exports = router;
