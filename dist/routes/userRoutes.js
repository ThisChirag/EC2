"use strict";
// import { Router } from "express";
// import { signUp, home, login, newBlog } from "../controllers/userCreate";
// import { authenticateToken } from "../middlewares/authenticateToken";
// import {rateLimiter} from "../middlewares/rateLimiter";
Object.defineProperty(exports, "__esModule", { value: true });
// const userRoute = Router();
// userRoute.get('/home', authenticateToken, home);
// userRoute.post('/login', rateLimiter(10,20), login);
// userRoute.post('/signup',rateLimiter(10,20), signUp);
// userRoute.post('/newblog',authenticateToken, newBlog);
// export default userRoute;
const express_1 = require("express");
const userCreate_1 = require("../controllers/userCreate");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const otpController_1 = require("../controllers/otpController"); // Import OTP controllers
const userRoute = (0, express_1.Router)();
// Protected routes
userRoute.get('/home', authenticateToken_1.authenticateToken, userCreate_1.home);
userRoute.post('/newblog', authenticateToken_1.authenticateToken, userCreate_1.newBlog);
// Authentication routes
userRoute.post('/login', (0, rateLimiter_1.rateLimiter)("login", 10, 60), userCreate_1.login);
// OTP-based signup routes
userRoute.post('/signup/request-verification', (0, rateLimiter_1.rateLimiter)("signup", 5, 60), otpController_1.requestOtp); // Request OTP
userRoute.post('/signup/verify-otp', (0, rateLimiter_1.rateLimiter)("verify-otp", 5, 60), otpController_1.verifyOtp); // Verify OTP and create account
exports.default = userRoute;
