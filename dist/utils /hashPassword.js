"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyingPassword = exports.hashingPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = parseInt(process.env.SALT_ROUNDS ?? "10");
const hashingPassword = async (password) => {
    const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
    return hashedPassword;
};
exports.hashingPassword = hashingPassword;
const verifyingPassword = async (password, hashedPassword) => {
    if (!hashedPassword) {
        return false;
    }
    const isSamePassword = await bcrypt_1.default.compare(password, hashedPassword);
    return (isSamePassword);
};
exports.verifyingPassword = verifyingPassword;
