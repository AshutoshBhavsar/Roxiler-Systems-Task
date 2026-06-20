const { body } = require('express-validator');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).{8,16}$/;

const nameRule = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('Must be a valid email address')
  .normalizeEmail();

const addressRule = body('address')
  .trim()
  .isLength({ min: 1, max: 400 })
  .withMessage('Address is required and must be at most 400 characters');

const passwordRule = (field = 'password') =>
  body(field)
    .matches(PASSWORD_REGEX)
    .withMessage(
      `${field} must be 8-16 characters and include at least one uppercase letter and one special character`
    );

const signupValidators = [nameRule, emailRule, addressRule, passwordRule('password')];

const loginValidators = [
  body('email').trim().isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updatePasswordValidators = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordRule('newPassword'),
];

module.exports = {
  PASSWORD_REGEX,
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
  signupValidators,
  loginValidators,
  updatePasswordValidators,
};
