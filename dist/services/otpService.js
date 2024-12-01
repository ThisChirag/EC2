"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.storeOtp = exports.generateOtp = void 0;
const cache_1 = require("../cache");
const uuid_1 = require("uuid");
const generateOtp = () => {
    return (0, uuid_1.v4)().slice(0, 6); // Generate a 6-character OTP
};
exports.generateOtp = generateOtp;
const storeOtp = async (email, otp, ttl) => {
    await (0, cache_1.setOtp)(email, otp, ttl); // Store OTP in Redis
};
exports.storeOtp = storeOtp;
const verifyOtp = async (email, otp) => {
    const storedOtp = await (0, cache_1.getOtp)(email);
    return storedOtp === otp;
};
exports.verifyOtp = verifyOtp;
