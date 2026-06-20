const express = require('express');
const { getDashboard } = require('../controllers/storeOwner.controller');
const protect = require('../middleware/auth.middleware');
const restrictTo = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(protect, restrictTo(ROLES.STORE_OWNER));

router.get('/dashboard', getDashboard);

module.exports = router;
