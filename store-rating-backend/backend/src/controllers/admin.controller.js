const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');
const { ROLES } = require('../utils/constants');

const SALT_ROUNDS = 10;

async function getDashboard(req, res) {
  try {
    const [userCount, storeCount, ratingCount] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ userCount, storeCount, ratingCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
}

async function createUser(req, res) {
  try {
    const { name, email, password, address, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashed, address, role });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
}

async function getUsers(req, res) {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const allowed = ['name', 'email', 'address', 'role', 'createdAt'];
    const sortField = allowed.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const users = await User.findAll({ where, order: [[sortField, sortOrder]] });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let averageRating = null;
    if (user.role === ROLES.STORE_OWNER) {
      const store = await Store.findOne({ where: { ownerId: user.id } });
      if (store) {
        const result = await Rating.findOne({
          where: { storeId: store.id },
          attributes: [[sequelize.fn('AVG', sequelize.col('value')), 'avg']],
          raw: true,
        });
        averageRating = result?.avg ? parseFloat(result.avg).toFixed(1) : '0.0';
      }
    }

    res.json({ user, averageRating });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
}

async function createStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) return res.status(404).json({ message: 'Owner not found' });
      if (owner.role !== ROLES.STORE_OWNER) {
        return res.status(400).json({ message: 'Selected user is not a Store Owner' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json({ message: 'Store created successfully', store });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create store', error: err.message });
  }
}

async function getStores(req, res) {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const allowed = ['name', 'email', 'address', 'createdAt'];
    const sortField = allowed.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({ where, order: [[sortField, sortOrder]] });

    
    const storeIds = stores.map((s) => s.id);
    let ratingMap = {};
    if (storeIds.length > 0) {
      const ratings = await Rating.findAll({
        where: { storeId: storeIds },
        attributes: [
          'storeId',
          [sequelize.fn('AVG', sequelize.col('value')), 'avg'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['storeId'],
        raw: true,
      });
      ratings.forEach((r) => {
        ratingMap[r.storeId] = { avg: parseFloat(r.avg).toFixed(1), count: r.count };
      });
    }

    const result = stores.map((s) => ({
      ...s.toJSON(),
      averageRating: ratingMap[s.id]?.avg || '0.0',
      ratingCount: ratingMap[s.id]?.count || 0,
    }));

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stores', error: err.message });
  }
}


async function getOwners(req, res) {
  try {
    const owners = await User.findAll({
      where: { role: ROLES.STORE_OWNER },
      attributes: ['id', 'name', 'email'],
      order: [['name', 'ASC']],
    });
    res.json({ owners });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch owners', error: err.message });
  }
}

module.exports = { getDashboard, createUser, getUsers, getUserById, createStore, getStores, getOwners };
