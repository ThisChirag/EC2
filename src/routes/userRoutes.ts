import { Router } from "express";
import { signUp, home, login, newBlog } from "../controllers/userCreate";
import { authenticateToken } from "../middlewares/authenticateToken";
import rateLimiter from "../middlewares/rateLimiter";


const userRoute = Router();

userRoute.get('/home', rateLimiter(5, 10), authenticateToken, home);
userRoute.post('/login', rateLimiter(5,10), login);
userRoute.post('/signup',rateLimiter(5,10), signUp);
userRoute.post('/newblog', rateLimiter(5,10),authenticateToken, newBlog);

export default userRoute;


