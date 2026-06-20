const { body } = require('express-validator');

const submitRatingValidators = [
  body('storeId').isInt({ gt: 0 }).withMessage('A valid store ID is required'),
  body('value')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating value must be between 1 and 5'),
];

module.exports = { submitRatingValidators };
