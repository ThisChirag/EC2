"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userCreate_1 = require("../controllers/userCreate");
const authenticateToken_1 = require("../middlewares/authenticateToken");
const rateLimiter_1 = __importDefault(require("../middlewares/rateLimiter"));
const userRoute = (0, express_1.Router)();
userRoute.get('/home', (0, rateLimiter_1.default)(5, 10), authenticateToken_1.authenticateToken, userCreate_1.home);
userRoute.post('/login', (0, rateLimiter_1.default)(5, 10), userCreate_1.login);
userRoute.post('/signup', (0, rateLimiter_1.default)(5, 10), userCreate_1.signUp);
userRoute.post('/newblog', (0, rateLimiter_1.default)(5, 10), authenticateToken_1.authenticateToken, userCreate_1.newBlog);
exports.default = userRoute;
