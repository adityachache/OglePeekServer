const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        // console.log(process.env.secretKey);
        const decoded = jwt.verify(token, process.env.secretKey);
        req.user = decoded;
        if (!req.user) return res.status(401).json({ message: 'User not found' });
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

exports.adminOnly = async (req, res, next) => {
    console.log(req.user);
    req.user = req.user.user;
    console.log(req.user);

    const currUser = await User.findById(req.user.id);
    console.log(currUser)

    if (currUser && currUser.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};
