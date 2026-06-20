const express = require('express');
const { getDashboard, createUser, getUsers, getUserById, createStore, getStores, getOwners } = require('../controllers/admin.controller');
const protect = require('../middleware/auth.middleware');
const restrictTo = require('../middleware/role.middleware');
const { createUserValidators, createStoreValidators } = require('../validators/admin.validators');
const handleValidationErrors = require('../middleware/validate.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(protect, restrictTo(ROLES.SYSTEM_ADMIN));

router.get('/dashboard', getDashboard);

router.post('/users', createUserValidators, handleValidationErrors, createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

router.post('/stores', createStoreValidators, handleValidationErrors, createStore);
router.get('/stores', getStores);

router.get('/owners', getOwners);

module.exports = router;
