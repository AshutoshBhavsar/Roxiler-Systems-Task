const express = require('express');
const { getStores, submitRating } = require('../controllers/user.controller');
const protect = require('../middleware/auth.middleware');
const restrictTo = require('../middleware/role.middleware');
const { submitRatingValidators } = require('../validators/user.validators');
const handleValidationErrors = require('../middleware/validate.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(protect, restrictTo(ROLES.NORMAL_USER));

router.get('/stores', getStores);
router.post('/ratings', submitRatingValidators, handleValidationErrors, submitRating);

module.exports = router;
