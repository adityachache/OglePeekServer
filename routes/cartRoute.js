const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { addOrUpdateCartItem, removeCartItem, updateCartItemQuantity, getCartItems } = require("../controllers/cartController");

//Get Cart 
router.get("/", authenticate, getCartItems);

//Add or Update Cart Item
router.post("/", authenticate, addOrUpdateCartItem);
//Remove Cart Item
router.delete("/", authenticate, removeCartItem);
//Update Cart Item Quantity
router.put("/", authenticate, updateCartItemQuantity);

module.exports = router;