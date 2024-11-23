"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); //can add winston here
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.set('json space', 2); // pretty print, can also use stringyfy(..,null,2)
app.use('/test', userRoutes_1.default);
// Intermediate route to handle the redirect, but we generally handle redirecting on server
// app.get('/redirect-to-home', (req, res) => {
//     res.redirect(307, '/home'); // Redirects with a GET method
// });
exports.default = app;
