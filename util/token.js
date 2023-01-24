const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  try {
    return jwt.sign(
      {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "10h" }
    );
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateToken,
};
