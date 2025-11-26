// backend/config/generateToken.js
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "1234", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
