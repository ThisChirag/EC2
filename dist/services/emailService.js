"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const postmark = require("postmark");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Postmark client
const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN || "");
// Function to send a verification email
const sendVerificationEmail = async (email, otp) => {
    try {
        const response = await postmarkClient.sendEmail({
            From: "chirag@chiragcodes.com", // Verified domain email
            To: email, // Recipient email
            Subject: "Verify Your Email",
            TextBody: `Your OTP is ${otp}. It is valid for 5 minutes.`,
            HtmlBody: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
        });
        console.log("Verification email sent successfully:", response);
    }
    catch (error) {
        console.error("Failed to send verification email:", error.message || error);
        throw new Error("Failed to send verification email");
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
