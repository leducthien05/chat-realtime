const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 180
    }
});
const OTP =  mongoose.model('OTP', otpSchema, 'otp');
module.exports = OTP;