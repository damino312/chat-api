const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const MessageController = require("../controllers/Message.contoller");

app.get("/messages/:userId", MessageController.GetUsersMessages);

module.exports = app;
