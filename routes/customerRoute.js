const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model defined

router.get('/', async (req, res) => {
    //Send all customers list from the database
    const customers = await User.find({});
    res.status(200).json({ success: true, customers });
});


module.exports = router;