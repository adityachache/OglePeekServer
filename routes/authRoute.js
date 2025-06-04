const express = require("express");
const router = express.Router();

//Test indicates that the route doesn't requires captcha verification for login and registration

//Main Auth Controller
const { loginHandlerViaEmail, verifyOtpHandler, loginHandlerViaPhone, registerHandler } = require("../controllers/authController");

//Auth Controller without Capthcha Verification (For Testing)
const { loginHandlerViaEmailTest, loginHandlerViaPhoneTest, registerTestHandler } = require("../controllers/authControllerTest");
const catchAsync = require("../utils/catchAsync")

// Testing the req body for register and login (Main Routes)
const { validateUserRegister } = require("../middlewares/validateUserRegister");
const { validateUserLoginViaEmail, validateUserLoginViaPhone } = require("../middlewares/validateUserLogin");

// Testing the req body for register and login (Without captch Verification)
const { validateUserRegisterTest } = require("../middlewares/validateUserRegisterTest");
const { validateUserLoginViaEmailTest, validateUserLoginViaPhoneTest } = require("../middlewares/validateUserLoginTest")

//Routee to handle login requests
router.post("/login/email", validateUserLoginViaEmail, catchAsync(loginHandlerViaEmail));
router.post("/login/phone", validateUserLoginViaPhone, catchAsync(loginHandlerViaPhone));

//Route to handle registration requests
router.post("/register", validateUserRegister, catchAsync(registerHandler));


// TestRoute to handle login
router.post("/login/email/test", validateUserLoginViaEmailTest, catchAsync(loginHandlerViaEmailTest));
router.post("/login/phone/test", validateUserLoginViaPhoneTest, catchAsync(loginHandlerViaPhoneTest));


//TestRoute to handle registration
router.post("/registerTest", validateUserRegisterTest, catchAsync(registerTestHandler));


//Verify OTP
router.post('/verify-otp', verifyOtpHandler);

module.exports = router;