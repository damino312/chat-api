const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); //убрать

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "my_jsw_secret";

const RegisterUser = async (req, res) => {
  const { login, name, password } = req.body;

  try {
    await User.create({
      login,
      name,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.status(201).json(true);
  } catch (er) {
    console.error(er);
    res.status(400).json(false);
  }
};

const LoginUser = async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login: login });
  if (user) {
    const pass = bcrypt.compareSync(password, user.password);
    if (pass) {
      jwt.sign(
        { id: user._id, name: user.name },
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            console.error(err);
            res.json("Ошибка при создании токена").status(500);
            return;
          }
          res.cookie("token", token).json(user);
        }
      );
    } else {
      console.log("Неверный пароль");
      res.status(400).json("Неверный пароль");
    }
  } else {
    console.log("Пользователь не найден");
    res.status(400).json("Пользователь не найден");
  }
};

const GetUser = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error(err);
        res.json("Error in creating a token").status(500);
        return;
      }
      try {
        const { login, avatar, name, id } = await User.findById(userData.id);
        res.json({ login, avatar, name, id });
      } catch (er) {
        res.status(500).send(er);
        console.log(err);
      }
    });
  } else {
    res.status(400).json("Не залогинен");
  }
};

const GetAllUsers = async (req, res) => {
  const users = await User.find({}, { _id: 1, name: 1 });
  res.json(users);
};

const LogOut = (req, res) => {
  res.cookie("token", "").json("Разлогинен");
};

module.exports = { RegisterUser, LoginUser, GetUser, GetAllUsers, LogOut };
