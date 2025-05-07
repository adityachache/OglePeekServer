const express = require("express");
const router = express.Router();

const { loginHandler, registerHandler } = require("../controllers/authController");
const { catchAsync } = require("../utils/catchAsync")

//Routee to handle login requests
router.post("/login", verifyCustomerLogin, catchAsync(loginHandler));

//Route to handle registration requests
router.post("/register", verifyCustomerRegister, catchAsync(registerHandler));

module.exports = router;