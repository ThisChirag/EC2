"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.requestOtp = void 0;
const validateDomain_1 = require("../utils /validateDomain");
const otpService_1 = require("../services/otpService");
const emailService_1 = require("../services/emailService");
const hashPassword_1 = require("../utils /hashPassword");
const prisma_1 = __importDefault(require("../utils /prisma"));
/**
 * Request OTP for email verification
 */
const requestOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }
    // Validate email domain
    if (!(await (0, validateDomain_1.validateEmailDomain)(email))) {
        res.status(400).json({ message: "Invalid email domain" });
        return;
    }
    // Check if user already exists
    const userExists = await prisma_1.default.user.findUnique({ where: { email } });
    if (userExists) {
        res.status(409).json({ message: "User already exists. Please login." });
        return;
    }
    // Generate OTP and store in Redis
    const otp = (0, otpService_1.generateOtp)();
    await (0, otpService_1.storeOtp)(email, otp, 300); // 5 minutes TTL
    await (0, emailService_1.sendVerificationEmail)(email, otp);
    res.status(200).json({ message: "Verification OTP sent to your email" });
};
exports.requestOtp = requestOtp;
/**
 * Verify OTP and create user account
 */
const verifyOtp = async (req, res) => {
    const { email, otp, password, name } = req.body;
    if (!email || !otp || !password || !name) {
        res.status(400).json({ message: "Email, OTP, name, and password are required" });
        return;
    }
    // Verify OTP from Redis
    const isValidOtp = await (0, otpService_1.verifyOtp)(email, otp);
    if (!isValidOtp) {
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
    }
    // Hash the password
    const hashedPassword = await (0, hashPassword_1.hashingPassword)(password);
    try {
        // Create user in the database
        const user = await prisma_1.default.user.create({
            data: { username: name, email, password: hashedPassword },
        });
        res.status(201).json({ message: "Email verified successfully. Account created." });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.verifyOtp = verifyOtp;
