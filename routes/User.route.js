const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { checkCookies } = require("../middleware/Cookies.middleware");

// If you put it into index.js it will not read
app.use(express.json());
app.use(cookieParser());

const UserController = require("../controllers/User.controller");

app.post("/register", UserController.RegisterUser);

app.post("/login", UserController.LoginUser);

app.get("/user", UserController.GetUser);

app.get("/people", UserController.GetAllUsers);

app.get("/logout", UserController.LogOut);

app.post("/getlastmessages", checkCookies, UserController.GetLastMessages);

module.exports = app;
