const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    login: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("User", schema);

module.exports = UserModel;
