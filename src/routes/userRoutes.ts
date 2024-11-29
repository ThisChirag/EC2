import { Router } from "express";
import { signUp, home, login, newBlog } from "../controllers/userCreate";
import { authenticateToken } from "../middlewares/authenticateToken";
import rateLimiter from "../middlewares/rateLimiter";


const userRoute = Router();

userRoute.get('/home', rateLimiter(10, 20), authenticateToken, home);
userRoute.post('/login', rateLimiter(10,20), login);
userRoute.post('/signup',rateLimiter(10,20), signUp);
userRoute.post('/newblog', rateLimiter(10,20),authenticateToken, newBlog);

export default userRoute;


