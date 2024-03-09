const { body, validationResult } = require("express-validator");
const User = require("../../models/User");

// Validation middleware for user creation
exports.validateUserCreation = [
  body("username")
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 64 })
    .withMessage("Username must be between 3 and 64 characters long")
    .matches(/^[\w\d]+$/)
    .withMessage(
      "Username can only contain alphabet English letters, underscore, and numbers"
    ),
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
      const user = await User.findOne({
        where: { phoneNumber: value },
      });
      if (user) {
        throw new Error("Phone number already exists");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 64 })
    .withMessage("Password must be between 8 and 64 characters long")
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
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation middleware for user update
exports.validateUserUpdate = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 8, max: 64 })
    .withMessage("Password must be between 8 and 64 characters long")
    .matches(/^[\w\d]+$/)
    .withMessage(
      "Username can only contain alphabet English letters, underscore, and numbers"
    ),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { email: value } });
      if (user && user.id !== req.params.userId) {
        throw new Error("Email already exists");
      }
    }),
  body("phoneNumber")
    .optional()
    .trim()
    .matches(/^(07[789]\d{7})$/)
    .withMessage("Invalid phone number format")
    .custom(async (value, { req }) => {
      const user = await User.findOne({
        where: { phoneNumber: value },
      });
      if (user && user.id !== req.params.userId) {
        throw new Error("Phone number already exists");
      }
    }),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
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
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];