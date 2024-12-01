"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const validator_1 = __importDefault(require("validator"));
const validateEmail = async (req, res, next) => {
    const email = req.body;
    if (!email || !validator_1.default.isEmail(email)) {
        res.status(400).json({
            msg: "Invalid Email Format",
        });
        return;
    }
    next();
};
exports.validateEmail = validateEmail;
