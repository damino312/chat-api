const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// ---------Web Socket ----------

const ws = require("ws");
const jwt = require("jsonwebtoken");
const jwtSecret = "my_jsw_secret";

const User = require("./models/User.model");
const Message = require("./models/Message.model");
// ------------------------------

const UserRoutes = require("./routes/User.route");
const MessageRoutes = require("./routes/Message.route");

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(UserRoutes);
app.use(MessageRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/chat")
  .then(() => console.log("MongoDB has been connected"))
  .catch((er) => console.error(er));

const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  function notifyAboutOnlineUsers() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.userName,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlineUsers();
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    console.log("pong ", [...wss.clients].length);
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  // отображение
  if (cookies) {
    const tokenCookieString = cookies
      .split(";")
      .find((str) => str.startsWith("token=")); //start with
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { id, name } = userData;
          connection.userId = id;
          connection.userName = name;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;
    if (recipient && text) {
      //saving messages into db

      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
      });
      console.log(messageDoc.text);

      [...wss.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) => {
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              _id: messageDoc._id.toString(),
            })
          );
        });
    }
  });

  notifyAboutOnlineUsers();
});
