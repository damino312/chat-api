const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", schema);

module.exports = MessageModel;
