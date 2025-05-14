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


// Password hashing middleware before saving the customer
customerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare the hashed password with the one entered by the user
customerSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);
