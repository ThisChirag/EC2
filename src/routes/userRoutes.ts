import { Router } from "express";
import { signUp, home, login, newBlog } from "../controllers/userCreate";
import { authenticateToken } from "../middlewares/authenticateToken";
import rateLimiter from "../middlewares/rateLimiter";


const userRoute = Router();

userRoute.get('/home', authenticateToken, rateLimiter(5, 10), home);
userRoute.post('/login', rateLimiter(5,10), login);
userRoute.post('/signup', signUp);
userRoute.post('/newblog', authenticateToken, newBlog);

export default userRoute;


