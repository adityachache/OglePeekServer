const express = require("express");
const router = express.Router();

//Test indicates that the route doesn't requires captcha verification for login and registration

//Main Auth Controller
const { loginHandlerViaEmail, verifyOtpHandler, loginHandlerViaPhone, registerHandler } = require("../controllers/authController");

//Auth Controller without Capthcha Verification (For Testing)
const { loginHandlerViaEmailTest, loginHandlerViaPhoneTest, registerTestHandler } = require("../controllers/authControllerTest");
const catchAsync = require("../utils/catchAsync")

// Testing the req body for register and login (Main Routes)
const { validateCustomerRegister } = require("../middlewares/validateCustomerRegister");
const { validateCustomerLoginViaEmail, validateCustomerLoginViaPhone } = require("../middlewares/validateCustomerLogin");

// Testing the req body for register and login (Without captch Verification)
const { validateCustomerRegisterTest } = require("../middlewares/validateCustomerRegisterTest");
const { validateCustomerLoginViaEmailTest, validateCustomerLoginViaPhoneTest } = require("../middlewares/validateCustomerLoginTest")

//Routee to handle login requests
router.post("/login/email", validateCustomerLoginViaEmail, catchAsync(loginHandlerViaEmail));
router.post("/login/phone", validateCustomerLoginViaPhone, catchAsync(loginHandlerViaPhone));

//Route to handle registration requests
router.post("/register", validateCustomerRegister, catchAsync(registerHandler));


// TestRoute to handle login
router.post("/login/email/test", validateCustomerLoginViaEmailTest, catchAsync(loginHandlerViaEmailTest));
router.post("/login/phone/test", validateCustomerLoginViaPhoneTest, catchAsync(loginHandlerViaPhoneTest));


//TestRoute to handle registration
router.post("/registerTest", validateCustomerRegisterTest, catchAsync(registerTestHandler));


//Verify OTP
router.post('/verify-otp', verifyOtpHandler);

module.exports = router;