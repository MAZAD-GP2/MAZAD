const { body, validationResult } = require('express-validator');
const Item = require('../../models/Item');

// Validation middleware for item creation
exports.validateItemCreation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').optional().trim(),
  //body('isRare').optional().isBoolean().withMessage('isRare must be a boolean value'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation middleware for item update
exports.validateItemUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('description').optional().trim(),
  //body('isRare').optional().isBoolean().withMessage('isRare must be a boolean value'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
