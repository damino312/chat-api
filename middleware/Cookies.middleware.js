const { jwtSecret } = require("../config/config");
const jwt = require("jsonwebtoken");

const checkCookies = function (req, res, next) {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) {
        console.error(err);
        return;
      }
      res.locals.userData = userData;
      next();
    });
  } else {
    console.log("no token");
    return;
  }
};

module.exports = { checkCookies };
