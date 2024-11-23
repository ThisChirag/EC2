import { createClient } from "redis";
import { NextFunction, Request, Response } from "express";

// Create and connect the Redis client
const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

(async () => {
  try {
    await redisClient.connect(); // Ensure Redis connection is established
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

const rateLimiter = (limit: number, windowSeconds: number)  =>{
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {//express expects void in return in when handling middlwares;
        const key = `rate:${req.ip}`;

        try{
            const requests = await redisClient.incr(key);

            if(requests == 1){
                await redisClient.expire(key, windowSeconds);
            }

            if(requests > limit){
                const ttl = await redisClient.ttl(key);
                res.status(429).json({
                    msg: "Tried more than allowed request",
                    retryAfter: ttl,
                });
                return;
            }
            next();

        }catch(error){
            console.log('Rate limiter error: ', error);
            res.status(500).json({
                msg: "Internal Error, try again after sometime",
            });
        }
    };
};


export default rateLimiter;