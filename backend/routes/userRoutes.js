const User = require("../models/User");
const ResetPasswordToken = require("../models/ResetPasswordToken");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");
require("dotenv").config();
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

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

    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
    });

    // exclude the hashed password from the user object
    const token = await generateJWT({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      phoneNumber: newUser.phoneNumber,
    });

    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      phoneNumber: newUser.phoneNumber,
      token,
    };

    return res.status(201).json(userData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    let { usernameOrEmail, password } = req.body;

    usernameOrEmail = usernameOrEmail.trim();

    const user = await User.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      throw new Error("Username or email doesn't exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Password is incorrect");
    }

    // exclude the hashed password from the user object
    const token = await generateJWT({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      phoneNumber: user.phoneNumber,
    });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      phoneNumber: user.phoneNumber,
      token,
    };

    return res.status(200).json(userData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const alreadyHasToken = await ResetPasswordToken.findOne({
      where: { userId: user.id },
    });

    if (alreadyHasToken) {
      await alreadyHasToken.destroy();
    }

    const token = uuidv4();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    expirationDate = expirationDate.toDateString();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "_MAZAD_ Password Reset",
      text: `Click the following link to reset your password: http://localhost:PORT/reset-password?token=${token} \n\n**This link expires on ${expirationDate}**`,
    };

    await transporter.sendMail(mailOptions);

    await ResetPasswordToken.create({
      userId: user.id,
      token,
    });

    return res.status(200).send("Email sent");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    const resetPasswordToken = await ResetPasswordToken.findOne({
      where: {
        token,
      },
    });

    if (!resetPasswordToken) {
      throw new Error("Token not found");
    }
    // check if the password is older than 1 week
    const tokenDate = new Date(resetPasswordToken.createdAt);
    const currentDate = new Date();
    const difference = currentDate - tokenDate;
    const daysDifference = difference / (1000 * 60 * 60 * 24); // to days
    if (daysDifference > 7) {
      await resetPasswordToken.destroy();
      throw new Error("Token not found");
    }

    if (!password || !confirmPassword || password !== confirmPassword) {
      throw new Error("Passwords don't match");
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT)
    );

    await User.update(
      { password: hashedPassword },
      {
        where: {
          id: resetPasswordToken.userId,
        },
      }
    );

    await resetPasswordToken.destroy();

    return res.status(200).send("Password reset successfully");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    const userId = req.currentUser.id;

    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.findByPk(userId);

    await user.update({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    return res.json({ user });
  } catch (err) {
    return res.send(err);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const userid = req.params.id;
    const user = await User.findByPk(userid);
    if (!user) {
      throw new Error("user not found");
    }
    await user.destroy();
    return res.send("successfully");
  } catch (err) {
    return res.send(err);
  }
};
