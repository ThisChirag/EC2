"use strict";
//Here I will include all the generator logics: jwt token, uuid 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
// utils contains all the generator logics including tokens, date, calculations, sort of all type of calculations, small functions 
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY || "just_testing";
const generateToken = (name, email, user_id) => {
    const payload = {
        name: name,
        email: email,
        user_Id: user_id,
    }; // consider avoiding passwords in the payload ,
    const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: 3600 });
    return token;
};
exports.generateToken = generateToken;
