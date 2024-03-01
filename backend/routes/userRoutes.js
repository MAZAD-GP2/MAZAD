const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");
require("dotenv").config();

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.send(users);
  } catch (err) {
    return res.send(err);
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(res.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    return res.send(user);
  } catch (err) {
    return res.send(err);
  }
};

module.exports.register = async (req, res) => {
  try {
    const { username, password, email, phoneNumber } = req.body;

    const usernameExists = await User.findOne({
      where: { username: username },
    });
    if (usernameExists) {
      throw new Error("Username already used");
    }
    const emailExists = await User.findOne({
      where: { email: email },
    });
    if (emailExists) {
      throw new Error("Email already used");
    }
    const phoneNumberExsits = await User.findOne({
      where: { phoneNumber: phoneNumber },
    });
    if (phoneNumberExsits) {
      throw new Error("PhoneNumber already used");
    }

    hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT)
    );

    let newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
    });

    const token = await generateJWT({
      email: newUser.email,
      id: newUser.id,
      role: newUser.isAdmin,
    });

    return res.status(201).json({ ...newUser.dataValues, token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
