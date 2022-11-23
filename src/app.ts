import Authentication  from './handler/Authentication';
require("dotenv").config();
require("./config/database").connect();
import express from 'express';
const app = express();


app.use(express.json());

// Register
app.post("/register",  Authentication.register);

// Login
app.post("/login", Authentication.login);

export default app;