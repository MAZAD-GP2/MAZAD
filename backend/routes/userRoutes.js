const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");
require("dotenv").config();
const { Op } = require("sequelize");

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
    const user = await User.findByPk(req.params.id);
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

    if (!password) {
      return res.status(400).send("password missing");
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

    const token = await generateJWT({ ...newUser.dataValues });

    return res.status(201).json({ ...newUser.dataValues, token });
  } catch (err) {
    return res.send(err.errors[0].message);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      throw new Error("login credentials are incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("login credentials are incorrect");
    }

    const token = await generateJWT({ ...user.dataValues });

    return res.status(200).json({ ...user.dataValues, token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
