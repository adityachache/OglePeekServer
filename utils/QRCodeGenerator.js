// src/utils/generateQRCode.js
const crypto = require('crypto');

module.exports = function generateQRCode(paymentInfo) {
    // Generate a dummy unique payment reference (e.g., using order ID or a random string)
    const paymentRef = paymentInfo.id || crypto.randomBytes(4).toString('hex');

    // Construct a fake QR code URL (this could be a data URL or a link to a QR code image)
    const data = `FonepayPayment:${paymentRef}`;  // This is the data to encode in the QR (simulate Fonepay payload)
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=200x200`;

    // Log and return the QR code URL (in a real scenario, you might return binary data or a base64 string of the QR)
    console.log(`⚡ Generated QR Code for payment. Data: ${data}`);
    return { paymentRef, qrCodeURL };
};
