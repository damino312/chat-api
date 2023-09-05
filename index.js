const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const ws = require("ws");

const UserRoutes = require("./routes/User.route");

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(UserRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/chat")
  .then(() => console.log("MongoDB has been connected"))
  .catch((er) => console.error(er));

const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection) => {
  console.log("connected");
});
