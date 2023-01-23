const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  try {
    return jwt.sign(
      {
        _id: user._id,
        username: user.username,
      },
      process.env.SECRET_KEY
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateToken,
};
