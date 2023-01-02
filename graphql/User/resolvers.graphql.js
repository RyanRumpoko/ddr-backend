const bcrypt = require("bcryptjs");

const { validateLoginInput } = require("../../util/validators");
const { generateToken } = require("../../util/token");
const checkAuth = require("../../util/checkauth");
const User = require("../../models/User");

const getAllUsers = async (_, __, { req }) => {
  try {
    checkAuth(req);
    return await User.find().sort({ createdAt: 1 });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addUser = async (_, { input: { username, password } }, { req }) => {
  try {
    checkAuth(req);
    if (password === "") {
      throw new Error("Password cannot be empty.");
    }

    const user = await User.findOne({ username });
    if (user) {
      throw new Error("Username is taken");
    }

    password = await bcrypt.hash(password, 12);
    const newUser = new User({
      username: username.toLowerCase(),
      password,
    });
    const res = await newUser.save();

    return {
      ...res._doc,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const login = async (_, { input: { username, password } }) => {
  try {
    const { errors, valid } = validateLoginInput(username, password);
    if (!valid) {
      throw new Error("Errors");
    }

    const user = await User.findOne({
      username: username.toLowerCase(),
    });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Wrong credentials");
    }

    const token = generateToken(user);
    const newUser = await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        token,
      },
      { new: true }
    );

    return {
      ...newUser._doc,
      id: newUser._id,
      username: newUser.username,
      token,
    };
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
    addUser,
  },
};
