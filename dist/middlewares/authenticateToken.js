"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("../utils /prisma"));
const cache_1 = require("../cache");
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY || "testing authentication";
const verifyPromise = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretKey, (err, decode) => {
            if (!decode) {
                reject(err);
            }
            resolve(decode);
        });
    });
};
const authenticateToken = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
        res.status(401).json({
            msg: "Unauthorized, Token not provided.. Please Create Account or login"
        });
        return;
    }
    const token = authToken && authToken.split(' ')[1];
    try {
        const user = await verifyPromise(token, secretKey);
        const email = user.email;
        // res.locals.user -> we can send the jwt data from this method as well, 
        const activeToken = await (0, cache_1.getTokenFromUser_Id)(user.user_Id);
        const isPresent = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!isPresent) {
            res.status(400).json({
                msg: "user not found",
            });
            return;
        }
        if (!activeToken || activeToken !== token) {
            res.status(401).json({
                msg: "Token expired, please login again"
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(res.status(401).json({
            msg: "Token is invalid, please login",
        })); // it's a better approach, as all the logs will be centralized;
    }
};
exports.authenticateToken = authenticateToken;
// => test, rate limiter 
