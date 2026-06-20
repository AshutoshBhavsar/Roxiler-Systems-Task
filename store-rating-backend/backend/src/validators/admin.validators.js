const { body } = require('express-validator');
const { nameRule, emailRule, addressRule, passwordRule } = require('./auth.validators');
const { ROLES } = require('../utils/constants');

const roleRule = body('role')
  .isIn(Object.values(ROLES))
  .withMessage(`Role must be one of: ${Object.values(ROLES).join(', ')}`);

const createUserValidators = [nameRule, emailRule, addressRule, passwordRule('password'), roleRule];

const createStoreValidators = [
  nameRule,
  emailRule,
  addressRule,
  body('ownerId').optional({ nullable: true }).isInt().withMessage('ownerId must be a valid user ID'),
];

module.exports = { createUserValidators, createStoreValidators };
