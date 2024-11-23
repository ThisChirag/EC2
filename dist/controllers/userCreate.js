"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.home = exports.newBlog = exports.signUp = void 0;
const GeneratorLogic_1 = require("../utils /GeneratorLogic");
const hashPassword_1 = require("../utils /hashPassword");
const prisma_1 = __importDefault(require("../utils /prisma"));
const cache_1 = require("../cache");
(0, cache_1.connectReddis)();
const saltRounds = parseInt(process.env.SALT_ROUNDS ?? "10");
const secretKey = process.env.secretKey || "just_testing";
const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        res.status(400).json({
            msg: "please provide all the details"
        });
        return;
    }
    //checking user exits or not
    try {
        const userPresent = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (userPresent) {
            res.status(409).json({
                msg: "User is already exits, please login"
            });
            return;
        }
        const hashedPassword = await (0, hashPassword_1.hashingPassword)(password);
        const user = await prisma_1.default.user.create({
            data: {
                username: name,
                email: email,
                password: hashedPassword,
            }
        });
        const user_id = user.id.toString();
        const token = (0, GeneratorLogic_1.generateToken)(name, email, user_id);
        const storingToken = await (0, cache_1.storeToken)(user_id, token, 3600);
        if (!storingToken) {
            res.status(500).json({
                msg: "Internal Server Error",
            });
            return;
        }
        res.status(201).json({
            msg: "User created succussfully",
            data: {
                Name: name,
                User_Id: user_id,
                Email: email,
            },
            JWT_Token: token,
        });
    }
    catch (error) {
        console.log(`Error Occured: ${error}`);
        res.status(500).json({
            msg: "An error occurred while creating the user. Please try again later.",
        });
    }
};
exports.signUp = signUp;
const newBlog = async (req, res) => {
    //middleware comes in here
    const { title, description } = req.body;
    const { name, email, user_Id } = req.user;
    if (!title || !description) {
        res.status(400).json({
            msg: "Please Enter Your Title and Description"
        });
        return;
    }
    const insertPost = await prisma_1.default.post.create({
        data: {
            title: title,
            description: description,
            userId: user_Id,
        }
    });
    res.status(201).json({
        msg: "New Blog Created Succussfully",
        blog: {
            name: {
                blog_id: insertPost.id,
                title: title,
                description: description,
                createdAt: insertPost.created_at,
                userId: user_Id,
            }
        }
    });
};
exports.newBlog = newBlog;
const home = async (req, res) => {
    //authentication middleware will send the control here;
    try {
        const { name, email, user_Id } = req.user;
        const userPosts = await prisma_1.default.post.findMany({
            where: { userId: user_Id },
        });
        res.status(200).json({
            msg: "Here are all your user posts",
            data: userPosts, // Return as an array of objects
        });
        return;
    }
    catch (error) {
        console.log("An Error Occured: " + error);
        res.status(500).json({
            msg: "Failed to retrieve user posts",
        });
    }
};
exports.home = home;
const login = async (req, res) => {
    // here user will send his email and password;
    const { email, password } = req.body; // hash the password and don't store as a plain text and compare too
    if (!email || !password) {
        res.status(400).json({
            msg: "please provide all the details"
        });
        return;
    }
    // const user_present = USERS.find(u => u.email == email && u.hashedPassword == password);
    const user_present = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user_present) {
        res.status(404).json({
            msg: "user not found"
        });
        return;
    }
    const hashedPassword = user_present?.password;
    const verifyPass = await (0, hashPassword_1.verifyingPassword)(password, hashedPassword);
    if (user_present && verifyPass) { // if we don't use the await keyword, then the function will always return a promise, and in JS a Promise is a truthy value in JavaScript, even if the password comparison fails.
        const name = user_present.username; // and regardless the password matches, verifyPass will always be true
        const user_id = user_present.id;
        const newToken = (0, GeneratorLogic_1.generateToken)(name, email, user_id);
        await (0, cache_1.setNewToken)(user_id, newToken, 3600);
        res.status(200).json({
            msg: "Login Succussful, token is valid for 1 hour",
            newToken: newToken
        });
        return;
    }
    else {
        res.status(401).json({
            msg: "Wrong email or password",
        });
    }
};
exports.login = login;
// function extraInformation(){
//here he can see all his posts, and this is a protected route; -> home route
//      // const todo_id = uuidv4() //todoID
// // we can use in this way:
// //     const dateObject = new Date();
// // console.log(dateObject); // Example output: Wed Nov 15 2023 12:30:45 GMT+0000 (Coordinated Universal Time)
// // console.log(typeof dateObject); // Output: "object"
// // // You can access date components
// // console.log(dateObject.getFullYear()); // Output: 2023
// // console.log(dateObject.getMonth());    // Output: 10 (months are zero-indexed: 0 = January, 11 = December)
// // console.log(dateObject.getDate());     // Output: 15
/*we can pretty print the data as well, by using app.set('json spaces', 2) or by stringify((...),
 null,2) or by using middleware*/
// }}
