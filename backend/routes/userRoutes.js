const User = require("../models/User");
const ResetPasswordToken = require("../models/ResetPasswordToken");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJWT");
require("dotenv").config();
const { Op } = require("sequelize");
const Sequelize = require("sequelize").Sequelize;
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloudinaryConfig");
const Bid = require("../models/Bid");
const Auction = require("../models/Auction");
const Image = require("../models/Image");
const Item = require("../models/Item");

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
      profilePicture: newUser.profilePicture,
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
      profilePicture: user.profilePicture,
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
    const { username, email, phoneNumber } = req.body;
    let profilePicture = req.currentUser.profilePicture;

    const userId = req.currentUser.id;

    const user = await User.findByPk(userId);

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profilePicture = result.url;
    }

    await user.update({
      username,
      email,
      phoneNumber,
      profilePicture,
    });

    const token = await generateJWT({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
    });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      token,
    };

    return res.json(userData);
  } catch (err) {
    return res.send(err);
  }
};

module.exports.passwordUpdate = async (req, res) => {
  try {
    const { password } = req.body;

    const userId = req.currentUser.id;

    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.findByPk(userId);

    await user.update({
      password: hashedPassword,
    });

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
      profilePicture: user.profilePicture,
      token,
    };

    return res.json(userData);
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

module.exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    const bidCount = await Bid.count({
      where: {
        userId,
      },
    });

    const AuctionsWonCount = await Bid.findAll({
      where: {
        userId,
        bidAmount: Sequelize.col("Auction.highestBid"), // Comparing bid amount with highest bid amount
      },
      attributes: ["auctionId"],
      include: [
        {
          model: Auction,
          required: true, // This ensures that only bids with corresponding auctions are included
          where: {
            finishTime: { [Sequelize.Op.lt]: Sequelize.literal("NOW()") }, // Only include auctions with finishTime in the past
          },
          attributes: [],
        },
      ],
      distinct: true, // Ensure that only distinct auction IDs are counted
    });

    // loop over and only get distinct auction ids
    let auctionIds = AuctionsWonCount.map((auction) => auction.auctionId);
    auctionIds = [...new Set(auctionIds)];

    return res.json({ bidCount, AuctionsWonCount: auctionIds.length });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getBidHistory = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const bids =await Bid.findAll({
      where: { userId },
      include: [
        {
          model: Auction,
          attributes: ["highestBid", "finishTime", "startTime"],
          include: [
            {
              model: Item,
              attributes: ["name", "description", "id"],
              include: [
                {
                  model: Image,
                  attributes: ["imgURL"],
                  count: 1,
                },
              ],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    const count = await Bid.count({where: { userId }})

    return res.json({ count, bids });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
