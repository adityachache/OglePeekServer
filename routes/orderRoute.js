const express = require("express");
const router = express.Router();


const { createOrGetCustomer, verifyAndPlaceOrder } = require('../controllers/orderController');

router.post('/initiate', createOrGetCustomer);
router.post('/verify', verifyAndPlaceOrder);

module.exports = router;
