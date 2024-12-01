"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtp = exports.setOtp = exports.setNewToken = exports.getTokenFromUser_Id = exports.storeToken = exports.connectReddis = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
redisClient.on('error', (error) => {
    console.log(`Redis Client Error: `, error);
});
const connectReddis = async () => {
    await redisClient.connect();
};
exports.connectReddis = connectReddis;
const storeToken = async (user_Id, token, ttl) => {
    try {
        await redisClient.set(`user:${user_Id}`, token, { EX: ttl });
        return true;
    }
    catch (error) {
        console.log("Error storing the token: ", error);
        return false;
    }
};
exports.storeToken = storeToken;
const getTokenFromUser_Id = async (user_Id) => {
    try {
        return await redisClient.get(`user:${user_Id}`);
    }
    catch (error) {
        console.log("Error fecthing token from redis:", error);
        return null;
    }
};
exports.getTokenFromUser_Id = getTokenFromUser_Id;
const setNewToken = async (user_id, token, ttl) => {
    try {
        await redisClient.del(`user:${user_id}`);
        await redisClient.set(`user:${user_id}`, token, { EX: ttl });
        return true;
    }
    catch (error) {
        console.log("Error in refreshing new token", error);
        return false;
    }
};
exports.setNewToken = setNewToken;
const setOtp = async (key, otp, ttl) => {
    await redisClient.setEx(key, ttl, otp);
};
exports.setOtp = setOtp;
const getOtp = async (key) => {
    return await redisClient.get(key);
};
exports.getOtp = getOtp;
