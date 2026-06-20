const { Op } = require('sequelize');
const { Store, Rating, sequelize } = require('../models');


async function getStores(req, res) {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
    const userId = req.user.id;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const allowed = ['name', 'address', 'createdAt'];
    const sortField = allowed.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const stores = await Store.findAll({ where, order: [[sortField, sortOrder]] });

    const storeIds = stores.map((s) => s.id);
    let avgMap = {};
    let userRatingMap = {};

    if (storeIds.length > 0) {
      const avgRatings = await Rating.findAll({
        where: { storeId: storeIds },
        attributes: [
          'storeId',
          [sequelize.fn('AVG', sequelize.col('value')), 'avg'],
        ],
        group: ['storeId'],
        raw: true,
      });
      avgRatings.forEach((r) => {
        avgMap[r.storeId] = parseFloat(r.avg).toFixed(1);
      });

      const userRatings = await Rating.findAll({
        where: { storeId: storeIds, userId },
        attributes: ['storeId', 'value'],
        raw: true,
      });
      userRatings.forEach((r) => {
        userRatingMap[r.storeId] = r.value;
      });
    }

    const result = stores.map((s) => ({
      ...s.toJSON(),
      averageRating: avgMap[s.id] || '0.0',
      userRating: userRatingMap[s.id] || null,
    }));

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stores', error: err.message });
  }
}

async function submitRating(req, res) {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.id;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const existing = await Rating.findOne({ where: { userId, storeId } });

    if (existing) {
      existing.value = value;
      await existing.save();
      return res.json({ message: 'Rating updated successfully', rating: existing });
    }

    const rating = await Rating.create({ userId, storeId, value });
    res.status(201).json({ message: 'Rating submitted successfully', rating });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
}

module.exports = { getStores, submitRating };
