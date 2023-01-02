const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split("Bearer ")[1];
      if (token) {
        try {
          const user = jwt.verify(token, process.env.SECRET_KEY);
          return user;
        } catch (error) {
          throw new Error("Invalid / Expired token or Not Authorized");
        }
      }
      throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error("Authorization header must be provided");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
