const Message = require("../models/Message.model");
const jwt = require("jsonwebtoken");
const jwtSecret = "my_jsw_secret"; // убрать

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) {
          console.error(err);
          return;
        }
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

const GetUsersMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.id;
    const messages = await Message.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { GetUsersMessages };
