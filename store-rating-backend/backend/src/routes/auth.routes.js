const express = require('express');
const { signup, login, updatePassword } = require('../controllers/auth.controller');
const { signupValidators, loginValidators, updatePasswordValidators } = require('../validators/auth.validators');
const handleValidationErrors = require('../middleware/validate.middleware');
const protect = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', signupValidators, handleValidationErrors, signup);
router.post('/login', loginValidators, handleValidationErrors, login);
router.put('/update-password', protect, updatePasswordValidators, handleValidationErrors, updatePassword);

module.exports = router;
