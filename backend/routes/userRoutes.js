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
    const {
      username,
      password,
      confirmPassword,
      email,
      phoneNumber,
    } = req.body;

    if (!password) {
      return res.status(400).send("password missing");
    }

    if (!confirmPassword || password !== confirmPassword) {
      return res.status(400).send("Passwords don't match");
    }

    // Ensure password is a string
    if (typeof password !== "string") {
      return res.status(400).send("Password must be a string");
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT);

    if (isNaN(saltRounds)) {
      return res.status(500).send("Invalid BCRYPT_SALT value");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
    });

    const token = await generateJWT({ ...newUser.dataValues });

    return res.status(201).json({ ...newUser.dataValues, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      },
    });

    if (!user) {
      throw new Error("login credentials are incorrect");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("login credentials are incorrect");
    }

    const token = await generateJWT({ ...user.dataValues });

    return res.status(200).json({ ...user.dataValues, token });
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

    if(alreadyHasToken) {
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

    if (
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
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
