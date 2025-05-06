/*

name
email
phoneNo
productBought - [productIds]
Address
Bought History -> [Item1, Item2]

Item1 would be like this -> ItemID, Address, Amount, Date, BillingNumber, Phone Number Used, Email Id Used, Coupons applied ?
*/

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
