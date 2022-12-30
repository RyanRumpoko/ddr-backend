const User = require("../../models/User");

const getAllUsers = async (_, __, { req }) => {
  try {
    return await User.find().sort({ createdAt: 1 });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const login = async (_, { input: { username, password } }) => {
  try {
    await isNullOrEmpty([
      { label: "Username", value: username },
      { label: "Password", value: password },
    ]);

    let user;
    user = await User.findOne({
      username: username.toLowerCase(),
    });
    if (!user) {
      throw new UserInputError("Invalid Credentials");
    }

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  Query: {
    getAllUsers,
  },
  Mutation: {
    login,
  },
};
