const jwt = require("jsonwebtoken");

const tokenSign = async (user_data) => {
  return jwt.sign(user_data, process.env.JWT_SECRET, { expiresIn: "10h" });
};

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const decodeSign = async (token) => {
  return jwt.decode(token, null);
};

module.exports = { tokenSign, verifyToken, decodeSign };
