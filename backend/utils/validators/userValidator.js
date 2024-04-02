const { body, validationResult } = require("express-validator");
const User = require("../../models/User");

// Validation middleware for user creation
exports.validateUserCreation = [
  body("username")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Username must be between 6 and 20 characters long")
    .matches(/^[a-zA-Z][a-zA-Z0-9_.\s]+$/)
    .withMessage("Username can only start with a letter and contain letters, numbers, underscores, dots, and spaces")
    .custom(async (value) => {
      const existingUser = await User.findOne({ where: { username: value } });
      if (existingUser) {
        throw new Error("Username already exists");
      }
    }),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error("Email already exists");
      }
    }),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .matches(/^(07[789]\d{7})$/)
    .withMessage("Invalid phone number format")
    .custom(async (value) => {
      const user = await User.findOne({ where: { phoneNumber: value } });
      if (user) {
        throw new Error("Phone number already exists");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

// Validation middleware for user update
exports.validateUserUpdate = [
  body("username")
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("Username must be between 6 and 20 characters long")
    .matches(/^[a-zA-Z][a-zA-Z0-9_.\s]+$/)
    .withMessage("Username can only start with a letter and contain letters, numbers, underscores, dots, and spaces")
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({ where: { username: value } });
      if (existingUser && existingUser.id !== req.currentUser.id) {
        throw new Error("Username already exists");
      }
    }),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: value } });
      const parsedId=parseInt(req.currentUser.id)
      if (user && user.id !== parsedId) {
        throw new Error("Email already exists");
      }
    }),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .matches(/^(07[789]\d{7})$/)
    .withMessage("Invalid phone number format")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { phoneNumber: value } });
      const parsedId=parseInt(req.currentUser.id)
      if (user && user.id !== parsedId) {
        throw new Error("Phone number already exists");
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];

exports.validatePasswordUpdate = [
  body("password")
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  },
];