"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailDomain = void 0;
const promises_1 = __importDefault(require("dns/promises"));
const validateEmailDomain = async (email) => {
    const domain = email.split("@")[1];
    try {
        const bool = await promises_1.default.resolveMx(domain);
        return bool.length > 0;
    }
    catch {
        return false;
    }
};
exports.validateEmailDomain = validateEmailDomain;
